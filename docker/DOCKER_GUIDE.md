# 🐳 Docker Setup Guide - AI Symptom Guidance System

A comprehensive guide to understanding Docker and setting up this AI-powered anatomy system with containerization.

---

## 📚 Table of Contents

1. [What is Docker?](#what-is-docker)
2. [Why Docker?](#why-docker)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Building & Running](#building--running)
6. [Docker Hub Integration](#docker-hub-integration)
7. [Common Commands](#common-commands)
8. [Troubleshooting](#troubleshooting)

---

## 🤔 What is Docker?

### Simple Definition
**Docker** is a containerization platform that packages your application along with all its dependencies (libraries, runtime, configuration) into a standardized unit called a **container**.

### Container vs Virtual Machine
```
WITHOUT Docker (Traditional):
Desktop → OS → Libraries → App
↑ Heavy, slow, takes many GB

WITH Docker (Containerization):
Desktop → Docker → Container (Lightweight, includes only what's needed)
↑ Lightweight, fast, predictable
```

### Key Concepts

| Term | Definition |
|------|-----------|
| **Image** | A blueprint/template containing your application code and all dependencies (read-only) |
| **Container** | A running instance of an image (we call it "running" a container) |
| **Dockerfile** | A text file with instructions to build an image (like a recipe) |
| **Docker Hub** | A public registry where you can push and pull images |
| **Registry** | A storage service for Docker images (like GitHub for code) |

### Real-World Analogy
- **Image** = Recipe for a cake
- **Container** = The actual baked cake
- **Dockerfile** = Instructions in the recipe
- **Docker Hub** = A cookbook library where everyone shares recipes

---

## 🎯 Why Docker?

### Problems Solved by Docker

1. **"It works on my machine"** - Works consistently everywhere
2. **Dependency Hell** - No more worrying about different Python/Node versions
3. **Easy Deployment** - Same container runs locally, on servers, on cloud
4. **Collaboration** - Others run your exact environment
5. **Scaling** - Quickly spin up multiple instances

### Your Project Benefits
- ✅ Backend (Python 3.10 + FastAPI) runs consistently
- ✅ Frontend (Node 18 + Vite) doesn't conflict with system Node
- ✅ Easy to deploy to Azure, AWS, or any cloud provider
- ✅ Team members get identical environment

---

## 💾 Installation

### Step 1: Install Docker Desktop

**Windows:**
1. Go to [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Download and install
3. Restart your computer
4. Verify installation:
   ```bash
   docker --version
   docker run hello-world
   ```

**macOS:**
```bash
brew install docker
brew install --cask docker
# Or download from Docker website
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

### Step 2: Create Docker Hub Account

1. Go to [Docker Hub](https://hub.docker.com/)
2. Sign up for free account
3. Create a new account or use GitHub/Google login
4. Verify your email

---

## 📂 Project Structure

```
AI BAES HUMAN ANATOMY/
├── backend/
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (don't commit!)
│   └── app/
│       ├── main.py
│       ├── ai_service.py
│       └── ...
├── frontend/
│   ├── nginx.conf              # ← Nginx web server config
│   ├── package.json            # Node dependencies
│   └── src/
│       ├── App.jsx
│       └── ...
├── docker/                      # ← 🎉 NEW! Docker organization folder
│   ├── docker-compose.yml      # ← Orchestrates both containers
│   ├── DOCKER_COMMANDS.md      # Quick command reference
│   ├── DOCKER_GUIDE.md         # This file
│   ├── backend/
│   │   └── Dockerfile          # ← Instructions to build backend image
│   └── frontend/
│       └── Dockerfile          # ← Instructions to build frontend image
└── readme.md
```

### What Each File Does

**docker/backend/Dockerfile**
- Builds the Python FastAPI application
- Uses Python 3.10 slim image (lightweight)
- Installs dependencies, copies code, runs the app on port 8000

**docker/frontend/Dockerfile**
- Builds the React + Vite application
- Stage 1: Compiles React code
- Stage 2: Serves with Nginx web server on port 80

**docker/docker-compose.yml**
- Defines two services: backend and frontend
- Sets up networking between them
- Maps ports: 8000 (backend), 80 (frontend)
- Automatically starts them together

---

## 🚀 Building & Running

### Method 1: Using Docker Compose (RECOMMENDED)

This is the easiest method - it builds and runs both services together.

#### Step 1: Navigate to Docker Folder

```bash
cd "d:\UNIVER\UNI\AI BAES HUMAN ANATOMY\docker"
```

#### Step 2: Build Images

```bash
docker-compose build
```

**What this does:**
- Reads `docker-compose.yml`
- Builds backend image using `backend/Dockerfile`
- Builds frontend image using `frontend/Dockerfile`
- Takes 2-5 minutes on first run (downloads base images, installs dependencies)

#### Step 3: Start Services

```bash
docker-compose up -d
```

**What this does:**
- `-d` = detached mode (runs in background)
- Starts both containers
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost`

#### Step 4: View Logs

```bash
# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Step 5: Stop Services

```bash
# Stop all services (containers still exist)
docker-compose down

# Stop and remove all containers and volumes
docker-compose down -v
```

### Method 2: Manual Docker Commands

#### Build Backend Image Only

```bash
cd ../backend
docker build -t anatomy-backend:1.0 -f ../docker/backend/Dockerfile .
docker run -p 8000:8000 --env-file .env anatomy-backend:1.0
```

#### Build Frontend Image Only

```bash
cd ../frontend
docker build -t anatomy-frontend:1.0 -f ../docker/frontend/Dockerfile .
docker run -p 3000:80 anatomy-frontend:1.0
```

---

## 🐳 Docker Hub Integration

### Step 1: Login to Docker Hub

```bash
docker login
```

**What it does:**
- Prompts for Docker Hub username and password
- Stores credentials locally (in `~/.docker/config.json`)
- Allows you to push/pull from Docker Hub

### Step 2: Tag Your Images

Images need a tag in format: `username/repository:tag`

```bash
# For backend
docker tag anatomy-backend:1.0 YOUR_USERNAME/anatomy-backend:1.0
docker tag anatomy-backend:1.0 YOUR_USERNAME/anatomy-backend:latest

# For frontend
docker tag anatomy-frontend:1.0 YOUR_USERNAME/anatomy-frontend:1.0
docker tag anatomy-frontend:1.0 YOUR_USERNAME/anatomy-frontend:latest
```

**Replace `YOUR_USERNAME`** with your Docker Hub username

### Step 3: Push Images to Docker Hub

```bash
# Push backend
docker push YOUR_USERNAME/anatomy-backend:1.0
docker push YOUR_USERNAME/anatomy-backend:latest

# Push frontend
docker push YOUR_USERNAME/anatomy-frontend:1.0
docker push YOUR_USERNAME/anatomy-frontend:latest
```

**What this does:**
- Uploads your images to Docker Hub
- Makes them publicly available
- Others can now use: `docker pull YOUR_USERNAME/anatomy-backend`

### Step 4: Verify on Docker Hub

1. Go to [Docker Hub](https://hub.docker.com/)
2. Login
3. Click **Repositories** (or go to your profile)
4. You should see `anatomy-backend` and `anatomy-frontend`
5. Click on each to see versions (tags)

### Step 5: Pull Your Images (Anywhere)

```bash
# On any machine, you can now pull your images
docker pull YOUR_USERNAME/anatomy-backend:latest
docker pull YOUR_USERNAME/anatomy-frontend:latest

# Run them
docker run -p 8000:8000 YOUR_USERNAME/anatomy-backend:latest
docker run -p 80:80 YOUR_USERNAME/anatomy-frontend:latest
```

---

## 🔧 Common Commands

### Image Management

```bash
# List all images on your computer
docker images

# Remove an image
docker rmi image-name:tag

# Remove all unused images
docker image prune

# View image details
docker image inspect image-name:tag

# Search Docker Hub for images
docker search nginx
```

### Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop container-id

# Start a stopped container
docker start container-id

# Remove a container
docker rm container-id

# View container logs
docker logs container-id
docker logs -f container-id  # Follow logs (like tail -f)

# Execute command in running container
docker exec -it container-id bash
docker exec container-id ls /app
```

### Docker Compose Commands

```bash
# Build images (run from docker folder)
docker-compose build

# Start services
docker-compose up
docker-compose up -d  # Background

# Stop services
docker-compose down
docker-compose down -v  # Also remove volumes

# View logs
docker-compose logs
docker-compose logs -f service-name

# Restart services
docker-compose restart

# Run one-off commands
docker-compose exec backend bash
docker-compose exec frontend npm list
```

### Debugging Containers

```bash
# Enter a running container shell
docker exec -it anatomy-backend bash

# View resource usage
docker stats

# Inspect container details
docker inspect anatomy-backend

# View real-time logs
docker logs -f anatomy-backend --tail 50
```

---

## 🐛 Troubleshooting

### Problem: Port Already in Use

```
Error: bind: address already in use
```

**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # Mac/Linux

# Kill the process (Windows)
taskkill /PID process-id /F

# Or use different port in docker/docker-compose.yml
# Change "8000:8000" to "8001:8000"
```

### Problem: Permission Denied (Linux)

```
Error: permission denied while trying to connect
```

**Solution:**
```bash
# Add your user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

### Problem: Container Exits Immediately

```bash
# Check logs
docker logs container-id

# Look for errors in the output
# Common causes:
# - Missing environment variables
# - Port already in use
# - Dependency not installed
```

### Problem: Cannot Connect to Backend from Frontend

**Solution:**
- In docker-compose.yml, services communicate using service name
- In nginx.conf: `proxy_pass http://backend:8000/` ← This is correct
- From frontend code: `http://localhost:8000` → Won't work in container
- Use: `http://backend:8000` or relative paths `/api/`

### Problem: .env File Not Loading

```bash
# Verify .env file exists
ls -la ../backend/.env

# Use env_file in docker/docker-compose.yml
env_file:
  - ../backend/.env

# Or set individually
environment:
  - GOOGLE_API_KEY=your_key_here
```

### Problem: Node Modules Not Installing

```bash
# In frontend directory, ensure you have package.json
cd ../frontend
npm init -y

# Add dependencies
npm install react@latest react-dom@latest
npm install -D vite @vitejs/plugin-react
npm install axios three @react-three/fiber @react-three/drei
npm install -D tailwindcss postcss autoprefixer

# Rebuild
docker-compose build --no-cache
```

### View System Resources

```bash
# See how much space Docker is using
docker system df

# Clean up unused images, containers, networks
docker system prune

# Don't forget volumes!
docker system prune -a --volumes
```

---

## 📝 Quick Start (TL;DR)

```bash
# 1. Open terminal and navigate to docker folder
cd docker

# 2. Build images
docker-compose build

# 3. Start services
docker-compose up -d

# 4. Access your app
# Backend: http://localhost:8000
# Frontend: http://localhost

# 5. Stop services
docker-compose down
```

**Happy containerizing! 🚀**
