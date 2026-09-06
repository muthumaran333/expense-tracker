variable "aws_region" {
  description = "AWS region for deployment resources."
  type        = string
  default     = "ap-south-1"
}

variable "github_owner" {
  description = "GitHub organization or user that owns the repository."
  type        = string
}

variable "github_repository" {
  description = "GitHub repository name for the OIDC trust policy."
  type        = string
}

variable "deployment_role_name" {
  description = "Name of the IAM role used by GitHub Actions to access AWS resources."
  type        = string
  default     = "expense-tracker-github-actions"
}

variable "container_image_tag" {
  description = "ECR image tag used by the ECS task definitions."
  type        = string
  default     = "latest"
}
