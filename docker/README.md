# 🐳 Docker Setup & Configuration

Welcome to the Docker configuration for the AI-Powered 3D Symptom Guidance System!

---

## 🚀 Quick Start

Navigate to this folder and run:

```bash
cd docker
docker-compose build
docker-compose up -d
```

**Access your app:**
- 🌐 Frontend: `http://localhost`
- ⚙️ Backend: `http://localhost:8000`

---

## 📁 This Folder Contains

- **`docker-compose.yml`** - Orchestrates backend and frontend services
- **`backend/Dockerfile`** - Builds Python FastAPI container
- **`frontend/Dockerfile`** - Builds React + Nginx container
- **`DOCKER_GUIDE.md`** - Complete setup & troubleshooting guide
- **`DOCKER_COMMANDS.md`** - Quick command reference

---

## 📚 Documentation

### For Beginners
👉 Start with **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** - covers everything from "What is Docker?" to troubleshooting

### Quick Reference
👉 Check **[DOCKER_COMMANDS.md](./DOCKER_COMMANDS.md)** - common Docker & docker-compose commands

---

## ✅ Prerequisites

- **Docker Desktop** installed ([download](https://www.docker.com/products/docker-desktop))
- Windows/Mac: Docker Desktop app running
- Linux: `docker` and `docker-compose` installed

---

## 🔧 Common Tasks

### Build
```bash
docker-compose build
```

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Execute Commands in Container
```bash
docker-compose exec backend bash
docker-compose exec frontend bash
```

---

## ⚠️ Important Notes

✅ **All Dockerfiles and docker-compose.yml are now organized here**  
✅ **Build contexts automatically reference parent directories** (../backend, ../frontend)  
✅ **Environment files still live in their respective folders** (.env in backend/)  
✅ **This keeps your Docker setup clean and separate from app code**

---

## 🐛 Troubleshooting

**Port 8000 or 80 already in use?**
```bash
# Edit docker-compose.yml and change ports
# "8001:8000" or "8080:80"
```

**Container won't start?**
```bash
docker-compose logs backend
docker-compose logs frontend
```

**Want to clean everything?**
```bash
docker-compose down -v
docker system prune -a
```

---

**Need more help?** See **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** 📖
