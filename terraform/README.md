# Infrastructure as Code (Terraform)
## Colombo International Book Fair (CIBF) Cloud Infrastructure

This directory contains the production Infrastructure as Code (IaC) configuration for the Colombo International Book Fair platform on AWS, deployed in `ap-southeast-2` (Sydney).

---

## 🏛️ Architecture Overview

The infrastructure is organized using the **HashiCorp Modular Pattern**, decoupling cloud resources into self-contained reusable child modules coordinated by environment-level root modules:

```
terraform/
├── modules/
│   ├── networking/          # VPC, Internet Gateway, 4 Subnets (Multi-AZ), Route Tables
│   ├── security/            # Security Groups (ALB, EC2 Web, RDS)
│   ├── database/            # Amazon RDS PostgreSQL & DB Subnet Group
│   ├── compute/             # Dual EC2 Nodes, Application Load Balancer & IAM Profiles
│   ├── messaging/           # Amazon SQS Buffer Queue, DLQ & SES Identity
│   ├── registry/            # Private Amazon ECR Repositories (cibf-backend, cibf-frontend)
│   ├── auth/                # Amazon Cognito User Pool & OAuth2 BFF Client
│   └── secrets/             # AWS Secrets Manager Runtime Vault
│
└── environments/
    └── prod/                # Production Root Module
        ├── main.tf          # Module invocation and wiring
        ├── providers.tf     # AWS Provider configuration (ap-southeast-2)
        ├── variables.tf     # Configurable inputs and defaults
        ├── outputs.tf       # Exported resource identifiers and endpoints
        └── terraform.tfvars.example
```

---

## 📦 Module Breakdown

| Module | Resources Provisioned | Purpose |
| :--- | :--- | :--- |
| **`networking`** | VPC (`10.0.0.0/16`), IGW, 2 Public & 2 Private Subnets | Multi-AZ network topology across `ap-southeast-2a` and `ap-southeast-2b`. |
| **`security`** | ALB Security Group, Web Security Group, DB Security Group | Enforces layered ingress. Web nodes accept traffic strictly from the ALB over port 80. |
| **`database`** | RDS PostgreSQL 16 (`db.t4g.micro`), DB Subnet Group | Single-AZ transactional persistence with multi-AZ subnet group readiness. |
| **`compute`** | Dual EC2 instances (`t3.small`), ALB, Target Group, IAM Role | High-availability compute tier fronted by an Application Load Balancer with SSM Agent management. |
| **`messaging`** | SQS Queue, SQS Dead-Letter Queue (DLQ), SES Identity | Asynchronous queueing for transactional emails and QR ticket delivery. |
| **`registry`** | Amazon ECR Repositories | Immutable container registries for backend and frontend Docker images. |
| **`auth`** | Cognito User Pool, Confidential App Client, Domain | Server-side OAuth 2.0 authorization code flow with PKCE (BFF architecture). |
| **`secrets`** | AWS Secrets Manager Secret & Version | Centralized vault for runtime environment variables injected at deployment. |

---

## 🪣 Remote State Backend (Amazon S3 & DynamoDB)

State locking and shared team access are managed via [environments/prod/backend.tf](environments/prod/backend.tf) using:
- **S3 Bucket:** `bookfair-tfstate-744264411889` (encrypted, versioned)
- **DynamoDB Table:** `bookfair-tf-locks` (primary key: `LockID`)

To initialize the remote backend resources via the AWS CLI:
```bash
# Create encrypted S3 bucket for state storage
aws s3api create-bucket \
  --bucket bookfair-tfstate-744264411889 \
  --region ap-southeast-2 \
  --create-bucket-configuration LocationConstraint=ap-southeast-2

aws s3api put-bucket-versioning \
  --bucket bookfair-tfstate-744264411889 \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket bookfair-tfstate-744264411889 \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name bookfair-tf-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-2
```

---

## 🔄 Automated CI/CD Pipelines

The repository separates infrastructure and application lifecycles using GitHub path filters:

1. **`terraform.yml` (Infrastructure):** Triggers only when changes touch `terraform/**`. Validates code, runs `terraform plan`, and executes `terraform apply`.
2. **`deploy-app.yml` (Application):** Triggers only when changes touch `backend/**` or `frontend/**`. Builds Docker containers, pushes to ECR, and deploys via SSM.

---

## 🚀 Usage

### Prerequisites
- [Terraform CLI](https://developer.hashicorp.com/terraform/downloads) >= 1.5.0
- Configured AWS CLI with permissions for `ap-southeast-2`

### Deployment Steps

1. **Navigate to the target environment:**
   ```bash
   cd terraform/environments/prod
   ```

2. **Initialize Terraform:**
   ```bash
   terraform init
   ```

3. **Configure environment variables:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Update terraform.tfvars with appropriate credentials
   ```

4. **Validate configuration:**
   ```bash
   terraform fmt -check
   terraform validate
   ```

5. **Generate and review execution plan:**
   ```bash
   terraform plan -out=tfplan
   ```

6. **Apply infrastructure changes:**
   ```bash
   terraform apply tfplan
   ```

---

## 🔒 Security Best Practices

- **Zero Inbound SSH:** Compute nodes do not expose port 22. Remote access and deployment execution are managed through AWS Systems Manager (SSM) over outbound HTTPS (port 443).
- **Network Isolation:** The database tier resides in private subnets with no public route. It accepts connections strictly from the EC2 security group on port 5432.
- **Secret Isolation:** Sensitive values (`*.tfvars` and `*.tfstate`) are excluded from version control via `.gitignore`.
