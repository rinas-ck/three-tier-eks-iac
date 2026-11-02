
output "db_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.this.endpoint
}

output "db_address" {
  description = "RDS hostname"
  value       = aws_db_instance.this.address
}

output "db_port" {
  description = "PostgreSQL port"
  value       = aws_db_instance.this.port
}

output "db_name" {
  value = aws_db_instance.this.db_name
}

output "db_security_group_id" {
  value = aws_security_group.rds.id
}

output "db_secret_arn" {
  description = "Secrets Manager ARN for the RDS master credentials"
  value       = aws_db_instance.this.master_user_secret[0].secret_arn
}
