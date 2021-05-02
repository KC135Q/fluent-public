# If you don't set a default, then you will need to provide the variable
# at run time using the command line, or set it in the environment. For more
# information about the various options for setting variables, see the template
# [reference documentation](https://www.packer.io/docs/templates)

locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

# source blocks configure your builder plugins; your source is then used inside
# build blocks to create resources. A build block runs provisioners and
# post-processors on an instance created by the source.+-
source "amazon-ebs" "fluent" {
  access_key    = var.AWS_ACCESS_KEY
  ami_name      = "fluent-ami-${local.timestamp}"
  instance_type = var.AWS_INSTANCE_TYPE
  region        = var.AWS_REGION
  secret_key    = var.AWS_SECRET_KEY
  # source ami is Amazon Linux 2 AMI (HVM), SSD Volume Type - 64-bit x86
  source_ami    = var.AWS_SOURCE_AMI
  ssh_username = var.AWS_SSH_USERNAME
}

build {
  sources = ["source.amazon-ebs.fluent"]
  name = "fluent-ebs-build"

  provisioner "file" {
    source = "package.json"
    destination = "/home/ec2-user/package.json"
  }

  provisioner "file" {
    source = "build/"
    destination = "/home/ec2-user"
  }

  # provisioners https://www.packer.io/docs/provisioners
  provisioner "shell" {
    inline = ["sudo yum -y update", "sudo yum -y install curl",
      "curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -", "sudo yum install -y nodejs",
      "node --version", "npm install --only=production", "sudo npm install pm2 -g", "pm2 start index.js"]
  }

}