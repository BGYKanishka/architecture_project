# ==============================================================================
# Database Module: RDS Subnet Group & Single-AZ PostgreSQL Instance
# ==============================================================================

resource "aws_db_subnet_group" "db_subnets" {
  name        = "${var.project_name}-db-subnet-group"
  description = "DB Subnet Group spanning ap-southeast-2a and ap-southeast-2b"
  subnet_ids  = var.private_subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier        = "${var.project_name}-db"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.db_subnets.name
  vpc_security_group_ids = [var.db_security_group_id]

  # Cost Optimization (Free Tier Single-AZ)
  multi_az            = false
  publicly_accessible = false
  skip_final_snapshot = true

  auto_minor_version_upgrade = true

  tags = {
    Name = "${var.project_name}-db"
  }
}
