# LMS Backend - Role-Based Access Control Learning Management System

**Author:** Ramharsh Sanjay Dandekar
**Version:** 1.0  
**Java Version:** 21  
**Framework:** Spring Boot 3.5.9-SNAPSHOT

---

## 📚 Project Overview

A comprehensive, enterprise-grade **Learning Management System (LMS)** backend built with **Spring Boot** and **Java 21**. This system implements role-based access control (RBAC) with three distinct user roles: **STUDENT**, **MENTOR**, and **ADMIN**. It provides complete functionality for course management, progress tracking, and automated certificate generation with integrated video storage capabilities.

The application leverages **Supabase PostgreSQL** with Row-Level Security (RLS) policies for data isolation, **JWT-based authentication** for secure API access, and **Cloudinary** for video/PDF storage. It includes automated certificate generation using **iText7** PDF library.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with Bearer token support
- **Role-based access control (RBAC)** with @PreAuthorize annotations
- **Method-level security** for granular permission control
- **Secure password storage** with BCrypt encryption
- **Mentor approval workflow** (Admin-only)

### 📖 Course Management
- **Create, update, and delete courses** (Mentor/Admin only)
- **Chapter management** with sequential ordering
- **Course assignment system** for bulk student enrollment
- **Role-based course access control**
- **Video content storage** with Cloudinary integration

### 📊 Progress Tracking
- **Sequential chapter completion** with validation
- **Course progress calculation** (percentage-based)
- **Student-specific progress retrieval**
- **Completion timestamp tracking**
- **Course assignment validation**

### 🎓 Certificate Generation
- **Automated PDF certificate creation** using iText7
- **100% course completion validation**
- **Cloudinary PDF storage** with public URLs
- **Certificate download endpoints**
- **Student certificate history**

### 🛡️ Database Security
- **Supabase PostgreSQL** with RLS policies
- **Row-level security** for multi-tenant data isolation
- **Development and production policy sets**
- **UUID-based user authentication** integration

### 🚨 Error Handling
- **Global exception handler** (@RestControllerAdvice)
- **Proper HTTP status codes** (401, 403, 404, 400, 409, 500)
- **Validation error responses** with field-level details
- **Custom exception classes** for business logic errors

---

## 🛠️ Tech Stack

### Backend Framework
- **Spring Boot 3.5.9-SNAPSHOT** - Application framework
- **Java 21** - Programming language
- **Maven** - Dependency management & build tool

### Security
- **Spring Security 6.3+** - Authentication & authorization
- **JJWT 0.12.6** - JWT token generation & validation
- **Jakarta Bean Validation** - Request validation

### Database
- **PostgreSQL** - Primary database
- **Supabase** - PostgreSQL hosting with RLS
- **Spring Data JPA** - ORM layer
- **Hibernate** - JPA implementation

### External Services
- **Cloudinary SDK 2.0.2** - Video & PDF storage
- **iText7 8.0.5** - PDF certificate generation

### Documentation
- **Springdoc OpenAPI 2.6.0** - API documentation
- **Swagger UI** - Interactive API explorer

### Testing
- **Spring Boot Test** - Testing framework
- **Testcontainers** - Integration testing with containers
- **JUnit 5** - Unit testing

---

## 📂 Folder Structure

```
lms/
├── src/
│   ├── main/
│   │   ├── java/com/ttd/lms/
│   │   │   ├── LmsApplication.java          # Main application entry point
│   │   │   ├── config/                       # Configuration classes
│   │   │   │   ├── CloudinaryConfig.java    # Cloudinary bean configuration
│   │   │   │   ├── JwtConfig.java           # JWT properties configuration
│   │   │   │   ├── OpenApiConfig.java       # Swagger/OpenAPI configuration
│   │   │   │   └── SecurityConfig.java      # Spring Security configuration
│   │   │   ├── controller/                   # REST API endpoints
│   │   │   │   ├── AdminController.java     # Admin-only user management
│   │   │   │   ├── AuthController.java      # Registration & login
│   │   │   │   ├── CertificateController.java # Certificate generation & retrieval
│   │   │   │   ├── ChapterController.java   # Chapter CRUD operations
│   │   │   │   ├── CourseAssignmentController.java # Course-to-student assignment
│   │   │   │   ├── CourseController.java    # Course CRUD operations
│   │   │   │   └── ProgressController.java  # Progress tracking endpoints
│   │   │   ├── entity/                       # JPA entities (database tables)
│   │   │   │   ├── Certificate.java         # Certificate records
│   │   │   │   ├── Chapter.java             # Course chapters
│   │   │   │   ├── Course.java              # Courses
│   │   │   │   ├── CourseAssignment.java    # Student-course assignments
│   │   │   │   ├── Progress.java            # Chapter completion records
│   │   │   │   ├── Role.java                # User role enum
│   │   │   │   └── User.java                # User accounts
│   │   │   ├── exception/                    # Custom exceptions & handlers
│   │   │   │   ├── BadRequestException.java
│   │   │   │   ├── DuplicateResourceException.java
│   │   │   │   ├── ErrorResponse.java       # Standard error DTO
│   │   │   │   ├── ForbiddenException.java
│   │   │   │   ├── GlobalExceptionHandler.java # @RestControllerAdvice
│   │   │   │   ├── InternalServerException.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── UnauthorizedException.java
│   │   │   │   └── ValidationErrorResponse.java # Validation error DTO
│   │   │   ├── model/                        # Request/Response DTOs
│   │   │   │   ├── AssignCourseRequest.java
│   │   │   │   ├── CertificateResponse.java
│   │   │   │   ├── ChapterRequest.java
│   │   │   │   ├── ChapterResponse.java
│   │   │   │   ├── CourseProgressResponse.java
│   │   │   │   ├── CourseRequest.java
│   │   │   │   ├── CourseResponse.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── LoginResponse.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   └── UserResponse.java
│   │   │   ├── repository/                   # Spring Data JPA repositories
│   │   │   │   ├── CertificateRepository.java
│   │   │   │   ├── ChapterRepository.java
│   │   │   │   ├── CourseAssignmentRepository.java
│   │   │   │   ├── CourseRepository.java
│   │   │   │   ├── ProgressRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/                     # Security utilities
│   │   │   │   ├── JwtTokenProvider.java    # JWT generation & validation
│   │   │   │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   │   │   └── CustomUserDetailsService.java # UserDetails implementation
│   │   │   ├── service/                      # Business logic layer
│   │   │   │   ├── AdminService.java        # Admin operations
│   │   │   │   ├── AuthService.java         # Authentication logic
│   │   │   │   ├── CertificateService.java  # Certificate generation
│   │   │   │   ├── ChapterService.java      # Chapter management
│   │   │   │   ├── CourseAssignmentService.java # Assignment logic
│   │   │   │   ├── CourseService.java       # Course management
│   │   │   │   └── ProgressService.java     # Progress tracking
│   │   │   └── validation/                   # Custom validators
│   │   │       ├── ValidUUID.java           # UUID format annotation
│   │   │       └── ValidUUIDValidator.java  # UUID validator implementation
│   │   └── resources/
│   │       ├── application.properties       # Application configuration
│   │       ├── db/
│   │       │   └── dev_rls_policies.sql     # Supabase RLS policies
│   │       └── META-INF/
│   │           └── additional-spring-configuration-metadata.json
│   └── test/
│       └── java/com/ttd/lms/                # Test classes
│           ├── LmsApplicationTests.java
│           ├── TestcontainersConfiguration.java
│           └── TestLmsApplication.java
├── target/                                   # Compiled classes (generated)
├── pom.xml                                   # Maven dependencies
├── mvnw & mvnw.cmd                          # Maven wrapper scripts
├── HELP.md                                   # Spring Initializr help
├── instructions.md                           # Development instructions
└── README.md                                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before running this application, ensure you have:

- **Java 21** or higher installed ([Download](https://adoptium.net/))
- **Maven 3.9+** (or use included Maven wrapper)
- **PostgreSQL** database (or **Supabase** account)
- **Cloudinary** account for video/PDF storage ([Sign up](https://cloudinary.com/))
- **Git** for version control

### Environment Variables

Create a `.env` file or set the following environment variables:

```properties
# Database Configuration (Supabase PostgreSQL)
DB_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres
DB_USERNAME=postgres.your-project-id
DB_PASSWORD=your-database-password

# JWT Configuration
JWT_SECRET=your-256-bit-secret-key-for-jwt-tokens-keep-it-secure
JWT_EXPIRATION=86400000
# JWT_EXPIRATION in milliseconds (86400000 = 24 hours)

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Application Port (optional, default: 8080)
SERVER_PORT=8080
```

### application.properties Configuration

Update [src/main/resources/application.properties](src/main/resources/application.properties):

```properties
spring.application.name=lms

# Database
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Cloudinary
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}

# Swagger UI (accessible at http://localhost:8080/swagger-ui.html)
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operations-sorter=method

# Server
server.port=${SERVER_PORT:8080}
```

---

## 📥 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd lms
```

### Step 2: Configure Database (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Navigate to **Project Settings > Database**
3. Copy the **Transaction Pooler** connection string (port 6543)
4. Update `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in your environment

### Step 3: Apply RLS Policies (Optional for Development)

The application includes **Row-Level Security (RLS)** policies for Supabase. To apply:

1. Navigate to Supabase **SQL Editor**
2. Copy the contents of [src/main/resources/db/dev_rls_policies.sql](src/main/resources/db/dev_rls_policies.sql)
3. Execute the SQL script

**Note:** These are **permissive development policies**. For production, implement stricter RLS rules.

### Step 4: Configure Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Navigate to **Dashboard**
3. Copy **Cloud Name**, **API Key**, and **API Secret**
4. Update environment variables

### Step 5: Build the Project

Using Maven wrapper (recommended):

```bash
# Windows
mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

Or using system Maven:

```bash
mvn clean install
```

### Step 6: Run the Application

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run
```

The application will start on **http://localhost:8080**

### Step 7: Access API Documentation

Once the application is running:

- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

## 📡 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user (default: STUDENT role) |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Admin Endpoints
Not disclosing for security purpose

### Course Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/courses` | MENTOR | Create new course |
| GET | `/api/courses/my` | MENTOR | Get my courses (as mentor) |
| PUT | `/api/courses/{id}` | MENTOR | Update course (owner only) |
| DELETE | `/api/courses/{id}` | MENTOR | Delete course (owner only) |

### Chapter Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/courses/{courseId}/chapters` | MENTOR | Add chapter to course (owner only) |
| GET | `/api/courses/{courseId}/chapters` | MENTOR/STUDENT | Get chapters (mentor: owner, student: assigned) |

### Course Assignment Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/courses/{courseId}/assign` | MENTOR | Assign course to students (bulk) |

### Progress Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/progress/chapters/{chapterId}/complete` | STUDENT | Complete chapter (sequential validation) |
| GET | `/api/progress/my` | STUDENT | Get all my progress |
| GET | `/api/progress/courses/{courseId}` | STUDENT | Get progress for specific course |

### Certificate Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/certificates/courses/{courseId}/generate` | STUDENT | Generate certificate (100% completion required) |
| GET | `/api/certificates/courses/{courseId}` | STUDENT | Get certificate for course |
| GET | `/api/certificates/my` | STUDENT | Get all my certificates |

---

## 🔐 Role-Based Access Control (RBAC)

### Role Matrix

| Feature | STUDENT | MENTOR | ADMIN |
|---------|---------|--------|-------|
| Register/Login | ✅ | ✅ | ✅ |
| View assigned courses | ✅ | ❌ | ❌ |
| Complete chapters | ✅ | ❌ | ❌ |
| View own progress | ✅ | ❌ | ❌ |
| Generate certificates | ✅ | ❌ | ❌ |
| Create courses | ❌ | ✅ | ✅ |
| Update/Delete own courses | ❌ | ✅ | ✅ |
| Add chapters to courses | ❌ | ✅ | ✅ |
| Assign courses to students | ❌ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Approve mentors | ❌ | ❌ | ✅ |

---

## 🧪 Testing the API

### Using Swagger UI (Recommended)

1. Start the application
2. Navigate to [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
3. Click **Authorize** button
4. Enter JWT token: `Bearer <your-token>`
5. Test endpoints interactively

### Using cURL

#### 1. Register a Student

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ramharsh Dandekar",
    "email": "ramharsh@example.com",
    "password": "password123"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ramharsh@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Ramharsh Dandekar",
  "email": "ramharsh@example.com",
  "role": "STUDENT"
}
```

#### 3. Create a Course (MENTOR only)

```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Introduction to Spring Boot",
    "description": "Learn Spring Boot from scratch",
    "videoUrl": "https://cloudinary.com/..."
  }'
```

#### 4. Complete a Chapter (STUDENT only)

```bash
curl -X POST http://localhost:8080/api/progress/chapters/{chapterId}/complete \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### 5. Generate Certificate (STUDENT only)

```bash
curl -X POST http://localhost:8080/api/certificates/courses/{courseId}/generate \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 🏗️ Architecture & Design

### Layered Architecture

```
┌─────────────────────────────────────┐
│      Controller Layer               │  ← REST API endpoints
├─────────────────────────────────────┤
│      Service Layer                  │  ← Business logic
├─────────────────────────────────────┤
│      Repository Layer               │  ← Data access (JPA)
├─────────────────────────────────────┤
│      Database (PostgreSQL)          │  ← Persistence
└─────────────────────────────────────┘
```

### Security Flow

```
Request → JwtAuthenticationFilter
       → JwtTokenProvider.validateToken()
       → Authentication object set in SecurityContext
       → @PreAuthorize check
       → Controller method execution
```

### Sequential Chapter Completion Logic

```
Student completes Chapter 3
    ↓
System checks: Is Chapter 2 completed?
    ↓ Yes
System checks: Is Chapter 1 completed?
    ↓ Yes
Chapter 3 marked as complete
    ↓
Progress percentage updated
```

---

## 🚨 Error Handling

The application uses **GlobalExceptionHandler** with proper HTTP status codes:

| Exception | HTTP Status | Description |
|-----------|-------------|-------------|
| ResourceNotFoundException | 404 NOT_FOUND | Resource not found |
| BadRequestException | 400 BAD_REQUEST | Invalid request data |
| UnauthorizedException | 401 UNAUTHORIZED | Invalid or missing JWT token |
| ForbiddenException | 403 FORBIDDEN | Access denied (RBAC violation) |
| DuplicateResourceException | 409 CONFLICT | Resource already exists |
| InternalServerException | 500 INTERNAL_SERVER_ERROR | Server error |
| MethodArgumentNotValidException | 400 BAD_REQUEST | Validation error (field-level) |

**Example Error Response:**

```json
{
  "timestamp": "2025-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Course not found with id: 123",
  "path": "/api/courses/123"
}
```

**Validation Error Response:**

```json
{
  "timestamp": "2025-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/register",
  "errors": {
    "email": "must be a well-formed email address",
    "password": "size must be between 6 and 100"
  }
}
```

---

## 📝 Database Schema

### Tables

- **users** - User accounts (id, name, email, password, role, approved, created_at)
- **courses** - Courses (id, title, description, video_url, mentor_id, created_at, updated_at)
- **chapters** - Course chapters (id, title, video_url, order_index, course_id, created_at, updated_at)
- **course_assignments** - Student-course assignments (id, student_id, course_id, mentor_id, assigned_at)
- **progress** - Chapter completion tracking (id, student_id, chapter_id, course_id, completed_at)
- **certificates** - Generated certificates (id, student_id, course_id, certificate_url, issued_at)

### Relationships

```
User (MENTOR) ──< Course ──< Chapter
                   │
                   │ (assigned to)
                   ↓
              CourseAssignment → User (STUDENT)
                                    │
                                    ├──< Progress
                                    └──< Certificate
```

---

## 🔒 Security Best Practices

- **JWT tokens** stored client-side (localStorage/sessionStorage)
- **BCrypt password hashing** with salt rounds
- **Row-Level Security (RLS)** policies in Supabase
- **@PreAuthorize annotations** for method-level security
- **CORS configuration** for frontend integration
- **Environment variables** for sensitive credentials

---

## 🛣️ Roadmap

- [ ] Add course categories/tags
- [ ] Implement course reviews/ratings
- [ ] Add email notifications (course assignment, certificate generation)
- [ ] Implement course search and filtering
- [ ] Add course analytics for mentors
- [ ] Implement file upload for course materials
- [ ] Add quiz/assessment functionality
- [ ] Implement course completion badges
- [ ] Add multi-language support

---

## 📄 License

This personal project no Open source license is applied.

Project is developed by **Ramharsh** as part of a Learning Management System implementation.

---

## 👤 Author

**Ramharsh**  
Full stack Developer | Java & Spring Boot

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Supabase for PostgreSQL hosting with RLS
- Cloudinary for reliable media storage
- iText7 for PDF generation capabilities

---

**Built with ❤️ by Ramharsh**

