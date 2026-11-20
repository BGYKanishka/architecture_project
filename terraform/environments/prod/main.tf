# ==============================================================================
# Production Environment Orchestrator (Root Module)
# ==============================================================================

# 1. Networking Tier (VPC & Subnets)
module "networking" {
  source = "../../modules/networking"

  project_name          = var.project_name
  aws_region            = var.aws_region
  vpc_cidr              = var.vpc_cidr
  public_subnet_1_cidr  = var.public_subnet_1_cidr
  public_subnet_2_cidr  = var.public_subnet_2_cidr
  private_subnet_1_cidr = var.private_subnet_1_cidr
  private_subnet_2_cidr = var.private_subnet_2_cidr
}

# 2. Security Tier (Firewalls & Zero-SSH)
module "security" {
  source = "../../modules/security"

  project_name = var.project_name
  vpc_id       = module.networking.vpc_id
}

# 3. Database Tier (PostgreSQL Free Tier)
module "database" {
  source = "../../modules/database"

  project_name         = var.project_name
  private_subnet_ids   = module.networking.private_subnet_ids
  db_security_group_id = module.security.db_sg_id
  db_instance_class    = var.db_instance_class
  db_name              = var.db_name
  db_username          = var.db_username
  db_password          = var.db_password
}

# 4. Container Registries
module "registry" {
  source = "../../modules/registry"
}

# 5. Messaging & Email Buffer Tier
module "messaging" {
  source = "../../modules/messaging"

  project_name = var.project_name
  sender_email = var.sender_email
}

# 6. Compute & Ingress Tier (Dual EC2 Nodes + ALB)
module "compute" {
  source = "../../modules/compute"

  project_name          = var.project_name
  aws_region            = var.aws_region
  vpc_id                = module.networking.vpc_id
  public_subnet_1_id    = module.networking.public_subnet_1_id
  public_subnet_2_id    = module.networking.public_subnet_2_id
  alb_security_group_id = module.security.alb_sg_id
  web_security_group_id = module.security.web_sg_id
  ec2_instance_type     = var.ec2_instance_type
  sqs_queue_arn         = module.messaging.queue_arn
  sqs_dlq_arn           = module.messaging.dlq_arn
}

# 7. Identity & Authentication Tier (Cognito BFF)
module "auth" {
  source = "../../modules/auth"

  project_name          = var.project_name
  alb_dns_name          = module.compute.alb_dns_name
  cognito_domain_prefix = var.cognito_domain_prefix
  cognito_callback_urls = var.cognito_callback_urls
  cognito_logout_urls   = var.cognito_logout_urls
}

# 8. Secrets Manager Vault Tier
module "secrets" {
  source = "../../modules/secrets"

  project_name          = var.project_name
  aws_region            = var.aws_region
  db_endpoint           = module.database.endpoint
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  cognito_user_pool_id  = module.auth.user_pool_id
  cognito_client_id     = module.auth.client_id
  cognito_client_secret = module.auth.client_secret
  cognito_domain        = module.auth.domain
  alb_dns_name          = module.compute.alb_dns_name
  sender_email          = var.sender_email
  ses_smtp_username     = var.ses_smtp_username
  ses_smtp_password     = var.ses_smtp_password
  sqs_queue_url         = module.messaging.queue_url
}
