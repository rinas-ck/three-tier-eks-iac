
resource "aws_ecr_repository" "frontend" {
  name                 = "cloudops-frontend"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "cloudops-frontend"
  }
}

resource "aws_ecr_repository" "backend" {
  name                 = "cloudops-backend"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "cloudops-backend"
  }
}
