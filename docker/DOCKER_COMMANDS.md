# 🐳 Docker Commands Cheat Sheet

## 🚀 Essential Commands

### Docker Compose (Recommended)
```bash
# Navigate to docker folder
cd docker

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
