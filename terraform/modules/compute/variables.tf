variable "project_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_1_id" {
  type = string
}

variable "public_subnet_2_id" {
  type = string
}

variable "alb_security_group_id" {
  type = string
}

variable "web_security_group_id" {
  type = string
}

variable "ec2_instance_type" {
  type    = string
  default = "t3.small"
}

variable "sqs_queue_arn" {
  type = string
}

variable "sqs_dlq_arn" {
  type = string
}
