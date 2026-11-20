variable "aws_region" {
  description = "AWS selected Region"
  type        = string
  default     = "ap-southeast-2"
}

variable "environment" {
  type    = string
  default = "production"
}

variable "project_name" {
  type    = string
  default = "bookfair"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  type    = string
  default = "10.0.2.0/24"
}

variable "private_subnet_1_cidr" {
  type    = string
  default = "10.0.10.0/24"
}

variable "private_subnet_2_cidr" {
  type    = string
  default = "10.0.20.0/24"
}

variable "ec2_instance_type" {
  type    = string
  default = "t3.small"
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "db_name" {
  type    = string
  default = "bookfair_db"
}

variable "db_username" {
  type    = string
  default = "postgres"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "cognito_domain_prefix" {
  type    = string
  default = "ap-southeast-2mlvws715o"
}

variable "cognito_callback_urls" {
  type = list(string)
  default = [
    "http://localhost:8080/login/oauth2/code/cognito",
    "http://localhost:5173/auth/callback"
  ]
}

variable "cognito_logout_urls" {
  type = list(string)
  default = [
    "http://localhost:5173/login",
    "http://localhost:3000/login"
  ]
}

variable "sender_email" {
  type    = string
  default = "bgykanishka@gmail.com"
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
