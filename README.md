# Three-Tier EKS Infrastructure on AWS

A containerized three-tier application deployed on Amazon EKS using Terraform, Docker, Kubernetes, React, Flask, and PostgreSQL.

## Project Overview

This project demonstrates the design and deployment of a cloud-native three-tier application on AWS. Infrastructure is provisioned using Terraform, applications are containerized with Docker, and workloads are orchestrated using Kubernetes on Amazon EKS.

## Architecture

The application consists of three main layers:

1. **Presentation Layer:** React frontend served through Nginx and exposed using an AWS LoadBalancer.
2. **Application Layer:** Python Flask backend running inside Kubernetes, with RBAC permissions to retrieve cluster information.
3. **Database Layer:** Amazon RDS PostgreSQL hosted in private subnets.

### Infrastructure

- Amazon VPC with public and private subnets across two Availability Zones.
- Amazon EKS cluster with a managed node group.
- Amazon ECR repositories for frontend and backend images.
- Amazon RDS PostgreSQL in private subnets.
- NAT Gateway for private subnet outbound connectivity.
- IAM roles and Kubernetes RBAC for access management.
- AWS Secrets Manager for RDS master credentials.

## Technology Stack

| Category | Technologies |
|---|---|
| Cloud | AWS |
| Infrastructure as Code | Terraform |
| Containerization | Docker |
| Orchestration | Kubernetes, Amazon EKS |
| Frontend | React, Vite, Nginx |
| Backend | Python, Flask |
| Database | PostgreSQL, Amazon RDS |
| Container Registry | Amazon ECR |
| Monitoring UI | Recharts (demonstration CPU/memory charts) |

## Application Features

- Kubernetes cluster overview.
- Live worker node information.
- Pod and deployment information retrieved through the Kubernetes API.
- PostgreSQL database connectivity and health check.
- Database record management with Create, Read, Update, and Delete operations.
- Frontend-to-backend communication through an Nginx reverse proxy.
- Kubernetes readiness and liveness probes.
- Resource requests and limits for backend workloads.

## Project Structure

```text
three-tier-eks-iac/
├── backend/
├── frontend-app/
├── k8s/
│   ├── backend/
│   ├── frontend/
│   └── namespaces/
├── modules/
│   ├── ecr/
│   ├── eks/
│   ├── rds/
│   └── vpc/
├── main.tf
├── providers.tf
├── variables.tf
├── outputs.tf
└── versions.tf
```

## Deployment Workflow

1. Configure AWS CLI credentials and select the target AWS region.
2. Configure Terraform variables.
3. Initialize and validate Terraform.
4. Provision AWS infrastructure using Terraform.
5. Build and push frontend and backend Docker images to Amazon ECR.
6. Configure Kubernetes access using `aws eks update-kubeconfig`.
7. Configure database credentials using Kubernetes Secrets.
8. Deploy namespaces, backend and frontend Kubernetes manifests.
9. Access the application through the frontend LoadBalancer endpoint.

Example Terraform commands:

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

## Security Considerations

- Database hosted in private subnets.
- Database credentials injected through Kubernetes Secrets.
- RDS master password managed by AWS Secrets Manager.
- Kubernetes RBAC used to restrict backend API access.
- Terraform state and sensitive variable files excluded from Git.

## Infrastructure Cost Management

AWS resources were destroyed after application testing to avoid unnecessary ongoing charges. The repository contains the infrastructure code and deployment manifests for recreating the environment.

## Learning Outcomes

- Provisioning modular AWS infrastructure using Terraform.
- Deploying containerized applications on Amazon EKS.
- Managing Kubernetes workloads, services, namespaces, and RBAC.
- Integrating Flask applications with Kubernetes APIs.
- Connecting applications to Amazon RDS PostgreSQL.
- Managing application configuration and secrets.
- Understanding cloud infrastructure lifecycle and cost management.

## Author

**Rinas**

Cloud & DevOps Engineering | AWS | Terraform | Docker | Kubernetes | Python

GitHub: https://github.com/rinas-ck
