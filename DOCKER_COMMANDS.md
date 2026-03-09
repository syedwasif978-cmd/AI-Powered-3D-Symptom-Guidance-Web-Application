# 🐳 Docker Commands Cheat Sheet

## 🚀 Essential Commands

### Docker Compose (Recommended)
```bash
# Build images from Dockerfile
docker-compose build

# Start all services (background)
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs
docker-compose logs -f                    # Follow (live)
docker-compose logs backend -f            # Specific service
docker-compose logs --tail 50             # Last 50 lines

# Execute command in container
docker-compose exec backend bash
docker-compose exec backend python --version

# Restart services
docker-compose restart
docker-compose restart backend

# List running services
docker-compose ps
```

### Docker Hub (Push to Cloud)
```bash
# Login to Docker Hub
docker login

# Tag your image before pushing
docker tag anatomy-backend:1.0 YOUR_USERNAME/anatomy-backend:1.0
docker tag anatomy-frontend:1.0 YOUR_USERNAME/anatomy-frontend:1.0

# Push to Docker Hub
docker push YOUR_USERNAME/anatomy-backend:1.0
docker push YOUR_USERNAME/anatomy-frontend:1.0

# Pull from Docker Hub (anyone can run this)
docker pull YOUR_USERNAME/anatomy-backend:1.0
docker pull YOUR_USERNAME/anatomy-frontend:1.0

# Logout from Docker
docker logout
```

---

## 🔍 Debugging Commands

### Container Inspection
```bash
# List all containers
docker ps          # Running only
docker ps -a       # All containers

# View container logs
docker logs container-id
docker logs -f container-id               # Follow logs
docker logs --tail 100 container-id       # Last 100 lines

# Enter container shell
docker exec -it container-id bash

# Inspect container details
docker inspect container-id

# View resource usage
docker stats                               # Real-time CPU, memory
docker stats container-id                  # Specific container
```

### Image Inspection
```bash
# List all images
docker images

# View image details
docker image inspect image-name:tag

# View image history
docker history image-name:tag

# Search Docker Hub
docker search nginx
```

---

## 🧹 Cleanup Commands

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove all unused resources (system-wide)
docker system prune

# Remove all (including in-use!)
docker system prune -a --volumes

# Specific removal
docker rmi image-name              # Remove image
docker rm container-id             # Remove container
docker volume rm volume-name       # Remove volume
```

---

## 🏗️ Build & Run Commands

### Manual Image Building
```bash
# Build image
docker build -t my-image:1.0 .

# Build with no cache (fresh build)
docker build --no-cache -t my-image:1.0 .

# Build with build args
docker build --build-arg PYTHON_VERSION=3.10 -t my-image:1.0 .

# Run container from image
docker run -p 8000:8000 my-image:1.0
docker run -d -p 8000:8000 my-image:1.0              # Background
docker run -it -p 8000:8000 my-image:1.0 bash        # Interactive

# Run with environment variables
docker run -e API_KEY=secret -p 8000:8000 my-image:1.0

# Run with volume mount
docker run -v /local/path:/container/path -p 8000:8000 my-image:1.0
```

---

## 📊 Network Commands

```bash
# List networks
docker network ls

# Inspect network
docker network inspect anatomy-network

# Create network
docker network create my-network

# Connect container to network
docker network connect my-network container-id

# Disconnect container from network
docker network disconnect my-network container-id
```

---

## 🎯 Practical Workflows

### Rebuilding After Code Changes
```bash
# Backend changes
docker-compose down
docker-compose build backend
docker-compose up -d

# Frontend changes
docker-compose down
docker-compose build frontend
docker-compose up -d

# All changes
docker-compose down
docker-compose build
docker-compose up -d
```

### Checking if Services are Healthy
```bash
# Check running services
docker-compose ps

# Check specific service health
docker-compose logs backend
curl http://localhost:8000/health          # Backend health
curl http://localhost/                     # Frontend
```

### Getting Inside a Container
```bash
# Access backend
docker-compose exec backend bash
cd /app
ls -la
python --version

# Access frontend
docker-compose exec frontend bash
ls -la
npm list
```

### Pushing to Docker Hub
```bash
# 1. Login
docker login

# 2. Build
docker-compose build

# 3. Tag
docker tag anatomy-backend:latest YOUR_USERNAME/anatomy-backend:latest

# 4. Push
docker push YOUR_USERNAME/anatomy-backend:latest

# 5. Verify
# Go to hub.docker.com and check your repositories
```

---

## 🆘 Troubleshooting Commands

```bash
# Check Docker daemon status
docker version

# Diagnose Docker setup
docker info

# Check for errors
docker-compose logs backend | grep -i error

# Verify environment variables in container
docker-compose exec backend env

# Test connectivity between containers
docker-compose exec frontend ping backend

# Check open ports
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # Mac/Linux
```

---

## 📝 Step-by-Step Examples

### Example 1: Fix Backend Issue
```bash
# 1. Stop services
docker-compose down

# 2. Check backend logs
docker-compose up backend

# 3. Fix the issue in code

# 4. Rebuild
docker-compose build backend

# 5. Run again
docker-compose up -d
```

### Example 2: Push to Docker Hub
```bash
# 1. Login
docker login

# 2. List images
docker images | grep anatomy

# 3. Tag backend
docker tag anatomy-backend:1.0 YOUR_USERNAME/anatomy-backend:1.0

# 4. Push
docker push YOUR_USERNAME/anatomy-backend:1.0

# 5. Verify
docker pull YOUR_USERNAME/anatomy-backend:1.0
```

### Example 3: Run on New Machine
```bash
# 1. Pull image
docker pull YOUR_USERNAME/anatomy-backend:latest

# 2. Create .env file with API keys
# Copy backend/.env.example to backend/.env

# 3. Run
docker run -p 8000:8000 --env-file backend/.env YOUR_USERNAME/anatomy-backend:latest
```

---

## 💡 Pro Tips

1. **Always use `-f` with logs:** `docker logs -f` shows live updates
2. **Use container names:** Much easier than IDs
3. **Keep images small:** Use `.dockerignore` file
4. **Tag images properly:** `username/imagename:version`
5. **Use docker-compose:** Easier than managing containers manually
6. **First time setup:** Build takes time, be patient!
7. **Change ports:** Modify docker-compose.yml if ports conflict
8. **Persistent data:** Use volumes in docker-compose.yml
9. **Check .env file:** Make sure environment variables are set
10. **Use layers:** Smaller base images = faster builds

---

## 🔄 Docker Workflow Summary

```
Code Changes
    ↓
docker-compose down        (Stop services)
    ↓
docker-compose build        (Build images)
    ↓
docker-compose up -d        (Start services)
    ↓
View Logs
    ↓
Test Application
    ↓
Push to Docker Hub (optional)
```

---

**Need Help?** See DOCKER_GUIDE.md for detailed explanations.
