# IsokoDocs

IsokoDocs – Open document archive platform for Burundi & diaspora communities

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

IsokoDocs is a production-ready full-stack web application for archiving and sharing documents related to Burundi and its diaspora communities. The platform features document upload, moderation workflow, search functionality, and a clean wiki-like interface.

## Features

- **Document Management**: Upload, browse, and download PDF documents
- **Categories**: Organized document categories (Government, Education, Health, etc.)
- **Search & Filtering**: Full-text search with filters by category, language, and license
- **User Authentication**: JWT-based authentication with registration and login
- **Moderation System**: Document approval workflow with moderator dashboard
- **Reporting**: Users can report documents for copyright, spam, or other issues
- **Multilingual**: English and French language support
- **Responsive Design**: Clean, wiki-like interface that works on all devices
- **API**: RESTful API with Django REST Framework
- **Docker Support**: Complete containerization for easy deployment

## Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Production database (SQLite for development)
- **JWT Authentication** - Simple JWT for token-based auth
- **File Storage** - Local storage (dev) / S3-compatible (prod)

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **i18next** - Internationalization

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and static file serving
- **PostgreSQL** - Database

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Local Development with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/isokodocs.git
   cd isokodocs
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Admin panel: http://localhost:8000/admin/

4. **Create a superuser** (in a new terminal)
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

### Local Development (without Docker)

1. **Backend Setup**
   ```bash
   cd djangoproj
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your settings
   python manage.py migrate
   python manage.py seed_categories
   python manage.py createsuperuser
   python manage.py runserver
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables

### Backend (.env)

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3  # For development
# DATABASE_URL=postgresql://user:pass@host:port/db  # For production

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# File Storage
USE_S3=False
MAX_UPLOAD_SIZE=52428800

# Rate Limiting
RATELIMIT_ENABLE=True

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
```

## API Documentation

The API is available at `/api/` and includes the following endpoints:

### Authentication
- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/logout/` - User logout
- `GET /api/accounts/profile/` - Get user profile

### Documents
- `GET /api/documents/` - List documents (with search/filtering)
- `POST /api/documents/` - Upload document
- `GET /api/documents/{id}/` - Get document details
- `PUT /api/documents/{id}/` - Update document
- `DELETE /api/documents/{id}/` - Delete document
- `GET /api/documents/{id}/download/` - Download document

### Categories
- `GET /api/categories/` - List categories
- `GET /api/categories/{id}/` - Get category details

### Reports
- `GET /api/reports/` - List reports (moderators only)
- `POST /api/reports/` - Create report
- `POST /api/reports/{id}/resolve/` - Resolve report (moderators only)

### Moderator Actions
- `POST /api/documents/{id}/approve/` - Approve document
- `POST /api/documents/{id}/reject/` - Reject document
- `GET /api/accounts/users/` - List users (moderators only)
- `POST /api/accounts/users/{id}/ban/` - Ban user
- `POST /api/accounts/users/{id}/unban/` - Unban user

## Production Deployment

### Option 1: Railway

1. **Create a Railway project**
2. **Connect your GitHub repository**
3. **Set environment variables** in Railway dashboard
4. **Deploy**

### Option 2: Render

1. **Create a Render account**
2. **Create a PostgreSQL database**
3. **Create a Web Service** for the backend
4. **Create a Static Site** for the frontend
5. **Configure environment variables**
6. **Deploy**

### Manual Deployment

1. **Set up a VPS** (Ubuntu/Debian recommended)
2. **Install Docker and Docker Compose**
3. **Clone the repository**
4. **Create production .env files**
5. **Run production compose**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Project Structure

```
isokodocs/
├── djangoproj/              # Django project root
│   ├── manage.py
│   ├── djangoproj/          # Django settings
│   ├── requirements.txt
│   └── .env.example
├── djangoapp/               # Django apps
│   ├── accounts/            # User management
│   ├── categories/          # Document categories
│   ├── documents/           # Document management
│   └── reports/             # Report system
├── frontend/                # React application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docker/                  # Docker files
├── docker-compose.yml       # Development setup
├── docker-compose.prod.yml  # Production setup
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@isokodocs.com or create an issue in this repository.

## Acknowledgments

- Built for the Burundi diaspora community
- Inspired by wiki-style document archives
- Thanks to all contributors and the open-source community
