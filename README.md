# CAVS (CUET Anonymous Voting System)

A secure and anonymous voting platform designed specifically for CUET (Chittagong University of Engineering & Technology) students.

## 🌟 Overview

CAVS enables students to participate in polls and surveys while maintaining their anonymity. The system uses CUET email addresses for authentication but ensures voter privacy through SHA256 email hashing and secure data handling.

### Key Technologies

- **Backend**: FastAPI, SQLModel
- **Frontend**: Next.js, Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Supabase
- **Containerization**: Docker

## ✨ Features

- **Secure Authentication**
  - CUET email verification
  - SHA256 email hashing for anonymity
  - Secure token-based sessions

- **Poll Management**
  - Anonymous voting mechanism
  - Custom poll creation
  - Time-bound polls
  - Public and private poll options
  - Real-time results visualization

- **Privacy First**
  - No voter identity tracking
  - Encrypted data storage
  - Transparent poll creation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12+
- Docker (optional)
- Poetry (for Python dependency management)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MahirSalahin/cavs.git
   cd cavs
   ```

2. **Backend Setup**
   ```bash
   cd backend
   poetry install
   poetry run uvicorn main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

4. **Docker Setup (Alternative)**
   ```bash
   docker-compose up -d
   ```

Visit `http://localhost:3000` for the frontend and `http://localhost:8000/docs` for the API documentation.

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
