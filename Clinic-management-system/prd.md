# Product Requirements Document (PRD)
# ClinicOS — Clinic Management System

**Version:** 1.0.0  
**Status:** Draft  
**Author:** Product Team  
**Last Updated:** 2026-04-20  
**Classification:** Internal — Engineering & Design

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Scope & Out of Scope](#2-scope--out-of-scope)
3. [User Personas](#3-user-personas)
4. [User Stories](#4-user-stories)
5. [Feature List & Priority](#5-feature-list--priority)
6. [Screen-by-Screen Flow](#6-screen-by-screen-flow)
7. [Success Metrics](#7-success-metrics)
8. [Constraints & Assumptions](#8-constraints--assumptions)
9. [Appendix](#9-appendix)

---

## 1. Product Overview

### 1.1 Product Name
**ClinicOS** — A full-stack, multi-role clinic management system.

### 1.2 Purpose
ClinicOS is a web-based platform that digitizes and centralizes all clinic operations including patient registration, appointment booking, doctor scheduling, medical record management, prescription generation, and administrative approval workflows.

### 1.3 Problem Statement
Clinics operating on manual or fragmented systems face:
- Scheduling conflicts and double-bookings
- No centralized patient medical history
- Delayed administrative approvals causing bottlenecks
- No structured prescription or record trail
- Poor patient experience due to lack of transparency into doctor availability and fees

### 1.4 Proposed Solution
A three-role (Patient, Doctor, Admin) digital platform that:
- Lets patients discover, filter, and book appointments
- Lets doctors manage schedules, review patient history, and issue prescriptions
- Lets admins govern the entire ecosystem via an approval-gated workflow
- Centralizes all medical records in a secure, auditable database

### 1.5 Target Users
| Role | Description |
|------|-------------|
| Patient | Individual seeking medical consultation at the clinic |
| Doctor | Licensed medical professional registered with the clinic |
| Admin | Clinic operations staff with full system oversight |

### 1.6 Platforms
- Web (desktop-first, responsive)
- Mobile-responsive web (Phase 1)
- Native Mobile App (Phase 2 — out of scope for v1)

---

## 2. Scope & Out of Scope

### 2.1 In Scope (v1.0)

| # | Feature Area |
|---|-------------|
| 1 | Patient registration, login, profile management |
| 2 | Doctor discovery, filtering, and profile viewing |
| 3 | Appointment booking, management, and cancellation |
| 4 | Doctor schedule and fee management |
| 5 | Admin approval workflows for appointments and data changes |
| 6 | Prescription creation by doctors |
| 7 | Medical records and patient history management |
| 8 | Admin panel for user (doctor/patient) management |
| 9 | Notification system (email + in-app) |
| 10 | Doctor appointment pipeline (Kanban-style) |
| 11 | Feedback and rating system |
| 12 | Audit log for all critical actions |
| 13 | Role-based access control (RBAC) |
| 14 | Waitlist management |
| 15 | Invoice and billing per appointment |
| 16 | Lab results and document upload |
| 17 | Referral system between doctors |
| 18 | Reporting and analytics dashboard (Admin) |

### 2.2 Out of Scope (v1.0)

| # | Feature | Reason |
|---|---------|--------|
| 1 | Native mobile app (iOS/Android) | Phase 2 |
| 2 | Telemedicine / video consultation | Phase 2 |
| 3 | Insurance claims management | Phase 2 |
| 4 | Pharmacy inventory management | Phase 2 |
| 5 | Multi-clinic / multi-branch support | Phase 2 |
| 6 | AI-powered diagnosis assistance | Phase 3 |
| 7 | Third-party EHR/EMR integration | Phase 3 |
| 8 | Online payment gateway | Phase 2 |

---

## 3. User Personas

### 3.1 Persona: Patient — "Aisha"

| Field | Detail |
|-------|--------|
| Name | Aisha Rehman |
| Age | 34 |
| Occupation | Working professional |
| Tech proficiency | Medium |
| Goals | Book appointments quickly, find the right doctor, access her medical records easily |
| Pain points | Long queues, not knowing doctor availability, losing paper prescriptions |
| Quote | *"I just want to know which doctor is available today and what it will cost me."* |

### 3.2 Persona: Doctor — "Dr. Kamran"

| Field | Detail |
|-------|--------|
| Name | Dr. Kamran Siddiqui |
| Age | 45 |
| Specialty | General Physician |
| Tech proficiency | Low-Medium |
| Goals | See upcoming appointments, review patient history, issue prescriptions, manage his weekly schedule |
| Pain points | Disorganized paper records, no visibility into who is coming next, last-minute no-shows |
| Quote | *"I need to know who my next patient is and what their history looks like before they walk in."* |

### 3.3 Persona: Admin — "Sara"

| Field | Detail |
|-------|--------|
| Name | Sara Malik |
| Age | 30 |
| Role | Clinic Operations Manager |
| Tech proficiency | Medium-High |
| Goals | Approve/reject workflows, manage all user accounts, generate reports, ensure data integrity |
| Pain points | No single dashboard for oversight, doctors updating records without authorization, billing disputes |
| Quote | *"Nothing in this system should happen without my knowing about it."* |

---

## 4. User Stories

### 4.1 Patient Stories

| ID | As a patient, I want to... | So that... | Priority |
|----|---------------------------|------------|----------|
| P-01 | Register an account with my name, contact, and basic medical info | I can be identified in the system | P0 |
| P-02 | Log in securely with email and password | Only I can access my account | P0 |
| P-03 | Browse a list of all available doctors | I can choose who to see | P0 |
| P-04 | Filter doctors by specialty, gender, and availability | I find the right match quickly | P0 |
| P-05 | Filter doctors by consultation fee range | I book within my budget | P0 |
| P-06 | View a doctor's full profile (bio, credentials, schedule, fee) | I make an informed decision | P0 |
| P-07 | Search for available slots on a specific date | I book when it suits me | P0 |
| P-08 | Book an appointment with a selected doctor for a specific slot | I confirm my visit | P0 |
| P-09 | Receive a booking confirmation notification | I know my booking was received | P0 |
| P-10 | View the status of my appointment (Pending/Approved/Rejected) | I know what to expect | P0 |
| P-11 | Cancel an appointment before it occurs | I can free my slot | P1 |
| P-12 | Join a waitlist if no slots are available | I get the next available slot | P1 |
| P-13 | View my past appointments and prescriptions | I have a record of my health | P1 |
| P-14 | Download or print my prescription | I can show it to a pharmacy | P1 |
| P-15 | Upload lab reports or documents to my profile | My doctor can review them | P1 |
| P-16 | Submit a rating and written review for a doctor after an appointment | Others can benefit from my experience | P2 |
| P-17 | Receive reminder notifications 24 hours before my appointment | I don't forget my visit | P1 |
| P-18 | Update my personal and emergency contact information | My records stay current | P1 |

### 4.2 Doctor Stories

| ID | As a doctor, I want to... | So that... | Priority |
|----|--------------------------|------------|----------|
| D-01 | Log in to my doctor account | I access my workspace | P0 |
| D-02 | Define my weekly availability schedule | Patients can only book my open slots | P0 |
| D-03 | Set my consultation fee | Patients know the cost upfront | P0 |
| D-04 | View a pipeline of all appointment requests | I have full visibility | P0 |
| D-05 | Accept or reject appointment requests | I control who I see | P0 |
| D-06 | View a patient's medical history before the appointment | I am prepared for the consultation | P0 |
| D-07 | Create and save a prescription for a patient after consultation | Patients have a formal record | P0 |
| D-08 | Add clinical notes to a patient's record after a visit | The record is updated | P0 |
| D-09 | Submit a request to update a patient's data | Changes are auditable and approved | P0 |
| D-10 | View the status of my data update request | I know if Admin approved it | P1 |
| D-11 | Mark an appointment as completed | My pipeline stays clean | P0 |
| D-12 | View my past appointments and their outcomes | I track my practice | P1 |
| D-13 | Refer a patient to another doctor in the system | I coordinate care | P1 |
| D-14 | Block specific dates or time slots | I manage my unavailability | P1 |
| D-15 | View my ratings and patient feedback | I improve my service | P2 |

### 4.3 Admin Stories

| ID | As an admin, I want to... | So that... | Priority |
|----|--------------------------|------------|----------|
| A-01 | Log in to the admin panel | I access all controls | P0 |
| A-02 | View all registered patients with their profiles | I have full patient oversight | P0 |
| A-03 | View all registered doctors with their profiles | I manage the doctor roster | P0 |
| A-04 | Approve or reject new appointment requests before they are confirmed | No unvetted appointment is confirmed | P0 |
| A-05 | Approve or reject doctor requests to update patient data | No unauthorized data change occurs | P0 |
| A-06 | Add, edit, or deactivate doctor accounts | I control the practitioner roster | P0 |
| A-07 | Add, edit, or deactivate patient accounts | I manage the patient base | P0 |
| A-08 | View a complete audit log of all system actions | I can trace any event | P0 |
| A-09 | Generate reports on appointments, revenue, and patient activity | I can make data-driven decisions | P1 |
| A-10 | Manage doctor specialties and categories | The system catalog stays accurate | P1 |
| A-11 | Send system-wide or targeted notifications | I communicate clinic-wide updates | P1 |
| A-12 | View pending approval queue in a prioritized dashboard | I never miss a pending action | P0 |
| A-13 | Export patient or appointment data | I fulfill compliance and reporting needs | P1 |
| A-14 | Configure system settings (clinic hours, policy text, fees cap) | I control platform behavior | P1 |

---

## 5. Feature List & Priority

Priority Legend: **P0** = Must Have (MVP), **P1** = Should Have, **P2** = Nice to Have

### 5.1 Authentication & Authorization Module
| ID | Feature | Priority |
|----|---------|----------|
| F-AUTH-01 | Email/password registration for patients | P0 |
| F-AUTH-02 | Secure login with JWT tokens | P0 |
| F-AUTH-03 | Role-based access control (Patient / Doctor / Admin) | P0 |
| F-AUTH-04 | Password reset via email OTP | P0 |
| F-AUTH-05 | Session management and auto-logout on inactivity | P1 |
| F-AUTH-06 | Two-factor authentication (2FA) for Admin accounts | P1 |

### 5.2 Patient Module
| ID | Feature | Priority |
|----|---------|----------|
| F-PAT-01 | Patient registration form (personal, contact, medical baseline info) | P0 |
| F-PAT-02 | Patient profile management (edit personal info, emergency contact) | P1 |
| F-PAT-03 | Upload lab reports and medical documents | P1 |
| F-PAT-04 | View own appointment history | P0 |
| F-PAT-05 | View and download prescriptions | P1 |
| F-PAT-06 | Cancel an upcoming appointment | P1 |
| F-PAT-07 | Join a waitlist for a fully-booked doctor | P1 |
| F-PAT-08 | Submit doctor review and star rating | P2 |
| F-PAT-09 | Receive appointment status notifications (email + in-app) | P0 |
| F-PAT-10 | Receive appointment reminders (24h before) | P1 |

### 5.3 Doctor Discovery & Filtering Module
| ID | Feature | Priority |
|----|---------|----------|
| F-DISC-01 | Browse paginated list of all active doctors | P0 |
| F-DISC-02 | Filter by specialty/category | P0 |
| F-DISC-03 | Filter by gender | P0 |
| F-DISC-04 | Filter by availability status (available today / this week) | P0 |
| F-DISC-05 | Filter by consultation fee range (min/max slider) | P0 |
| F-DISC-06 | Search available slots by custom date picker | P0 |
| F-DISC-07 | View doctor public profile (bio, credentials, specialties, fee, reviews) | P0 |
| F-DISC-08 | Sort doctors by rating, fee (low-high), or experience | P1 |

### 5.4 Appointment Module
| ID | Feature | Priority |
|----|---------|----------|
| F-APT-01 | Patient selects a date + time slot and submits booking | P0 |
| F-APT-02 | Appointment enters "Pending Admin Approval" state immediately | P0 |
| F-APT-03 | Admin approves/rejects appointment → status updates | P0 |
| F-APT-04 | Once admin-approved, doctor receives appointment in their pipeline | P0 |
| F-APT-05 | Doctor accepts or rejects the approved appointment | P0 |
| F-APT-06 | Patient is notified of every status change | P0 |
| F-APT-07 | Doctor can mark appointment as "Completed" after consultation | P0 |
| F-APT-08 | Patient can cancel appointment (triggers slot release and notification) | P1 |
| F-APT-09 | Doctor can reschedule with patient consent | P1 |
| F-APT-10 | Waitlist auto-notifies next patient when slot opens | P1 |
| F-APT-11 | Appointment detail page (patient info, reason for visit, history summary) | P0 |

### 5.5 Doctor Schedule & Availability Module
| ID | Feature | Priority |
|----|---------|----------|
| F-SCH-01 | Doctor sets recurring weekly availability (day + time blocks) | P0 |
| F-SCH-02 | Doctor sets consultation fee (per slot) | P0 |
| F-SCH-03 | Doctor can block specific dates (leave, emergencies) | P1 |
| F-SCH-04 | System auto-computes available slots based on schedule | P0 |
| F-SCH-05 | Booked slots are hidden from the booking calendar | P0 |
| F-SCH-06 | Doctor can view full weekly/monthly calendar of appointments | P1 |

### 5.6 Medical Records Module
| ID | Feature | Priority |
|----|---------|----------|
| F-REC-01 | Patient profile stores structured medical history (allergies, chronic conditions, past diagnoses) | P0 |
| F-REC-02 | Doctor can view a patient's full history before an appointment | P0 |
| F-REC-03 | Doctor can add clinical notes to a patient record (post-appointment) | P0 |
| F-REC-04 | All record updates by doctors are queued for Admin approval | P0 |
| F-REC-05 | Admin approves/rejects data update requests with reason | P0 |
| F-REC-06 | Approved updates are applied to the patient record and timestamped | P0 |
| F-REC-07 | Full version history of patient record changes (audit trail) | P1 |
| F-REC-08 | Patient can upload documents to their own record | P1 |

### 5.7 Prescription Module
| ID | Feature | Priority |
|----|---------|----------|
| F-PRESC-01 | Doctor creates a digital prescription (medication name, dosage, frequency, duration, notes) | P0 |
| F-PRESC-02 | Prescription is linked to the appointment and patient record | P0 |
| F-PRESC-03 | Patient can view and download prescription as PDF | P1 |
| F-PRESC-04 | Prescription history visible in both doctor and patient dashboards | P1 |

### 5.8 Admin Panel Module
| ID | Feature | Priority |
|----|---------|----------|
| F-ADM-01 | Admin dashboard with KPIs (total patients, appointments today, pending approvals) | P0 |
| F-ADM-02 | Approval queue with priority sorting (oldest first) | P0 |
| F-ADM-03 | Patient management (view, edit, activate/deactivate) | P0 |
| F-ADM-04 | Doctor management (view, edit, activate/deactivate, set specialty) | P0 |
| F-ADM-05 | View full audit log (filterable by user, action type, date) | P0 |
| F-ADM-06 | Generate and export reports (appointments, revenue, patient activity) | P1 |
| F-ADM-07 | Manage specialty/category catalog | P1 |
| F-ADM-08 | Send notifications (broadcast or targeted) | P1 |
| F-ADM-09 | System configuration (clinic info, hours, policy) | P1 |

### 5.9 Notifications Module
| ID | Feature | Priority |
|----|---------|----------|
| F-NOTIF-01 | In-app notification bell with unread count | P0 |
| F-NOTIF-02 | Email notification on appointment booking confirmation | P0 |
| F-NOTIF-03 | Email + in-app notification on appointment status change | P0 |
| F-NOTIF-04 | Automated reminder 24h before appointment (email + in-app) | P1 |
| F-NOTIF-05 | Notification to doctor when new appointment enters their pipeline | P0 |
| F-NOTIF-06 | Notification to admin on new pending approval items | P0 |
| F-NOTIF-07 | Notification to patient on doctor data update approval result | P1 |

### 5.10 Billing & Invoice Module
| ID | Feature | Priority |
|----|---------|----------|
| F-BILL-01 | System auto-generates an invoice per confirmed appointment | P1 |
| F-BILL-02 | Invoice includes doctor name, specialty, date, fee, and patient info | P1 |
| F-BILL-03 | Patient can view and download invoice as PDF | P1 |
| F-BILL-04 | Admin can view all invoices and revenue summary | P1 |

### 5.11 Referral Module
| ID | Feature | Priority |
|----|---------|----------|
| F-REF-01 | Doctor can refer a patient to another doctor in the system | P1 |
| F-REF-02 | Referral creates a pre-filled appointment request for the referred doctor | P1 |
| F-REF-03 | Patient is notified of the referral | P1 |
| F-REF-04 | Referred-to doctor can view the original doctor's referral notes | P1 |

### 5.12 Feedback & Ratings Module
| ID | Feature | Priority |
|----|---------|----------|
| F-RATE-01 | Patient can rate doctor (1-5 stars) after a completed appointment | P2 |
| F-RATE-02 | Patient can submit a written review | P2 |
| F-RATE-03 | Reviews are visible on the doctor's public profile | P2 |
| F-RATE-04 | Admin can moderate (hide/remove) inappropriate reviews | P2 |

---

## 6. Screen-by-Screen Flow

### 6.1 Patient Flow

```
[Landing Page / Login]
    │
    ├── [Register] → Fill form → Submit → Admin approves account → [Email Confirmation]
    │
    └── [Login] → [Patient Dashboard]
                        │
                        ├── [Browse Doctors]
                        │       ├── Apply Filters (specialty, gender, fee range, date, availability)
                        │       ├── Select Doctor
                        │       └── [Doctor Profile Page]
                        │               ├── View bio, credentials, fee, schedule
                        │               └── [Book Appointment]
                        │                       ├── Select available date + slot
                        │                       ├── Enter reason for visit
                        │                       └── Submit → Status: "Pending Admin Approval"
                        │
                        ├── [My Appointments]
                        │       ├── View list (status: Pending / Approved / Rejected / Completed)
                        │       ├── Cancel appointment
                        │       └── View appointment detail
                        │
                        ├── [My Medical Records]
                        │       ├── View medical history
                        │       ├── View prescriptions
                        │       └── Upload documents
                        │
                        └── [Profile Settings]
                                └── Edit personal info, emergency contact, password
```

### 6.2 Doctor Flow

```
[Login] → [Doctor Dashboard]
                │
                ├── [Appointment Pipeline]
                │       ├── View cards by status (Pending Doctor Action / Accepted / Rejected / Completed)
                │       ├── Accept appointment → Appears in calendar
                │       ├── Reject appointment → Patient notified
                │       └── View appointment detail
                │               ├── View patient profile & history
                │               ├── Add clinical notes
                │               ├── Create prescription
                │               ├── Submit data update request (→ Admin approval queue)
                │               └── Mark as Completed
                │
                ├── [My Schedule]
                │       ├── Set/edit weekly availability
                │       ├── Set consultation fee
                │       └── Block dates
                │
                ├── [My Patients]
                │       ├── View all patients seen
                │       └── View individual patient history + documents
                │
                └── [Referrals]
                        └── Refer patient to another doctor
```

### 6.3 Admin Flow

```
[Login] → [Admin Dashboard]
                │
                ├── [Approval Queue] ← (Priority View)
                │       ├── Pending Appointments → Approve / Reject
                │       └── Pending Data Updates → Approve / Reject
                │
                ├── [Doctor Management]
                │       ├── List all doctors
                │       ├── View / Edit doctor profile
                │       ├── Activate / Deactivate account
                │       └── Add new doctor
                │
                ├── [Patient Management]
                │       ├── List all patients
                │       ├── View full patient profile and records
                │       ├── Edit patient data
                │       └── Activate / Deactivate account
                │
                ├── [Reports & Analytics]
                │       ├── Appointment volume chart
                │       ├── Revenue summary
                │       ├── Doctor performance metrics
                │       └── Export CSV / PDF
                │
                ├── [Audit Log]
                │       ├── All system events (timestamped, user-tagged)
                │       └── Filter by user, action, date range
                │
                └── [System Settings]
                        ├── Clinic profile info
                        ├── Manage specialties catalog
                        └── Notification templates
```

### 6.4 Appointment State Machine

```
[Patient Submits Booking]
        │
        ▼
[PENDING_ADMIN_APPROVAL]
        │
   ┌────┴────┐
   ▼         ▼
[ADMIN      [ADMIN
 APPROVED]   REJECTED] → Patient notified → END
   │
   ▼
[PENDING_DOCTOR_ACTION]
   │
   ├──────────────────┐
   ▼                  ▼
[DOCTOR           [DOCTOR
 ACCEPTED]         REJECTED] → Patient notified → END
   │
   ▼
[SCHEDULED] ──→ (reminder sent 24h before)
   │
   ▼
[COMPLETED] ──→ Prescription created + Invoice generated
   │
   └── OR [CANCELLED by Patient] → Slot released → Waitlist notified
```

---

## 7. Success Metrics

### 7.1 Adoption Metrics
| Metric | Target (End of Month 3) |
|--------|-------------------------|
| Registered patients | ≥ 200 |
| Active doctors onboarded | ≥ 10 |
| Appointments booked via system | ≥ 500 |
| Patient return visits (repeat bookings) | ≥ 40% |

### 7.2 Operational Metrics
| Metric | Target |
|--------|--------|
| Admin approval turnaround time | < 2 hours during clinic hours |
| Appointment no-show rate | < 10% (benchmark: industry ~20%) |
| Doctor pipeline management time saved | ≥ 30% vs. manual |
| Data update request approval time | < 4 hours |

### 7.3 Quality Metrics
| Metric | Target |
|--------|--------|
| Patient satisfaction score (post-visit rating) | ≥ 4.2 / 5 |
| System uptime | ≥ 99.5% |
| Critical bug reports per sprint | 0 P0 bugs in production |
| Prescription accuracy (doctor-reported) | 100% |

### 7.4 Security Metrics
| Metric | Target |
|--------|--------|
| Unauthorized data access incidents | 0 |
| Audit log coverage of all write actions | 100% |
| Password reset abuse flags | Monitored weekly |

---

## 8. Constraints & Assumptions

### 8.1 Constraints

| # | Constraint |
|---|-----------|
| C-01 | The system must be deployed as a web application accessible on modern browsers (Chrome, Firefox, Safari, Edge). |
| C-02 | All patient medical data must be stored in an encrypted database. |
| C-03 | No appointment can transition to "Approved" state without explicit Admin action. |
| C-04 | No patient record can be modified by a doctor without explicit Admin approval. |
| C-05 | All data must remain within the clinic's designated server/cloud region (data residency). |
| C-06 | The system must handle concurrent users without performance degradation (min. 100 concurrent users in v1). |
| C-07 | The system must be fully functional offline for read operations with a cached state (future consideration). |
| C-08 | Prescription PDFs must be generated server-side and signed with a clinic watermark. |

### 8.2 Assumptions

| # | Assumption |
|---|-----------|
| A-01 | Each clinic operates from a single location (multi-branch is Phase 2). |
| A-02 | All payments are handled offline/in-person. No online payment gateway in v1. |
| A-03 | All doctors are pre-vetted and added to the system by Admin only (doctors do not self-register). |
| A-04 | Each appointment is a one-on-one consultation (no group sessions). |
| A-05 | Clinic operating hours are configured once by Admin and apply to all doctors unless overridden by individual schedules. |
| A-06 | One patient account per person (no proxy bookings for family members in v1). |
| A-07 | The Admin role is performed by a dedicated staff member available during clinic operating hours. |
| A-08 | Internet connectivity is available at the clinic for all staff and doctors. |
| A-09 | Email is the primary notification channel; SMS is Phase 2. |

---

## 9. Appendix

### 9.1 Glossary

| Term | Definition |
|------|-----------|
| Appointment Pipeline | The Kanban-style view showing all appointments in different states for a doctor |
| Approval Queue | The admin-side list of all items awaiting Admin action (appointments, data updates) |
| Data Update Request | A formal request submitted by a doctor to modify a patient's medical record, which must be approved by Admin |
| Slot | A single available time block in a doctor's schedule (e.g., 10:00–10:30 AM) |
| Prescription | A digitally generated document by a doctor listing medications, dosages, and instructions |
| Waitlist | A queue of patients interested in a fully-booked appointment slot |
| Audit Log | An immutable, timestamped record of all create/update/delete actions in the system |
| RBAC | Role-Based Access Control — the permission model governing what each role can see and do |
| Clinical Notes | Free-text observations recorded by a doctor about a patient during or after a consultation |

### 9.2 Atomic Polished Functionality List (Master Reference)

> This is the canonical, de-duplicated list of all system functionalities.

**Authentication & Access**
- FUNC-001: A patient can register using their email, password, full name, date of birth, gender, contact number, and blood group.
- FUNC-002: A registered user (patient, doctor, admin) can log in using email and password.
- FUNC-003: A logged-in user can reset their password via a time-limited OTP sent to their registered email.
- FUNC-004: The system enforces role-based access control; a patient cannot access doctor or admin views, and vice versa.
- FUNC-005: An admin account requires 2FA to log in.
- FUNC-006: The system auto-logs out any session inactive for more than 30 minutes.

**Patient — Doctor Discovery**
- FUNC-007: A patient can browse a paginated list of all active doctors registered in the system.
- FUNC-008: A patient can filter the doctor list by medical specialty/category (e.g., Dentist, General Physician, Cardiologist).
- FUNC-009: A patient can filter the doctor list by gender (Male / Female / Any).
- FUNC-010: A patient can filter the doctor list by availability status (Available Today / This Week / Any).
- FUNC-011: A patient can filter the doctor list by a custom date to see which doctors have available slots on that date.
- FUNC-012: A patient can filter the doctor list by consultation fee range using a minimum and maximum fee input.
- FUNC-013: A patient can view a doctor's public profile containing their photo, specialty, credentials, years of experience, consultation fee, available days/times, and aggregate rating.

**Patient — Appointment Booking**
- FUNC-014: A patient can select an available date and time slot from a doctor's calendar and submit a booking request.
- FUNC-015: A patient must provide a reason for the visit when submitting a booking request.
- FUNC-016: Upon submission, the appointment is created in the "Pending Admin Approval" state; no slot is confirmed until Admin acts.
- FUNC-017: A patient receives an in-app and email notification confirming that their booking request was received.
- FUNC-018: A patient receives an in-app and email notification when their appointment is approved or rejected by Admin.
- FUNC-019: A patient receives an in-app and email notification when their appointment is accepted or rejected by the doctor.
- FUNC-020: A patient can view all their appointments with current status (Pending / Admin Approved / Doctor Accepted / Completed / Cancelled / Rejected).
- FUNC-021: A patient can cancel an appointment that has not yet reached "Completed" status.
- FUNC-022: A patient can join a waitlist for a doctor whose slots are fully booked on a given date.
- FUNC-023: When a slot becomes available, the first patient on the waitlist is automatically notified.
- FUNC-024: A patient receives an automated reminder notification 24 hours before a confirmed appointment.

**Patient — Medical Records & Prescriptions**
- FUNC-025: A patient can view their structured medical history including allergies, chronic conditions, past diagnoses, and clinical notes.
- FUNC-026: A patient can view all prescriptions issued to them, with full details (medication, dosage, frequency, duration).
- FUNC-027: A patient can download a prescription as a PDF.
- FUNC-028: A patient can upload medical documents (lab reports, imaging results, referral letters) to their own profile.
- FUNC-029: A patient can update their personal information (contact number, address, emergency contact) from their profile settings.

**Doctor — Schedule Management**
- FUNC-030: A doctor can define their weekly recurring availability by selecting working days and time ranges.
- FUNC-031: A doctor can set the duration of each consultation slot (e.g., 15 / 20 / 30 minutes).
- FUNC-032: A doctor can set their consultation fee per slot.
- FUNC-033: A doctor can block specific dates or date ranges (holidays, leave) to make them unavailable for booking.
- FUNC-034: The system auto-generates individual bookable slots based on the doctor's availability settings and slot duration.
- FUNC-035: The system removes already-booked slots from the patient-facing booking calendar in real time.

**Doctor — Appointment Management**
- FUNC-036: A doctor can view their appointment pipeline showing all admin-approved appointments in stages: Pending Doctor Action / Accepted / Completed / Rejected.
- FUNC-037: A doctor can accept an admin-approved appointment, transitioning its state to "Scheduled."
- FUNC-038: A doctor can reject an admin-approved appointment with a mandatory reason; the patient is notified.
- FUNC-039: A doctor can view the full patient profile (demographics, medical history, prior visits, prescriptions, uploaded documents) from the appointment detail screen.
- FUNC-040: A doctor can mark an appointment as "Completed" after the consultation concludes.

**Doctor — Medical Records & Prescriptions**
- FUNC-041: A doctor can add clinical notes to a patient's record during or after an appointment (pre-approval required from Admin before notes are persisted).
- FUNC-042: A doctor can submit a formal request to update a specific field in a patient's medical record; this request is placed in the Admin approval queue.
- FUNC-043: A doctor can view the current status (Pending / Approved / Rejected) of all their submitted data update requests.
- FUNC-044: A doctor can create a prescription linked to an appointment containing: medication name, dosage, frequency, duration, and optional notes.
- FUNC-045: A doctor can view all prescriptions they have previously issued.
- FUNC-046: A doctor can refer a patient to another doctor within the system by selecting the receiving doctor and writing referral notes.

**Admin — Approval Workflows**
- FUNC-047: The Admin sees a prioritized approval queue dashboard listing all items awaiting action, sorted by submission time (oldest first).
- FUNC-048: The Admin can approve or reject any appointment request, with a mandatory comment on rejection.
- FUNC-049: On Admin approval of an appointment, the system automatically routes the appointment to the assigned doctor's pipeline.
- FUNC-050: On Admin rejection of an appointment, the patient is notified with the rejection reason.
- FUNC-051: The Admin can approve or reject any doctor-submitted patient data update request.
- FUNC-052: On approval of a data update request, the patient's record is updated and a timestamped audit entry is created.
- FUNC-053: On rejection of a data update request, the requesting doctor is notified with the rejection reason.

**Admin — User Management**
- FUNC-054: The Admin can view a searchable, filterable list of all registered patients.
- FUNC-055: The Admin can view and edit any patient's profile and medical records directly (no approval required for admin-initiated changes).
- FUNC-056: The Admin can activate or deactivate a patient account.
- FUNC-057: The Admin can view a searchable, filterable list of all registered doctors.
- FUNC-058: The Admin can create a new doctor account, setting their specialty, credentials, and initial profile.
- FUNC-059: The Admin can edit any doctor's profile.
- FUNC-060: The Admin can activate or deactivate a doctor account (deactivated doctors are hidden from patient search).
- FUNC-061: The Admin can manage the specialty/category catalog (add, edit, deactivate specialties).

**Admin — Oversight & Reporting**
- FUNC-062: The Admin can view an immutable audit log of every create, update, and delete action across the system, including user ID, action type, timestamp, and affected record.
- FUNC-063: The Admin can filter the audit log by user, action type, and date range.
- FUNC-064: The Admin can generate reports including: total appointments per period, appointments by doctor, revenue by doctor, and patient registration trends.
- FUNC-065: The Admin can export any report as a CSV or PDF file.
- FUNC-066: The Admin can send a targeted or broadcast in-app notification to selected users or user groups.

**Billing**
- FUNC-067: The system auto-generates a billing invoice when an appointment is marked "Completed."
- FUNC-068: The invoice includes: patient name, doctor name, specialty, appointment date/time, and consultation fee.
- FUNC-069: A patient can download their invoice as a PDF from their appointment history.
- FUNC-070: The Admin can view all generated invoices and a cumulative revenue dashboard.

**Feedback & Ratings**
- FUNC-071: A patient can submit a 1–5 star rating and optional written review for a doctor after an appointment is marked "Completed."
- FUNC-072: Ratings and reviews are displayed on the doctor's public profile.
- FUNC-073: The Admin can hide or permanently delete any review flagged as inappropriate.
- FUNC-074: The system calculates and displays a doctor's aggregate rating score on their profile.

### 9.3 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-04-20 | Product Team | Initial draft |
