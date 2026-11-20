variable "project_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "db_endpoint" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "cognito_user_pool_id" {
  type = string
}

variable "cognito_client_id" {
  type = string
}

variable "cognito_client_secret" {
  type      = string
  sensitive = true
}

variable "cognito_domain" {
  type = string
}

variable "alb_dns_name" {
  type = string
}

variable "sender_email" {
  type = string
}

variable "ses_smtp_username" {
  type      = string
  default   = ""
  sensitive = true
}

variable "ses_smtp_password" {
  type      = string
  default   = ""
  sensitive = true
}

variable "sqs_queue_url" {
  type = string
}
