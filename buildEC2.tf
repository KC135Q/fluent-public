provider "aws" {
  region        = var.AWS_REGION
  access_key    = var.AWS_ACCESS_KEY
  secret_key    = var.AWS_SECRET_KEY
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

resource "aws_eip" "lb" {
  instance = aws_instance.web.id
  vpc      = true
}

data "aws_ami" "fluent" {
  owners      = ["self"]
  most_recent = true
  name_regex = "^fluent-ami-[[:alnum:]]+"
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.fluent.id
  instance_type = var.AWS_INSTANCE_TYPE
  vpc_security_group_ids = [aws_security_group.testInstanceSG.id]  
  key_name = "fluent-pem"

  tags = {
    Name = "FLUENT"
  }
}