# ==============================================================================
# Secrets Module: AWS Secrets Manager for Runtime Configuration
# ==============================================================================

resource "aws_secretsmanager_secret" "runtime" {
  name                    = "${var.project_name}-runtime-secrets"
  description             = "Runtime environment secrets for EC2 deployment"
  recovery_window_in_days = 0

  tags = {
    Name = "${var.project_name}-runtime-secrets"
  }
}

resource "aws_secretsmanager_secret_version" "runtime_version" {
  secret_id = aws_secretsmanager_secret.runtime.id

  secret_string = jsonencode({
    SPRING_DATASOURCE_URL      = "jdbc:postgresql://${var.db_endpoint}/${var.db_name}"
    SPRING_DATASOURCE_USERNAME = var.db_username
    SPRING_DATASOURCE_PASSWORD = var.db_password
    AWS_REGION                 = var.aws_region
    COGNITO_USER_POOL_ID       = var.cognito_user_pool_id
    COGNITO_CLIENT_ID          = var.cognito_client_id
    COGNITO_CLIENT_SECRET      = var.cognito_client_secret
    COGNITO_DOMAIN             = "https://${var.cognito_domain}.auth.${var.aws_region}.amazoncognito.com"
    APP_PUBLIC_URL             = "http://${var.alb_dns_name}"
    SESSION_COOKIE_SECURE      = "false"
    CSRF_COOKIE_SECURE         = "false"
    CORS_ALLOWED_ORIGINS       = "http://${var.alb_dns_name},http://localhost:3000,http://localhost:5173"
    SPRING_MAIL_HOST           = "email-smtp.${var.aws_region}.amazonaws.com"
    SPRING_MAIL_PORT           = "587"
    SPRING_MAIL_USERNAME       = var.ses_smtp_username
    SPRING_MAIL_PASSWORD       = var.ses_smtp_password
    APP_MAIL_FROM              = var.sender_email
    AWS_SQS_EMAIL_QUEUE_URL    = var.sqs_queue_url
  })
}
