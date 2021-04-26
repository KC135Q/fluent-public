# If you don't set a default, then you will need to provide the variable
# at run time using the command line, or set it in the environment. For more
# information about the various options for setting variables, see the template
# [reference documentation](https://www.packer.io/docs/templates)

variable "AWS_ACCESS_KEY" {
  type = string
  # Make sure your environment variable PKR_VAR_AWS_ACCESS_KEY is set
  # - $ export PKR_VAR_AWS_ACCESS_KEY=EXAMPLE123KEY
  default = "AKIA3I4C4R3DNZZMRAFD"
}

variable "AWS_SECRET_KEY" {
  type = string
  # Make sure your environment variable PKR_VAR_AWS_SECRET_KEY is set
  # - $ export PKR_VAR_AWS_SECRET_KEY=EXAMPLE123SECRET
  default = "L6unvZqhtNumRkozuTRtPjK4/c+FmqRwqViwnnvD"
}

locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

# source blocks configure your builder plugins; your source is then used inside
# build blocks to create resources. A build block runs provisioners and
# post-processors on an instance created by the source.+-
source "amazon-ebs" "fluent" {
  access_key    = var.AWS_ACCESS_KEY
  ami_name      = "fluent-ami-${local.timestamp}"
  instance_type = "t2.small"
  region        = "us-east-2"
  secret_key    = var.AWS_SECRET_KEY
  # source ami is Amazon Linux 2 AMI (HVM), SSD Volume Type - 64-bit x86
  source_ami    = "ami-09246ddb00c7c4fef"
  ssh_username = "ec2-user"
}

build {
  sources = ["source.amazon-ebs.fluent"]
  name = "fluent-ebs-build"

  # provisioners https://www.packer.io/docs/provisioners
  provisioner "shell" {
    inline = ["sudo yum -y update", "sudo yum -y install curl",
      "curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -", "sudo yum install -y nodejs",
      "node --version", "npm init --y", "npm install axios", "npm install express", "npm install pm2"]
  }

  provisioner "file" {
      source = "build/"
      destination = "/home/ec2-user"

  }

  post-processor "shell-local" {
    inline = [ "pm2 index.js" ]
  }
}