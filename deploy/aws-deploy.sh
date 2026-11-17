#!/usr/bin/env bash
set -euo pipefail
umask 077

image_tag="${1:?Pass the immutable 40-character Git commit SHA}"
if [[ ! "${image_tag}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Image tag must be a 40-character lowercase Git SHA." >&2
  exit 2
fi

install -d -o root -g root -m 700 /etc/bookfair
install -d -o root -g root -m 755 /opt/bookfair
config_file=/etc/bookfair/deploy.conf
if [[ ! -r "${config_file}" ]]; then
  echo "Missing ${config_file}." >&2
  exit 1
fi
# This file is root-owned deployment configuration, not a checked-in file.
source "${config_file}"
: "${AWS_REGION:?Set AWS_REGION in ${config_file}}"
: "${AWS_ACCOUNT_ID:?Set AWS_ACCOUNT_ID in ${config_file}}"
: "${RUNTIME_SECRET_ARN:?Set RUNTIME_SECRET_ARN in ${config_file}}"
if [[ ! "${AWS_ACCOUNT_ID}" =~ ^[0-9]{12}$ ]]; then
  echo "AWS_ACCOUNT_ID must be the 12-digit account number." >&2
  exit 2
fi
if [[ ! -r /etc/bookfair/rds-global-bundle.pem ]]; then
  echo "Missing readable /etc/bookfair/rds-global-bundle.pem." >&2
  exit 1
fi

registry="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
secret_tmp=/etc/bookfair/runtime.env.tmp
release_tmp=/etc/bookfair/release.env.tmp

aws secretsmanager get-secret-value \
  --region "${AWS_REGION}" \
  --secret-id "${RUNTIME_SECRET_ARN}" \
  --query SecretString \
  --output text > "${secret_tmp}"
chmod 600 "${secret_tmp}"

# Enforce production custom HTTPS domain and cookie security settings
sed -i 's|^APP_PUBLIC_URL=.*|APP_PUBLIC_URL=https://bookfair.larmora.com|' "${secret_tmp}"
sed -i 's|^SESSION_COOKIE_SECURE=.*|SESSION_COOKIE_SECURE=true|' "${secret_tmp}"
sed -i 's|^CSRF_COOKIE_SECURE=.*|CSRF_COOKIE_SECURE=true|' "${secret_tmp}"
sed -i 's|^CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=https://bookfair.larmora.com,http://localhost:3000|' "${secret_tmp}"

for required_key in \
  SPRING_DATASOURCE_URL SPRING_DATASOURCE_USERNAME SPRING_DATASOURCE_PASSWORD \
  AWS_REGION \
  COGNITO_USER_POOL_ID COGNITO_CLIENT_ID COGNITO_CLIENT_SECRET COGNITO_DOMAIN \
  APP_PUBLIC_URL SESSION_COOKIE_SECURE CSRF_COOKIE_SECURE CORS_ALLOWED_ORIGINS \
  SPRING_MAIL_USERNAME SPRING_MAIL_PASSWORD APP_MAIL_FROM; do
  if ! grep -q "^${required_key}=." "${secret_tmp}"; then
    echo "Runtime secret is missing ${required_key}." >&2
    rm -f "${secret_tmp}"
    exit 1
  fi
done
mv -f "${secret_tmp}" /etc/bookfair/runtime.env

printf 'ECR_REGISTRY=%s\nIMAGE_TAG=%s\n' "${registry}" "${image_tag}" > "${release_tmp}"
chmod 600 "${release_tmp}"
mv -f "${release_tmp}" /etc/bookfair/release.env

aws ecr get-login-password --region "${AWS_REGION}" \
  | docker login --username AWS --password-stdin "${registry}"
trap 'docker logout "${registry}" >/dev/null 2>&1 || true' EXIT

compose_file=/opt/bookfair/docker-compose.aws.yml
docker compose \
  --project-name cibf \
  --env-file /etc/bookfair/release.env \
  --file "${compose_file}" \
  pull
docker compose \
  --project-name cibf \
  --env-file /etc/bookfair/release.env \
  --file "${compose_file}" \
  up --detach --remove-orphans

