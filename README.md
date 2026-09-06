# Expense Tracker

## Project overview

This project is a modular monorepo for an Expense Tracker application. The current foundation intentionally keeps the architecture simple and production-aware while avoiding unnecessary AI and microservice complexity.

The initial implementation includes:
- FastAPI backend with a health endpoint
- Next.js frontend with a backend health indicator
- Dockerfiles for both services
- Docker Compose for local development
- GitHub Actions workflows for backend/frontend CI and Docker build validation
- Terraform foundation for GitHub OIDC and ECR setup
- Security-first deployment planning for future AWS usage

## Architecture

The target architecture is:

Developer
↓
GitHub
↓
Pull Request
↓
GitHub Actions
├── Backend lint
├── Backend tests
├── Frontend lint
├── Frontend type-check
├── Security scan
└── Docker build
↓
Merge into develop
↓
Staging environment
↓
Production approval
↓
Main branch release

## Local development

### Backend

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health endpoint:

```bash
curl http://localhost:8000/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

## Docker instructions

```bash
docker compose up --build
```

This runs:
- backend on http://localhost:8000
- frontend on http://localhost:3000

## CI/CD architecture

The repository includes the following workflows:
- backend-ci.yml
- frontend-ci.yml
- docker-build.yml
- deploy.yml

These workflows are designed to enforce quality gates before deployment and to prepare infrastructure for staging and production deployment without creating production resources automatically.

## GitHub Actions workflows

### Backend CI
- Python 3.12 setup
- dependency installation
- Ruff lint and format check
- pytest with coverage

### Frontend CI
- Node.js 20 setup
- npm ci
- ESLint
- TypeScript checking
- optional test execution
- production build

### Docker build workflow
- build backend and frontend images
- run basic health checks for each container

### Deployment workflow
- staged placeholders for develop and main
- production deployment is intentionally kept manual and protected by environment rules

## AWS architecture

The project is prepared for AWS usage through OIDC and IAM. The Terraform files currently define:
- ECR repositories for backend and frontend
- GitHub OIDC provider
- IAM deployment role restricted to the repository
- least-privilege ECR permissions

This is the safe base before provisioning ECS/Fargate, RDS, and other future environment components.

## Required AWS setup

Before applying Terraform, set up:
- AWS account
- AWS region
- IAM permissions for the executing Terraform user
- GitHub repository owner and repository name

The Terraform configuration does not create or assume hard-coded credentials.

## Required GitHub configuration

Configure:
1. Repository branch protection for main and develop
2. GitHub environments named Development, Staging, and Production
3. Production environment approval rules
4. OIDC trust policy for GitHub Actions
5. AWS IAM role created by Terraform and referenced by the workflow
6. Repository variables:
   - AWS_ACCOUNT_ID
   - AWS_REGION

## Environment variables

The project currently does not require application secrets at runtime for the initial foundation. Future environment variables may include:
- DATABASE_URL
- JWT_SECRET
- LLM_API_KEY
- GOOGLE_CLIENT_SECRET

These should live in GitHub Actions environment secrets or AWS Secrets Manager, never in source control.

## Deployment process

The expected future deployment flow is:

1. Create a feature branch
2. Open a pull request
3. Run CI on the PR
4. Merge to develop
5. Run staging deployment workflow
6. Smoke tests
7. Manual approval for production
8. Merge/release to main
9. Production deployment

The current deployment workflow intentionally stops at placeholders to avoid unsafe deployments.

## Security considerations

- No long-lived AWS access keys are used
- IAM roles follow least privilege
- GitHub environments separate staging and production
- Docker and dependency scanning are prepared via workflow structure
- secrets are never committed to the repository
- production deployment requires explicit approval and infrastructure configuration

## References

- docs/cicd.md for the OIDC and ECR deployment rationale
