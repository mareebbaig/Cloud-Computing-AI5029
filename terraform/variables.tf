variable "aws_region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID for EC2 instances"
  default     = "ami-0150ccaf51ab55a51"
}

variable "dockerhub_username" {
  description = "Docker Hub username"
  type        = string
  default     = "mareebbaig99"
}

variable "dockerhub_password" {
  description = "Docker Hub password or Personal Access Token"
  type        = string
  sensitive   = true
  # No default - will be read from TF_VAR_dockerhub_password environment variable
}