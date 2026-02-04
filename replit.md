# G-Scholar Hub

## Overview

G-Scholar Hub is a university research scholar management portal designed for GITAM University. The application provides role-based dashboards for five user types: Scholars, Supervisors, DRC (Departmental Research Committee), IRC (Institutional Research Committee), and DoAA (Dean of Academic Affairs). Core features include profile management, research progress tracking, fee details, application submissions with multi-stage approval workflow, document management, and notice boards.

## Application Approval Workflow

Applications submitted by scholars go through a 3-stage approval workflow:
1. **DRC (Departmental Research Committee)** - First level review
2. **IRC (Institutional Research Committee)** - Second level review  
3. **DoAA (Dean of Academic Affairs)** - Final approval

Each reviewer can:
- **Approve**: Moves application to next stage (or completes if at DoAA)
- **Reject**: Stops the workflow and marks application as rejected

Remarks are required for both approval and rejection decisions. The complete review history is stored and visible to scholars.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Custom CSS (gscholar.css) preserving original design
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints defined in shared route definitions
- **Validation**: Zod schemas shared between client and server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - defines users, applications, and research progress tables
- **Migrations**: Drizzle Kit with migrations output to `./migrations`

---

## Docker (Local Setup)

You can run the app locally using Docker Compose with a Node container for the app and a Postgres container for the database.

### Prerequisites
- Docker + Docker Compose installed

### Steps
1. Build and start the services:
   ```bash
   docker compose up --build
   ```
2. In another terminal, push the database schema:
   ```bash
   docker compose exec app npm run db:push
   ```
3. Open the app at:
   ```
   http://localhost:5000
   ```

### Notes
- The Postgres connection is provided via `DATABASE_URL` in `docker-compose.yml`.
- Demo users are seeded automatically on startup (see the login screen).

---

## File Documentation

### Client Files

#### `client/src/App.tsx`
**Purpose**: Main application entry point and router configuration.
- Wraps the app in QueryClientProvider for React Query
- Sets up Wouter routes (/ -> Home, fallback -> NotFound)
- Includes Toaster component for notifications

#### `client/src/pages/Home.tsx`
**Purpose**: Main single-page application containing all role-based views (~1200 lines).
- **State Management**:
  - `role`: Current user role (scholar/rac/supervisor)
  - `sidebarOpen`: Toggle sidebar visibility
  - `scholarPage/racPage/supervisorPage`: Current active page per role
- **Components**:
  - Header with hamburger menu, logo, title, role label, profile dropdown
  - Sidebar with role-specific navigation items
  - Main content area rendering page components based on role/page state
- **Role-specific Pages**:
  - Scholar: Profile, Applications, Research Progress, Fee Details, Doc-Hub, Notice Board
  - RAC: Dashboard, RAC Reviews
  - Supervisor: Dashboard, RAC Reports, Profile, Biometric, LPC
- **Features**:
  - Role switching via profile dropdown
  - Application forms (Supervisor Change, Pre-talk, Extension, Re-registration)
  - Application tracking with progress bars
  - Modal system for viewing application details

#### `client/src/styles/gscholar.css`
**Purpose**: Complete CSS styling preserving original vanilla design (~700 lines).
- **Color Scheme**:
  - Primary: Teal (#0b6a55)
  - Secondary: Gold (#f4b400)
  - Background: Light gray (#f5f5f5)
- **Layout Styles**:
  - Dashboard layout (header, sidebar, content)
  - Responsive design for mobile/tablet
  - Collapsible sidebar animations
- **Component Styles**:
  - Cards, tables, forms, buttons
  - Application tracking progress bars
  - Modal/popup styling
  - Role-specific navigation highlighting (red badges for Applications/Doc-Hub)

#### `client/src/main.tsx`
**Purpose**: React DOM entry point, renders App component.

#### `client/src/index.css`
**Purpose**: Base Tailwind CSS configuration and CSS variables.

#### `client/src/lib/queryClient.ts`
**Purpose**: TanStack React Query client configuration.
- Sets up default query function for API calls
- Configures caching and refetching behavior
- Provides `apiRequest` helper for mutations

---

### Server Files

#### `server/index.ts`
**Purpose**: Express server entry point.
- Configures middleware (JSON parsing, sessions, logging)
- Sets up API routes
- Configures Vite for development or serves static files in production
- Binds to port 5000

#### `server/routes.ts`
**Purpose**: API route definitions (~100 lines).
- `GET /api/users/:id` - Fetch user profile by ID
- `PUT /api/users/:id` - Update user profile (including role switching)
- `GET /api/applications` - Fetch all applications for a scholar
- `POST /api/applications` - Submit new application
- `GET /api/stats/:scholarId` - Fetch research statistics

#### `server/storage.ts`
**Purpose**: Data access layer using Drizzle ORM.
- **IStorage Interface**:
  - `getUser(id)`: Retrieve user by ID
  - `updateUser(id, data)`: Update user fields
  - `getApplications(scholarId)`: Get applications for scholar
  - `createApplication(data)`: Create new application
  - `getStats(scholarId)`: Get research progress stats
- **DatabaseStorage Class**: PostgreSQL implementation

#### `server/db.ts`
**Purpose**: Database connection setup.
- Creates PostgreSQL connection pool using DATABASE_URL
- Initializes Drizzle ORM instance

#### `server/vite.ts`
**Purpose**: Vite development server integration with Express.

---

### Shared Files

#### `shared/schema.ts`
**Purpose**: Database schema definitions using Drizzle ORM.
- **Tables**:
  - `users`: id, username, role, name, email, phone, scholarId, location, batch, status, personal details (fatherName, parentMobile, aadhaar, nationality, address), education (tenthBoard, tenthPercentage, interBoard, interPercentage), avatarUrl
  - `applications`: id, scholarId, type, status, submissionDate, details (JSONB)
  - `researchProgress`: id, scholarId, completedReviews, pendingReports, publications, lastReviewDate
- **Types**: Insert/Select types for each table using Zod

#### `shared/routes.ts`
**Purpose**: Shared route type definitions for type-safe API calls.

---

### Configuration Files

#### `package.json`
**Purpose**: Node.js project configuration.
- Scripts: dev, build, start, db:push
- Dependencies: React, Express, Drizzle, TanStack Query, shadcn/ui components

#### `tsconfig.json`
**Purpose**: TypeScript compiler configuration.

#### `vite.config.ts`
**Purpose**: Vite bundler configuration.
- Path aliases (@/, @shared/, @assets/)
- Development server settings

#### `drizzle.config.ts`
**Purpose**: Drizzle ORM migration configuration.

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS configuration with custom theme.

---

### Reference Files

#### `attached_assets/Styles_1769798862034.css`
**Purpose**: Original vanilla CSS file (1700+ lines) for reference.

#### `attached_assets/FullScript_1769799095480.js`
**Purpose**: Original vanilla JavaScript file (2500+ lines) for reference.

---

## Role-Based Access

The system supports three roles with different navigation menus:
- **Scholar**: Profile, Research Progress, Fee Details, Applications (red badge), Doc-Hub (red badge), Notice Board
- **Supervisor**: Dashboard, RAC Reports, Notice Board, Profile, Biometric, LPC
- **RAC**: Dashboard, RAC Reviews

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/:id | Fetch user profile |
| PUT | /api/users/:id | Update user profile/role |
| GET | /api/applications | Get scholar applications |
| POST | /api/applications | Submit new application |
| GET | /api/stats/:scholarId | Get research statistics |

## Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| username | text | Login username |
| role | text | scholar/rac/supervisor |
| name | text | Full name |
| email | text | Email address |
| phone | text | Phone number |
| scholarId | text | Scholar registration ID |
| location | text | Campus/Department |
| batch | text | Academic batch |
| status | text | Active/Inactive |

### applications
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| scholarId | integer | Foreign key to users |
| type | text | Leave/Extension/etc |
| status | text | Pending/Approved/Rejected |
| submissionDate | timestamp | When submitted |
| details | jsonb | Application-specific data |

### researchProgress
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| scholarId | integer | Foreign key to users |
| completedReviews | integer | Number of completed reviews |
| pendingReports | integer | Reports awaiting submission |
| publications | integer | Published papers count |
