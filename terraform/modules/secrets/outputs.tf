output "secret_arn" {
  value = aws_secretsmanager_secret.runtime.arn
}

output "secret_name" {
  value = aws_secretsmanager_secret.runtime.name
}
