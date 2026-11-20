# ==============================================================================
# Terraform Remote State Backend (Amazon S3 + DynamoDB Locking)
# ==============================================================================

terraform {
  backend "s3" {
    bucket         = "bookfair-tfstate-744264411889"
    key            = "environments/prod/terraform.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "bookfair-tf-locks"
    encrypt        = true
  }
}
