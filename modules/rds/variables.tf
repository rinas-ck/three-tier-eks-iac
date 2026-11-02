
variable "vpc_id" {
  description = "VPC ID for the RDS security group"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for RDS"
  type        = list(string)
}

variable "worker_security_group_id" {
  description = "EKS worker node security group ID"
  type        = string
}
