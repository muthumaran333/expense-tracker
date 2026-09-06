output "ecr_backend_repository_url" {
  description = "ECR repository URL for the backend image."
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_repository_url" {
  description = "ECR repository URL for the frontend image."
  value       = aws_ecr_repository.frontend.repository_url
}

output "github_actions_role_arn" {
  description = "IAM role ARN used by GitHub Actions OIDC authentication."
  value       = aws_iam_role.github_actions.arn
}

output "ecs_cluster_name" {
  description = "ECS cluster hosting the Expense Tracker services."
  value       = aws_ecs_cluster.app.name
}

output "frontend_service_name" {
  description = "ECS frontend service name."
  value       = aws_ecs_service.frontend.name
}

output "backend_service_name" {
  description = "ECS backend service name."
  value       = aws_ecs_service.backend.name
}

output "application_url" {
  description = "Public URL for the Expense Tracker frontend."
  value       = "http://${aws_lb.app.dns_name}"
}
