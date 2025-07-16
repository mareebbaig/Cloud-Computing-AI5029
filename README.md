# Cloud-Computing-AI5029

A Cloud Computing Course project that uses terraform to automate the infrastructure for a Notes Manager application with auto-scaling capabilities on AWS.

## Technologies Used

- **Terraform** - Infrastructure as Code for AWS resource provisioning
- **Docker** - Containerization platform for application packaging
- **React.js** - Frontend user interface framework
- **Node.js** - Backend server runtime environment
- **AWS DynamoDB** - NoSQL database for storing notes
- **AWS EC2** - Virtual machines for hosting the application
- **AWS Application Load Balancer** - Load balancing and traffic routing
- **AWS Auto Scaling** - Automatic scaling based on CPU utilization

## Prerequisites

### System Requirements
- **Docker** must be installed on your system
- **Terraform** installed
- **AWS Account** with appropriate permissions
- **AWS CLI** configured (optional but recommended)

### Building Your Own Images (Recommended)

If you want to make custom changes to the application:

1. **You must have Docker on your system**

2. **Make a .env file** by studying the `.env.example` file and replace all the variables with actual values from your AWS account

3. **Build the Docker images** of both backend and frontend directories:
```bash
# Build backend image
cd backend
docker build -t your-dockerhub-username/backend:tag .

# Build frontend image
cd frontend
docker build -t your-dockerhub-username/frontend:tag .
```

4. **Push images to Docker registry** (DockerHub used here):
```bash
docker push your-dockerhub-username/backend
docker push your-dockerhub-username/frontend
```

5. **Update Terraform configuration**: Change the image names in the `user_data` section in `main.tf` file so that Terraform can pull those images directly from DockerHub.

## Cloud Infrastructure Deployment

### Step 1: Clone the Repository
```bash
git clone https://github.com/mareebbaig/Cloud-Computing-AI5029.git
cd Cloud-Computing-AI5029
```

### Step 2: Setup Terraform Environment

**Option A: Using AWS CLI**
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

**Option B: Using Environment Variables**
```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
```

### Step 3: Setup Terraform Variables
```bash
cd terraform

# Create environment file from example
cp .env.example .env
# Edit .env with your Docker Hub credentials and AWS details

# OR create terraform.tfvars file
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### Step 4: Initialize Terraform
```bash
# Run terraform init command to setup and install all the required dependencies
terraform init
```

### Step 5: Verify Infrastructure
```bash
# Run terraform plan command to Verify your infrastructure
terraform plan
```

### Step 6: Deploy Infrastructure
```bash
# Run terraform apply command to provision your infrastructure
terraform apply
```

## Application Configuration

- **Frontend**: Running on port 3001 (can be changed in configuration)
- **Backend**: Running on port 3000 (can be changed in configuration)
- **Auto Scaling**: Based on CPU utilization with the following thresholds:
  - **Scale-out**: 75% CPU utilization threshold
  - **Scale-in**: 25% CPU utilization threshold

## Auto Scaling Behavior

**Triggering Scale-out:**
- Auto scaling can be triggered by making multiple API requests
- Increased traffic raises CPU utilization above 75%
- Scale-out metric is triggered, adding more EC2 instances

**Triggering Scale-in:**
- When the server is idle, CPU utilization drops
- If utilization falls to 25% or below, scale-in metric is triggered
- Extra machines are automatically terminated to save costs

## Accessing Your Application

After successful deployment, Terraform will output the URLs:
```bash
# Get the application URLs
terraform output frontend_url
terraform output backend_api_url
terraform output load_balancer_url
```

## Cleanup

To destroy the infrastructure and avoid AWS charges:
```bash
terraform destroy
```

## Project Structure

```
Cloud-Computing-AI5029/
├── backend/              # Node.js Express API
├── frontend/             # React.js application
├── terraform/            # Infrastructure as Code
│   ├── main.tf          # Main Terraform configuration
│   ├── variables.tf     # Variable definitions
│   ├── .env.example     # Environment variables template
│   └── terraform.tfvars.example # Terraform variables template
└── README.md            # This file
```
