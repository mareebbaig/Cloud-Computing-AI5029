provider "aws" {
  region = "us-east-1"
}

# data "aws_availability_zones" "available" {}

variable "azs" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

# DynamoDB
resource "aws_dynamodb_table" "Notes" {
  name         = "Notes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"


  attribute {
    name = "id"
    type = "S" # part. key
  }

  tags = {
    Environment = "dev"
    Name        = "my-app-table"
  }
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.Notes.name
}

#VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

# Subnets with Public IP assignment
resource "aws_subnet" "main" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
#   availability_zone       = element(data.aws_availability_zones.available.names, count.index)
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true
}

# Route Table for Public Subnet
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.main[count.index].id
  route_table_id = aws_route_table.public.id
}


# Security Group for ALB and EC2 instances
resource "aws_security_group" "alb_sg" {
  name        = "allow_http_traffic"
  description = "Allow HTTP inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


# Launch Configuration
resource "aws_launch_configuration" "api_launch_config" {
  name            = "api-launch-config"
  image_id        = var.ami_id
  instance_type   = var.instance_type
  security_groups = [
    aws_security_group.alb_sg.id,
  ]

  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y docker
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    echo "${var.dockerhub_password}" | sudo docker login -u ${var.dockerhub_username} -p ${var.dockerhub_password}
    sudo docker pull ${var.dockerhub_username}/backend
    sudo docker pull ${var.dockerhub_username}/frontend
    sudo docker run -d -p 3000:3000 --name backend ${var.dockerhub_username}/backend
    sudo docker run -d -p 3001:3001 --name frontend ${var.dockerhub_username}/frontend
  EOF

  lifecycle {
    create_before_destroy = true
  }
}


# Auto Scaling Group
resource "aws_autoscaling_group" "api_asg" {
  launch_configuration      = aws_launch_configuration.api_launch_config.id
  vpc_zone_identifier       = aws_subnet.main.*.id
  min_size                  = 1
  max_size                  = 5
  desired_capacity          = 1
  health_check_type         = "EC2"
  health_check_grace_period = 300

  tag {
    key                 = "Name"
    value               = "api-instance"
    propagate_at_launch = true
  }
}

# Auto Scaling Policies
resource "aws_autoscaling_policy" "scale_up_policy" {
  name                   = "scale-up"
  scaling_adjustment     = 2 # Increase by 2 (from 1 to 3)
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.api_asg.id
}

resource "aws_autoscaling_policy" "scale_down_policy" {
  name                   = "scale-down"
  scaling_adjustment     = -1 # Decrease by 1 (from 3 to 2)
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.api_asg.id
}

# CloudWatch Metric
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "high-cpu-utilization"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 75

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.api_asg.name
  }

  alarm_actions = [aws_autoscaling_policy.scale_up_policy.arn]
}


resource "aws_cloudwatch_metric_alarm" "low_cpu" {
  alarm_name          = "low-cpu-utilization"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 25

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.api_asg.name
  }

  alarm_actions = [aws_autoscaling_policy.scale_down_policy.arn]
}