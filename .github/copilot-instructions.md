# Agent Instructions: Project Initialization (Python/FastAPI + Next.js Monorepo)

## 1. Role & Context
You are an Expert Full-Stack Developer and DevOps Engineer. Your task is to initialize a web-based Workflow Automation Platform in a **Monorepo structure**.
This system acts as a custom UI and management dashboard that connects to an external **n8n instance** (the background execution engine).

The architecture strictly follows the **MVC/Service-Layer pattern**. 
- The Frontend will consume the Backend REST API.
- The Backend will handle business logic, database transactions, and communicate with the n8n API.

## 2. Tech Stack Setup
- **Monorepo Platform:** GitLab
- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Python 3.10+, FastAPI
- **Database:** PostgreSQL
- **Backend ORM:** SQLAlchemy (for Models) + Pydantic (for Schemas/Data Validation)
- **External Engine:** n8n REST API & Webhooks

## 3. Directory Structure Requirement
Generate the following monorepo directory structure at the root:

```text
/ (Root)
  ├── .gitlab-ci.yml       # GitLab CI/CD Pipeline configuration
  ├── /frontend            # Next.js application
  └── /backend             # FastAPI application
      ├── /app
      │   ├── /api         # Controllers/Routers (HTTP endpoints)
      │   ├── /services    # Business logic & n8n integration
          │   ├── /scrapers    # Custom web scrapers (e.g., SIX ITB integration) <-- [TAMBAHKAN INI]
      │   ├── /models      # SQLAlchemy DB Models (Information Holder)
      │   ├── /schemas     # Pydantic validation schemas
      │   └── /core        # Config, DB connection, settings
      ├── requirements.txt # Python dependencies
      └── main.py          # FastAPI application entry point

```

## 4. Step-by-Step Execution Tasks
Step 1: Initialize Database Models (PostgreSQL + SQLAlchemy)
Create the SQLAlchemy models in /backend/app/models/. Translate this DDL concept into SQLAlchemy classes:
- Account: account_id (UUID), full_name, email, password_hash, role, is_active.
- Workflow: workflow_id (UUID), account_id (FK), n8n_workflow_id (String), workflow_name, description, is_active.
- Request: request_id (UUID), account_id (FK), request_type, request_detail, request_status.
- ExecutionHistory: execution_id (UUID), workflow_id (FK), n8n_execution_id, execution_status, error_message

Step 2: Initialize Pydantic Schemas
Create Pydantic models in /backend/app/schemas/ for request validation and response serialization (e.g., WorkflowCreate, WorkflowResponse).

Step 3: Initialize Services (Business Logic)
Create service files in /backend/app/services/ (and /scrapers/). Rule: Services must not depend on FastAPI Request objects directly.
- auth_service.py: Password hashing (passlib), JWT generation.
- workflow_service.py: CRUD logic for workflows in the database.
- request_service.py: Logic for handling user requests (triggers/actions) and admin approval.
- n8n_integration_service.py: HTTP client (using httpx) to send requests to the external n8n API.
- /scrapers/six_itb_scraper.py: Logic to securely authenticate and scrape data from the closed SIX ITB portal (e.g., using Playwright or BeautifulSoup). This acts as the custom trigger source.

Step 4: Initialize API Routers (Controllers)
Create FastAPI routers in /backend/app/api/. Rule: Routers only receive HTTP requests, validate with Pydantic, call Services, and return responses.
- auth_router.py: /login
- workflow_router.py: /workflows (GET, POST, PUT, DELETE)
- request_router.py: /requests (User submissions and Admin approvals)
- webhook_router.py: /webhooks/n8n-log (Receives execution logs from n8n)
- custom_trigger_router.py: /triggers/six-itb (Endpoint for n8n Cron Job to hit, which triggers the six_itb_scraper.py and returns the scraped data to n8n).

Step 5: Initialize Next.js Frontend
Create a standard Next.js app in /frontend. Create placeholder pages mapping to the UI views:
- /login
- /dashboard
- /workflows (List and create modal)
- /requests (User request form & Admin approval view)

Step 6: Create Basic GitLab CI/CD Pipeline (.gitlab-ci.yml)
Create a .gitlab-ci.yml file in the root directory. It must include stages for build, test, and deploy.
Crucially, use the rules: changes directive to ensure the frontend pipeline only runs when /frontend/* changes, and the backend pipeline only runs when /backend/* changes.

## 5. Coding Standards & Guardrails
1. Separation of Concerns: Keep routing logic (FastAPI routers) completely separate from business logic (Services) and database queries (Models).
2. Environment Variables: Never hardcode credentials. Use pydantic-settings in the backend for .env management (DB URL, n8n API Key, JWT Secret).
3. CORS: Ensure FastAPI is configured with CORSMiddleware to accept requests from the Next.js frontend during development and production.

Execute Step 1 to Step 6 sequentially and ask for my confirmation after each major step.