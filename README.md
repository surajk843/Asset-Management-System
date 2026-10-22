# AssetManagement
This is a typical Assetmanagement application made with react node.js express.js and Sql 

# Asset Management System (AMS)

A full-stack Asset Management System built using Node.js, Express.js, MySQL, and JWT Authentication. The system helps organizations manage employees, assets, assignments, reports, and dashboard analytics through secure REST APIs.

# Tech Stack :-

Node.js
Express.js
MySQL
JWT Authentication
REST API
Postman
SQL
MVC Architecture

# PROJECT STRUCTURE

Asset-Management-System/
│
├── controllers/
├── routes/
├── middleware/
├── database/
├── config/
├── uploads/
├── app.js
├── package.json
└── README.md

# Database Tables

Table	    Purpose
users	    Stores employee and admin information.
roles	    Stores system roles like Admin and Employee.
categories	Stores different asset categories.
assets	    Stores complete asset details.
asset_assignments	Stores asset assignment history.
audit_logs	Stores all important system activities.


# 📦 Project Modules

## 1. Authentication Module
**File:** `controllers/authController.js`, `routes/authRoutes.js`, `middleware/authMiddleware.js`
> Handles user registration, login, JWT token generation, and authentication.

---

## 2. Role Authorization Module
**File:** `middleware/roleMiddleware.js`
> Restricts API access based on user roles such as Admin and Employee.

---

## 3. User Management Module
**File:** `controllers/userController.js`, `routes/userRoutes.js`
> Performs Create, Read, Update, and Delete (CRUD) operations for system users.

---

## 4. Category Management Module
**File:** `controllers/categoryController.js`, `routes/categoryRoutes.js`
> Manages different asset categories like Laptop, Monitor, Printer, etc.

---

## 5. Asset Management Module
**File:** `controllers/assetController.js`, `routes/assetRoutes.js`
> Adds, updates, retrieves, and deletes company assets.

---

## 6. Asset Assignment Module
**File:** `controllers/assignmentController.js`, `routes/assignmentRoutes.js`
> Assigns available assets to employees and updates asset status.

---

## 7. Asset Return Module
**File:** `controllers/assignmentController.js`
> Returns assigned assets and changes their status back to Available.

---

## 8. Soft Delete Module
**File:** `controllers/assetController.js`
> Marks assets as deleted without permanently removing them from the database.

---

## 9. Restore Asset Module
**File:** `controllers/assetController.js`
> Restores previously soft-deleted assets back to active status.

---

## 10. Asset Search Module
**File:** `controllers/assetController.js`
> Searches assets using filters like name, brand, category, and status.

---

## 11. Asset Pagination Module
**File:** `controllers/assetController.js`
> Displays assets page by page using LIMIT and OFFSET.

---

## 12. Asset Sorting Module
**File:** `controllers/assetController.js`
> Sorts assets dynamically by selected columns in ascending or descending order.

---

## 13. Audit Log Module
**File:** `controllers/auditController.js`
> Records important system activities such as Create, Update, Delete, and Restore actions.

---

# 📊 Dashboard & Reporting Modules

## 14. Dashboard Statistics Module
**File:** `controllers/dashboardController.js`, `routes/dashboardRoutes.js`
> Returns dashboard summary counts such as total assets, users, and categories.

---

## 15. Recent Assignment Module
**File:** `controllers/dashboardController.js`
> Displays the latest asset assignments performed in the system.

---

## 16. Category Summary Module
**File:** `controllers/dashboardController.js`
> Shows the total number of assets available in each category.

---

## 17. Warranty Alert Module
**File:** `controllers/dashboardController.js`
> Lists assets whose warranty is nearing expiration.

---

## 18. Monthly Purchase Module
**File:** `controllers/dashboardController.js`
> Displays asset purchase statistics grouped by month.

---

## 19. Asset Statistics Module
**File:** `controllers/dashboardController.js`
> Provides overall asset statistics for dashboard cards and reports.

---

## 20. Low Stock Report Module
**File:** `controllers/dashboardController.js`
> Displays categories having fewer assets than the minimum required quantity.

---

## 21. Warranty Expiry Report Module
**File:** `controllers/dashboardController.js`
> Retrieves assets whose warranty expires within a selected number of days.

---

## 22. Purchase History Module
**File:** `controllers/dashboardController.js`
> Displays complete purchase details of assets within a selected date range.

---

## 23. Purchase Cost Summary Module
**File:** `controllers/dashboardController.js`
> Calculates total, average, minimum, and maximum purchase costs.

---

## 24. Brand Wise Asset Report Module
**File:** `controllers/dashboardController.js`
> Shows the total number of assets grouped by brand.

---

## 25. Asset Status Report Module
**File:** `controllers/dashboardController.js`
> Displays asset count by status such as Available, Assigned, Maintenance, and Retired.

---

## 26. Employee Asset History Module
**File:** `controllers/dashboardController.js`
> Shows the complete assignment history of a selected employee.

---

## 27. Employee Asset Summary Module
**File:** `controllers/dashboardController.js`
> Displays the total number of assets currently assigned to every employee.

---

## 28. Global Search Module
**File:** `controllers/dashboardController.js`
> Searches assets, users, and categories using a single keyword.

---

## 29. Activity Timeline Module
**File:** `controllers/dashboardController.js`
> Displays the latest activities recorded in the audit logs.

---

## 30. Database Health Dashboard Module
**File:** `controllers/dashboardController.js`
> Returns important database statistics through a single optimized API.

---

## 31. Advanced Global Search Module
**File:** `controllers/dashboardController.js`
> Performs an advanced search across assets, users, categories, vendors, statuses, and assignments.

# Security Features

JWT Authentication
Password Encryption
Role-Based Authorization
Protected Routes
Parameterized SQL Queries
SQL Injection Prevention
Audit Logging

# SQL Features Used

INNER JOIN
LEFT JOIN
GROUP BY
ORDER BY
COUNT()
SUM()
AVG()
MIN()
MAX()
BETWEEN
LIMIT
OFFSET
Dynamic Search Queries
Aggregate Functions

# API Features

RESTful APIs
CRUD Operations
Dashboard Analytics
Reports
Search
Pagination
Sorting
Filtering
Soft Delete
Restore
Audit Trail

# Backend Folder Responsibility

Folder	        Purpose
controllers	    Contains business logic for APIs.
routes	        Defines API endpoints.
middleware	    Handles authentication and authorization.
database	    MySQL connection configuration.
config	        Application configuration files.
uploads	        Stores uploaded files (if used).

# Testing

Postman API Testing
MySQL Query Verification
JWT Authentication Testing
CRUD Testing
Search Testing
Pagination Testing
Sorting Testing
Dashboard Report Testing
Assignment Workflow Testing
Audit Log Verification

# Project Highlights


30+ REST APIs
JWT Authentication
Role-Based Access Control
MVC Architecture
MySQL Relational Database
Dynamic Dashboard Reports
Search, Pagination & Sorting
Audit Logging
Secure SQL Queries
Production-Style Backend Structure

## BACK-END & DATABASE DONE ##

## FRONT-END ##

Asset Management System (AMS) --- Frontend

1. Project Overview

The Asset Management System (AMS) is a full-stack web application
used to manage an organization's assets, users, employees, assignments,
and related records.

The frontend is built with React.js and Vite. It provides the
user interface through which authenticated users can view and manage AMS
data.

Frontend responsibilities

The frontend is responsible for:

Rendering the application UI.

Providing login and authentication screens.

Handling navigation between AMS modules.

Displaying dashboard information.

Providing forms for creating and editing records.

Calling backend REST APIs.

Sending authentication tokens with protected requests.

Handling API responses and displaying success/error messages.

Applying role-based UI behavior where required.

Managing reusable UI components.

Providing responsive styling with Tailwind CSS.

The frontend does not directly connect to MySQL.

The communication path is:

React Frontend
      ↓
Axios / API Service
      ↓
Node.js + Express REST API
      ↓
Controller
      ↓
Service / Repository
      ↓
MySQL

2. Technology Stack

Technology         Purpose

React.js           Frontend UI and component development
Vite               Development server and build tool
JavaScript / JSX   Frontend programming
Tailwind CSS       Styling and responsive UI
Axios              HTTP/API communication
React Router       Frontend page navigation
JWT                Authentication token used for protected API requests
Node.js            Backend runtime
Express.js         Backend REST API
MySQL              Database

3. Frontend Architecture

The frontend follows a component-based React architecture.

src/
│
├── assets/
│
├── components/
│   ├── Navbar / Header
│   ├── Sidebar
│   ├── Buttons
│   ├── Forms
│   ├── Tables
│   ├── Modals
│   └── Other reusable UI components
│
├── pages/
│   ├── Login
│   ├── Dashboard
│   ├── Users
│   ├── Assets
│   ├── Employees
│   ├── Assignments
│   └── Audit Logs
│
├── services/
│   └── API service files
│
├── hooks/
│
├── context/
│
├── App.jsx
│
└── main.jsx

Exact filenames can vary depending on the final folder structure. The
important separation is that pages contain screen-level UI, components
contain reusable UI, and services contain API communication.

4. Application Entry Point

main.jsx

main.jsx is the starting point of the React application.

Its main responsibility is to mount the React application into the HTML
root element.

Conceptually:

createRoot(document.getElementById("root")).render(
  <App />
);

The flow is:

index.html
   ↓
main.jsx
   ↓
App.jsx
   ↓
Routes / Pages
   ↓
Components

5. App.jsx

App.jsx acts as the main application component.

It is responsible for connecting the application's page structure and
routing.

Conceptually:

App.jsx
   │
   ├── Login
   │
   └── Authenticated Application
          │
          ├── Dashboard
          ├── Users
          ├── Employees
          ├── Assets
          ├── Assignments
          └── Audit Logs

6. Routing

React Router is used to move between frontend pages without reloading
the entire browser page.

Typical flow:

/login
/dashboard
/users
/employees
/assets
/assignments
/audit-logs

Routing is a frontend operation.

For example:

<Route path="/dashboard" element={<Dashboard />} />

This does not call the backend by itself.

The page calls the backend only when it needs data or needs to perform
an operation.

7. Authentication Frontend

The login page is the starting point for authenticated users.

The basic flow is:

Login Page
    ↓
User enters email + password
    ↓
Frontend sends login request
    ↓
Backend verifies credentials
    ↓
Backend returns JWT
    ↓
Frontend stores token
    ↓
User enters authenticated application

The frontend should not verify the user's password against MySQL
directly.

The backend performs credential verification.

8. JWT Token Handling

After successful login, the backend returns an authentication token.

The frontend stores the token and uses it for protected API requests.

Conceptually:

localStorage.setItem("token", response.data.token);

When an authenticated API request is made:

Frontend
   ↓
Authorization: Bearer <JWT>
   ↓
Express Middleware
   ↓
JWT verification
   ↓
Controller

This allows the backend to identify the authenticated user.

9. API Service Layer

The frontend uses an API/service layer rather than putting every API
request directly into JSX markup.

The purpose of the service layer is to keep:

UI logic

separate from:

API communication

For example:

api.get("/api/users");

or:

api.post("/api/users", userData);

The exact service filename may differ, but the responsibility remains
the same:

React Page
   ↓
API Service
   ↓
Axios
   ↓
Express API

10. Backend Connection Map

This section identifies which frontend modules communicate with the
backend.

10.1 Login Page

Frontend

Login Page

Backend

POST /api/auth/login

Flow

Login.jsx
   ↓
API/Auth service
   ↓
POST /api/auth/login
   ↓
Auth Controller
   ↓
User verification
   ↓
JWT response
   ↓
Login page stores token

The login page is therefore directly connected to the authentication
API.

11. Users Page

The Users module is connected to the backend through the Users API.

Known backend endpoints:

GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

Frontend flow

Get users

Users Page
   ↓
GET /api/users
   ↓
Users Controller
   ↓
Database
   ↓
Users data
   ↓
Users table

Create user

Users Form
   ↓
POST /api/users
   ↓
Backend
   ↓
MySQL

Update user

Edit User
   ↓
PUT /api/users/:id
   ↓
Backend
   ↓
MySQL

Delete user

Delete User
   ↓
DELETE /api/users/:id
   ↓
Backend
   ↓
MySQL

User fields

The user API uses:

user_id
full_name
email
role_id
created_at

Create/update requests use:

full_name
email
password
role_id

12. Role-Based Access

The AMS has roles including:

1 → Admin
2 → Employee

The frontend can use the authenticated user's role to control which UI
operations are available.

Example:

Admin
 ├── View Users
 ├── Create Users
 ├── Edit Users
 └── Delete Users

Employee
 └── Restricted user-management operations

Important:

Frontend role checks are for UI control.

The backend must still enforce authorization because hiding a button in
React is not a security mechanism.

13. Dashboard Page

The Dashboard is the main authenticated landing page.

Its purpose is to provide an overview of the Asset Management System.

Typical responsibilities include:

Dashboard
├── Summary information
├── Asset information
├── Assignment information
├── User/employee information
└── Navigation to AMS modules

The Dashboard is a frontend page.

When dashboard statistics are loaded from the server, the page
communicates with the corresponding backend API through the API service
layer.

14. Assets Page

The Assets module provides the interface for managing organization
assets.

The frontend is responsible for:

Displaying asset records.

Showing asset information in tables/cards.

Providing asset forms.

Editing asset information.

Providing asset-related actions.

Connecting asset operations to backend APIs.

Conceptual flow:

Assets Page
     ↓
Asset API Service
     ↓
Express Asset Routes
     ↓
Asset Controller
     ↓
Database

The frontend does not communicate directly with MySQL.

15. Employees Page

The Employees module provides the UI for employee-related information.

Conceptual flow:

Employees Page
     ↓
Employee API Service
     ↓
Express API
     ↓
Employee Controller
     ↓
MySQL

The page can use reusable components such as:

Employee Table
Employee Form
Edit Modal
Delete Confirmation

16. Asset Assignment Page

The assignment module is used to manage the relationship between an
asset and an employee.

Conceptually:

Asset
   ↓
Assignment
   ↓
Employee

Frontend flow:

Assignment Page
      ↓
Assignment API
      ↓
Express
      ↓
Assignment Controller
      ↓
MySQL

The UI can provide operations such as:

Assign Asset
View Assignment
Return Asset
View Assignment History

17. Audit Logs Page

The Audit Logs module provides a record of important actions performed
in the system.

Conceptual frontend flow:

Audit Logs Page
      ↓
Audit Log API
      ↓
Express
      ↓
Audit Log Controller
      ↓
MySQL

The frontend displays audit records in a readable table/list.

Typical information can include:

User
Action
Module
Record
Date/Time

The purpose is to make system activity traceable.

18. Reusable React Components

Instead of writing the same UI repeatedly, common elements are
implemented as reusable components.

Examples:

Navbar
Sidebar
Button
Input
Modal
Table
Form
Card
Loader
Error Message
Confirmation Dialog

Example:

<Button>
  Add Asset
</Button>

The component can be reused:

<Button>
  Add User
</Button>

<Button>
  Add Employee
</Button>

<Button>
  Add Asset
</Button>

19. children in Components

React's children prop is useful for reusable layout and UI components.

Example:

function Card({ children }) {
  return (
    <div className="rounded-lg shadow p-4">
      {children}
    </div>
  );
}

Usage:

<Card>
  <h2>Asset Details</h2>
  <p>MacBook Air M3</p>
</Card>

Everything inside <Card>...</Card> becomes children.

This allows the same component to display different content.

20. Tailwind CSS

Tailwind CSS is used for styling the frontend.

Instead of writing separate CSS for every element:

.card {
  padding: 20px;
}

Tailwind utilities can be used directly:

<div className="p-5 rounded-lg shadow">

Examples used in the frontend include:

flex
flex-1
grid
gap-4
p-4
m-4
w-full
h-6
text-sm
rounded
shadow

flex-1

className="flex-1"

means the element can grow and take the available remaining space inside
a flex container.

21. Responsive Layout

The frontend uses responsive Tailwind utilities so that the application
can adapt to different screen sizes.

A common layout is:

┌─────────────────────────────────────┐
│              Header                 │
├────────────┬────────────────────────┤
│            │                        │
│  Sidebar   │       Main Content     │
│            │                        │
│            │                        │
└────────────┴────────────────────────┘

On smaller screens, the sidebar/navigation can be converted into a
mobile menu.

The hamburger icon used for this is an SVG:

<svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-6 w-6"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth="2"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M4 6h16M4 12h16M4 18h16"
  />
</svg>

This SVG draws the three horizontal lines used for the menu button.

22. Frontend → Backend Request Pattern

The general pattern used throughout the AMS is:

React Component
       ↓
Event / useEffect
       ↓
API Service
       ↓
Axios
       ↓
HTTP Request
       ↓
Express Route
       ↓
Controller
       ↓
Service / Repository
       ↓
MySQL
       ↓
JSON Response
       ↓
React State
       ↓
UI Update

Example:

const loadUsers = async () => {
  const response = await api.get("/api/users");
  setUsers(response.data);
};

The important point is:

setUsers()

updates React state, which causes the UI to display the new data.

23. GET, POST, PUT and DELETE

The frontend uses HTTP methods according to the operation.

GET

Used to retrieve data:

GET /api/users

POST

Used to create data:

POST /api/users

PUT

Used to update data:

PUT /api/users/:id

DELETE

Used to remove data:

DELETE /api/users/:id

24. useState

useState is used when a component needs to store changing data.

Example:

const [users, setUsers] = useState([]);

Initially:

users = []

After an API request:

users = [user1, user2, user3]

React then re-renders the component and displays the updated data.

25. useEffect

useEffect is useful when a page needs to perform an operation after
rendering, such as loading data from the backend.

Example:

useEffect(() => {
  loadUsers();
}, []);

This commonly produces:

Page loads
   ↓
useEffect()
   ↓
API request
   ↓
Backend
   ↓
Response
   ↓
setUsers()
   ↓
UI updates

26. Error and Loading Handling

Backend requests should have three basic states:

Loading
Success
Error

Example:

Loading...
     ↓
API request
     ↓
 ┌───────────────┐
 │               │
Success         Error
 │               │
 ↓               ↓
Show data       Show error

This prevents the UI from appearing broken while a request is being
processed.

27. Frontend and Backend Separation

The AMS follows an important separation:

Frontend

Responsible for:

UI
UX
Navigation
Forms
Validation
State
API calls
Displaying responses

Backend

Responsible for:

Authentication
Authorization
Business logic
Database operations
Validation
SQL queries
API responses

Database

Responsible for:

Persistent data storage
Relationships
Queries
Constraints

28. What the Frontend Does NOT Do

The frontend does not:

❌ Connect directly to MySQL
❌ Execute SQL queries
❌ Store database credentials
❌ Perform database authentication
❌ Replace backend authorization

Instead:

React
 ↓
REST API
 ↓
Express
 ↓
MySQL

29. Complete Page-to-Backend Overview

Frontend Module         Purpose                 Backend Connection

Login                   Authenticate user       POST /api/auth/login

Dashboard               System overview         API service when server data is
required

Users                   Manage users            GET/POST/PUT/DELETE /api/users

Employees               Manage employees        Employee API through API service

Assets                  Manage assets           Asset API through API service

Assignments             Assign/return assets    Assignment API through API service

Audit Logs              View system activity    Audit-log API through API service

The verified endpoint mapping currently documented from the backend
work is the authentication API and Users API. Other module mappings
should use the exact endpoint names already present in the backend
implementation rather than inventing endpoint names.

30. Development Flow

To run the frontend:

npm install
npm run dev

Vite starts the React development server.

The frontend then communicates with the backend API according to the
configured API base URL.

Typical development setup:

Frontend
React + Vite
     │
     │ HTTP
     ▼
Backend
Node + Express
     │
     │ SQL
     ▼
MySQL

31. Final Frontend Architecture

                         AMS FRONTEND
                              │
                              ▼
                       React + Vite
                              │
               ┌──────────────┴──────────────┐
               │                             │
          React Router                 Components
               │                             │
               ▼                             ▼
             Pages                    Reusable UI
               │
               ▼
         API / Services
               │
             Axios
               │
               ▼
       ───── REST API ─────
               │
               ▼
        Node.js + Express
               │
       ┌───────┴────────┐
       │                │
 Controllers       Middleware
       │                │
       └───────┬────────┘
               ▼
        Services / Repository
               │
               ▼
             MySQL

Core principle

The AMS frontend follows this responsibility chain:

USER
 ↓
REACT PAGE
 ↓
REACT COMPONENT
 ↓
API SERVICE
 ↓
AXIOS
 ↓
EXPRESS REST API
 ↓
CONTROLLER
 ↓
SERVICE / REPOSITORY
 ↓
MYSQL

This separation makes the project easier to maintain because the UI,
API communication, business logic, and database operations are kept in
separate layers.