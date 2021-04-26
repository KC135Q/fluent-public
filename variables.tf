# variables.tf

# General Information Variables #
#################################

variable "aws_region" {
  description = "AWS Region"
  type = string
  default = "us-east-2"
}

# Account Specific Variables #
##############################
variable "aws_access_key" {
  description = "AWS Access Key"
  type = string
  default = "AKIA3I4C4R3DNZZMRAFD"
}

# Account Specific Variables #
##############################
variable "aws_secret_key" {
  description = "AWS Secret Key"
  type = string
  default = "L6unvZqhtNumRkozuTRtPjK4/c+FmqRwqViwnnvD"
}