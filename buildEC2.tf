provider "aws" {
  region        = var.aws_region
  access_key    = var.aws_access_key
  secret_key    = var.aws_secret_key
}

resource "aws_security_group" "testInstanceSG" {
  # Port 22 is the default port for SSH
  ingress {
   from_port   = 22
   to_port     = 22
   protocol    = "tcp"
   cidr_blocks = ["0.0.0.0/0"]
  }
  # Port 80 is the default port for HTTP
  ingress {
   from_port   = 80
   to_port     = 80
   protocol    = "tcp"
   cidr_blocks = ["0.0.0.0/0"]
  }
    # Port 8080 is the default port for this application
  ingress {
   from_port   = 8080
   to_port     = 8080
   protocol    = "tcp"
   cidr_blocks = ["0.0.0.0/0"]
  }
  # Port 443 is the default port for HTTPS
  ingress { 
   from_port   = 443
   to_port     = 443
   protocol    = "tcp"
   cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami           = "ami-08e6f405721a8a1c2"
  instance_type = "t2.small"
  vpc_security_group_ids = [aws_security_group.testInstanceSG.id]  
  key_name = "fluent-pem"

  tags = {
    Name = "FLUENT"
  }

}