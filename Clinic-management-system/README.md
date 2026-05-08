# ClinicOS - The Admin-Gated Clinic Management System

ClinicOS is a full-stack MERN application designed to digitize and govern the patient journey in private clinics. It features strict Role-Based Access Control (RBAC) ensuring that all appointment bookings and medical record updates pass through an Administrative approval workflow.

## Features Built
- **Patient Portal:** Register, login, browse doctors, book appointments, and view appointment status.
- **Doctor Pipeline:** View scheduled and pending appointments, accept/reject requests, complete consultations, and issue digital prescriptions.
- **Admin Governance:** A centralized queue to approve or reject appointment requests and data update requests.
- **Medical Records & Prescriptions:** Secure storage of patient history and digital prescription generation.
- **Audit Logging:** Every system action is immutably logged for compliance and oversight.

---

## Prerequisites
Before launching ClinicOS, ensure you have the following installed on your machine:
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** (running locally or a MongoDB Atlas connection string)

---

## Launch Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Check the environment variables. A `.env` file has already been created for you at `backend/.env` with default values:

4. Seed the database. This is a crucial step to create the initial Admin, Doctor, and Patient accounts so you can test the workflows immediately:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

### 2. Frontend Setup
1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will open in your browser, typically at `http://localhost:5173`.*

---

## Testing the Workflows


1. **Admin Account (`admin@clinicos.com`):** Log in here to view the Admin Overview dashboard and the Approval Queue. Nothing happens in the system without this role's approval.
2. **Doctor Account (`doctor@clinicos.com`):** Log in to view the Appointment Pipeline, accept/reject admin-approved appointments, complete consultations, and issue prescriptions.
3. **Patient Account (`patient@clinicos.com`):** Log in to discover doctors, book appointments, and track your booking status.

### The "Governance Moat" Flow
To see the core philosophy in action:
1. Log in as the **Patient**, go to "Find a Doctor", and book an appointment with Dr. Sarah Connor.
2. Log out, then log in as the **Admin**. Go to the "Admin Panel" (Approval Workflows) and **Approve** the pending appointment request.
3. Log out, then log in as the **Doctor**. Go to your "Appointment Pipeline", find the approved request, and click **Accept**.
4. The appointment is now Scheduled. As the doctor, you can later mark it as "Completed" and issue a digital prescription.
