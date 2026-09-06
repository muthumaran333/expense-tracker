# CI/CD foundation

This repository is structured as a modular monorepo with a Python FastAPI backend and a Next.js frontend. The current implementation intentionally focuses on a safe CI/CD foundation without provisioning expensive AWS infrastructure or performing production deployments.

## GitHub -> AWS authentication flow

GitHub
→ GitHub Actions
→ OIDC federation
→ AWS IAM role
→ Amazon ECR
→ ECS/Fargate (future)

GitHub Actions does not use long-lived AWS keys. Instead, GitHub exchanges a short-lived OIDC token for temporary AWS credentials using an IAM role trust policy that is restricted to this repository and branch conditions. This is safer than static access keys because the credentials are automatically rotated and cannot be stored in source control or a long-lived secret store.

## Current Terraform scope

The Terraform foundation currently creates:
- ECR repositories for the backend and frontend
- GitHub OIDC provider for AWS
- IAM role for GitHub Actions
- least-privilege ECR permissions for image pushes

It does not create RDS, ECS, VPC, S3, Redis, or other production resources yet.

## Required future values

The Terraform configuration requires a GitHub repository owner and name, as well as an AWS region. These values must be supplied before apply and must not be guessed.

Example placeholders:
- github_owner = "your-github-org-or-user"
- github_repository = "expense-tracker"
- aws_region = "us-east-1"

## Staging and production deployment flow

The repository is prepared for the following safe progression:

- feature branch -> pull request -> CI
- merge to develop -> staging workflow
- smoke tests / validation
- approval for production
- merge/release to main -> production workflow

The deployment workflow included here is intentionally staged and does not deploy automatically to production.
