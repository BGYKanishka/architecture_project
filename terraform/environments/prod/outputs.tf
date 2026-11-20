# ==============================================================================
# Production Environment Outputs
# ==============================================================================

output "alb_dns_name" {
  description = "Public URL of the Application Load Balancer"
  value       = module.compute.alb_dns_name
}

output "rds_endpoint" {
  description = "Private PostgreSQL database endpoint"
  value       = module.database.endpoint
}

output "ec2_node_1_id" {
  description = "EC2 Instance ID for Node 1 (ap-southeast-2a)"
  value       = module.compute.node_1_id
}

output "ec2_node_2_id" {
  description = "EC2 Instance ID for Node 2 (ap-southeast-2b)"
  value       = module.compute.node_2_id
}

output "ecr_backend_url" {
  description = "Amazon ECR URL for backend image"
  value       = module.registry.backend_repository_url
}

output "ecr_frontend_url" {
  description = "Amazon ECR URL for frontend image"
  value       = module.registry.frontend_repository_url
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.auth.user_pool_id
}

output "cognito_client_id" {
  description = "Cognito App Client ID"
  value       = module.auth.client_id
}

output "cognito_domain" {
  description = "Cognito Hosted UI Domain"
  value       = "https://${module.auth.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "sqs_queue_url" {
  description = "Primary SQS email queue URL"
  value       = module.messaging.queue_url
}

output "runtime_secret_arn" {
  description = "AWS Secrets Manager ARN holding runtime config"
  value       = module.secrets.secret_arn
}
