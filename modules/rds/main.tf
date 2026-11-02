
resource "aws_security_group" "rds" {
  name        = "three-tier-rds-sg"
  description = "Allow PostgreSQL access from EKS workers"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from EKS worker nodes"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.worker_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "three-tier-rds-sg"
  }
}

resource "aws_db_subnet_group" "this" {
  name       = "three-tier-rds-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "three-tier-rds-subnet-group"
  }
}

resource "aws_db_instance" "this" {
  identifier = "three-tier-postgres"

  engine         = "postgres"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = "cloudops"
  username = "cloudopsadmin"

  manage_master_user_password = true

  port                   = 5432
  publicly_accessible    = false
  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 1
  multi_az                = false

  skip_final_snapshot = true
  deletion_protection = false

  tags = {
    Name = "three-tier-postgres"
  }
}
