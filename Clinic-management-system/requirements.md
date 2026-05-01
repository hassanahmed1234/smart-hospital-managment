# Functional & Non-Functional Requirements
# ClinicOS — Clinic Management System

**Version:** 1.0.0  
**Status:** Draft  
**Author:** Engineering Team  
**Last Updated:** 2026-04-20  
**Companion Document:** PRD v1.0.0

---

## Table of Contents

1. [Functional Requirements (FR)](#1-functional-requirements)
   - 1.1 Authentication & Authorization
   - 1.2 Patient Module
   - 1.3 Doctor Discovery Module
   - 1.4 Appointment Module
   - 1.5 Doctor Schedule Module
   - 1.6 Medical Records Module
   - 1.7 Prescription Module
   - 1.8 Admin Panel Module
   - 1.9 Notifications Module
   - 1.10 Billing Module
   - 1.11 Referral Module
   - 1.12 Feedback & Ratings Module

2. [Non-Functional Requirements (NFR)](#2-non-functional-requirements)
   - 2.1 Performance
   - 2.2 Security
   - 2.3 Reliability & Availability
   - 2.4 Scalability
   - 2.5 Usability
   - 2.6 Maintainability
   - 2.7 Data Integrity
   - 2.8 Compliance & Privacy
   - 2.9 Auditability

---

## 1. Functional Requirements

> **Format per requirement:**
> - **ID:** Unique identifier
> - **Title:** Short label
> - **Description:** Precise, agent-readable specification of what the system must do
> - **Precondition:** What must be true before this requirement can be executed
> - **Postcondition:** What state the system is in after successful execution
> - **Actor:** Who triggers this requirement
> - **Priority:** P0 / P1 / P2
> - **Acceptance Criteria:** Verifiable conditions that confirm the requirement is met

---

### 1.1 Authentication & Authorization

---

**FR-AUTH-001**  
**Title:** Patient Self-Registration  
**Description:** The system must allow a new user to register as a patient by submitting their full name, email address, password, date of birth, gender, phone number, and blood group. The system must validate email uniqueness before creating the account.  
**Precondition:** The user is not logged in and does not have an existing account with the same email.  
**Postcondition:** A new patient account is created with role = PATIENT. The patient receives a verification email.  
**Actor:** Patient (unauthenticated)  
**Priority:** P0  
**Acceptance Criteria:**
- Submitting a duplicate email returns a 409 error with message: "An account with this email already exists."
- All fields (full name, email, password, DOB, gender, phone, blood group) are required; blank submission returns field-specific validation errors.
- Password must be at least 8 characters, contain at least one uppercase letter, one digit, and one special character.
- A verification email is sent to the registered email within 60 seconds of successful registration.
- The account is created with status = UNVERIFIED until the email is verified.

---

**FR-AUTH-002**  
**Title:** User Login  
**Description:** The system must allow any registered user (Patient, Doctor, Admin) to authenticate using their email and password. On success, the system issues a signed JWT access token (validity: 1 hour) and a refresh token (validity: 7 days).  
**Precondition:** The user has a verified, active account.  
**Postcondition:** The user is authenticated. A JWT access token and refresh token are returned. The user is redirected to their role-specific dashboard.  
**Actor:** Patient, Doctor, Admin  
**Priority:** P0  
**Acceptance Criteria:**
- Entering an incorrect email/password combination returns a 401 error with message: "Invalid credentials."
- After 5 consecutive failed login attempts from the same IP, the account is temporarily locked for 15 minutes.
- Login with an unverified email returns a 403 error with message: "Please verify your email address."
- Login with a deactivated account returns a 403 error with message: "Your account has been deactivated. Contact your administrator."
- Successful login redirects Patient to /dashboard/patient, Doctor to /dashboard/doctor, Admin to /dashboard/admin.

---

**FR-AUTH-003**  
**Title:** Password Reset via Email OTP  
**Description:** The system must allow any user to request a password reset by entering their registered email. The system sends a 6-digit OTP to that email valid for 10 minutes. Submitting the correct OTP and a new password resets the password.  
**Precondition:** The user has a registered account with the entered email.  
**Postcondition:** The user's password is updated. All existing sessions for that user are invalidated.  
**Actor:** Patient, Doctor, Admin  
**Priority:** P0  
**Acceptance Criteria:**
- OTP expires exactly 10 minutes after generation; submitting an expired OTP returns an error: "OTP has expired. Please request a new one."
- Submitting an incorrect OTP returns: "Invalid OTP."
- Each OTP can only be used once; reuse is rejected.
- On success, the user is redirected to the login page with a success banner.
- All active sessions are terminated after a successful password reset.

---

**FR-AUTH-004**  
**Title:** Role-Based Access Control Enforcement  
**Description:** The system must enforce access control such that each route and API endpoint is accessible only by the role(s) explicitly authorized for it. Unauthorized access attempts must be rejected.  
**Precondition:** N/A (always active)  
**Postcondition:** Unauthorized requests are blocked.  
**Actor:** System (automated enforcement)  
**Priority:** P0  
**Acceptance Criteria:**
- A patient attempting to access /dashboard/doctor or /dashboard/admin receives a 403 response.
- A doctor attempting to access /dashboard/admin receives a 403 response.
- Any unauthenticated request to a protected route receives a 401 response and is redirected to /login.
- Role is determined from the JWT payload; tokens cannot be self-modified (RS256 signing).

---

**FR-AUTH-005**  
**Title:** Two-Factor Authentication for Admin  
**Description:** The system must require Admin accounts to complete a second authentication factor (TOTP-based authenticator app) upon each login, after correct email/password entry.  
**Precondition:** Admin account exists and 2FA has been set up.  
**Postcondition:** Admin is fully authenticated and directed to the admin dashboard.  
**Actor:** Admin  
**Priority:** P1  
**Acceptance Criteria:**
- Admin login flow has a second screen requesting a 6-digit TOTP code.
- Entering an incorrect TOTP returns: "Invalid authentication code."
- Admin setup flow provides a QR code for authenticator app enrollment.
- Recovery codes are provided during 2FA setup; each recovery code is single-use.

---

**FR-AUTH-006**  
**Title:** Session Auto-Expiry  
**Description:** The system must automatically terminate any session that has been inactive for more than 30 consecutive minutes, requiring re-authentication.  
**Precondition:** A user is logged in.  
**Postcondition:** Session is invalidated; user is redirected to /login with message: "Your session expired due to inactivity."  
**Actor:** System (automated)  
**Priority:** P1  
**Acceptance Criteria:**
- After 25 minutes of inactivity, a modal warns: "Your session will expire in 5 minutes."
- Any user action within the warning window resets the inactivity timer.
- After 30 total minutes of inactivity, the session is destroyed and all further API calls with the old token return 401.

---

### 1.2 Patient Module

---

**FR-PAT-001**  
**Title:** View Patient Dashboard  
**Description:** The system must display a personalized dashboard to a logged-in patient showing: upcoming appointments (max 3), recent notifications (max 5), a shortcut to book a new appointment, and a shortcut to view medical records.  
**Precondition:** Patient is authenticated.  
**Postcondition:** Dashboard is rendered with live data.  
**Actor:** Patient  
**Priority:** P0  
**Acceptance Criteria:**
- Upcoming appointments show doctor name, specialty, date, time, and current status.
- Notifications show unread count badge.
- If no upcoming appointments exist, a CTA "Book your first appointment" is displayed.

---

**FR-PAT-002**  
**Title:** Edit Patient Profile  
**Description:** A patient must be able to update their contact number, residential address, and emergency contact (name + relationship + phone). Medical baseline fields (blood group, DOB) cannot be self-edited by the patient and require a doctor update request.  
**Precondition:** Patient is authenticated.  
**Postcondition:** Updated fields are persisted. An audit log entry is created.  
**Actor:** Patient  
**Priority:** P1  
**Acceptance Criteria:**
- Phone number field validates format (10+ digits).
- Emergency contact requires all three subfields (name, relationship, phone); partial submission is rejected.
- Blood group and DOB fields are read-only in the patient profile UI.
- Successful save shows: "Profile updated successfully."

---

**FR-PAT-003**  
**Title:** Upload Medical Document  
**Description:** A patient must be able to upload medical documents (lab reports, imaging files, referral letters) to their profile. Accepted formats: PDF, JPG, PNG. Maximum file size: 10 MB per file.  
**Precondition:** Patient is authenticated.  
**Postcondition:** Document is stored in secure cloud storage. A record is created in the patient's document list with: file name, upload date, and file type.  
**Actor:** Patient  
**Priority:** P1  
**Acceptance Criteria:**
- Attempting to upload a file > 10 MB returns: "File size exceeds the 10 MB limit."
- Unsupported file types (e.g., .exe, .zip) return: "Unsupported file format."
- Uploaded documents are listed chronologically with a download icon.
- Documents are accessible to the patient and to any doctor viewing the patient's record.

---

### 1.3 Doctor Discovery Module

---

**FR-DISC-001**  
**Title:** Browse Doctor Listings  
**Description:** The system must display a paginated list of all active doctors, showing per card: photo, name, specialty, gender, consultation fee, availability indicator, and aggregate rating.  
**Precondition:** Patient is authenticated.  
**Postcondition:** Doctor list is rendered. Default sort is by availability (available first), then by rating descending.  
**Actor:** Patient  
**Priority:** P0  
**Acceptance Criteria:**
- Page size is 12 cards per page; pagination controls navigate between pages.
- Deactivated or unapproved doctor accounts do not appear in the listing.
- Each card has a "View Profile" CTA and a "Book Appointment" CTA.

---

**FR-DISC-002**  
**Title:** Filter Doctors  
**Description:** The system must allow a patient to apply one or multiple filters simultaneously to the doctor listing. Available filters: specialty (multi-select), gender (single select), availability (single select), fee range (min-max slider), and custom date (date picker).  
**Precondition:** Patient is on the doctor listing page.  
**Postcondition:** Doctor list is re-rendered showing only doctors matching all active filters.  
**Actor:** Patient  
**Priority:** P0  
**Acceptance Criteria:**
- Applying a specialty filter for "Dentist" returns only doctors with specialty = Dentist.
- Setting fee range 500–1500 returns only doctors whose consultation fee is between 500 and 1500 (inclusive).
- Setting a custom date returns only doctors who have at least one available (unbooked) slot on that date.
- Applying gender = Female returns only doctors with gender = Female.
- Clearing all filters restores the full default list.
- No results returns a state: "No doctors match your selected filters."

---

**FR-DISC-003**  
**Title:** View Doctor Public Profile  
**Description:** The system must display a detailed doctor profile page containing: full name, photo, specialty, credentials, years of experience, clinic section/room number, consultation fee, weekly availability table, aggregate rating, and all approved patient reviews.  
**Precondition:** Patient is authenticated.  
**Postcondition:** Doctor profile page is rendered.  
**Actor:** Patient  
**Priority:** P0  
**Acceptance Criteria:**
- The profile always shows only future available slots (past dates are not shown).
- Reviews are sorted by most recent first.
- If the doctor has no reviews, the section shows: "No reviews yet."

---

### 1.4 Appointment Module

---

**FR-APT-001**  
**Title:** Submit Appointment Request  
**Description:** A patient must be able to select an available slot from a doctor's calendar and submit an appointment booking request. The booking form requires: selected date, selected time slot, and reason for visit (min. 10 characters).  
**Precondition:** Patient is authenticated. The selected slot is available (not booked, not blocked). The patient does not already have a pending/scheduled appointment with the same doctor on the same date.  
**Postcondition:** An appointment record is created with status = PENDING_ADMIN_APPROVAL. The selected slot is locked (cannot be booked by another patient). Patient receives a booking submission notification.  
**Actor:** Patient  
**Priority:** P0  
**Acceptance Criteria:**
- Attempting to book an already-taken slot returns: "This slot is no longer available. Please choose another."
- Reason for visit shorter than 10 characters returns: "Please provide a more detailed reason (minimum 10 characters)."
- Duplicate booking attempt (same patient, same doctor, same date) returns: "You already have an appointment pending with this doctor on this date."
- On success, patient is redirected to My Appointments page with the new appointment showing status "Pending Admin Approval."

---

**FR-APT-002**  
**Title:** Admin Approves or Rejects Appointment  
**Description:** The Admin must be able to view all appointments in PENDING_ADMIN_APPROVAL status and act on each one. Approval transitions the appointment to PENDING_DOCTOR_ACTION. Rejection transitions it to REJECTED and releases the slot.  
**Precondition:** Admin is authenticated. At least one appointment exists with status = PENDING_ADMIN_APPROVAL.  
**Postcondition:** Appointment status is updated. Patient is notified. If approved, the doctor's pipeline is updated.  
**Actor:** Admin  
**Priority:** P0  
**Acceptance Criteria:**
- Rejection requires the Admin to enter a rejection reason (min. 5 characters); empty rejection reason is blocked.
- Approved appointment appears in the assigned doctor's pipeline within 5 seconds (real-time or near-real-time).
- Patient receives an email and in-app notification within 60 seconds of Admin action.
- Audit log records: admin user ID, appointment ID, action (APPROVED/REJECTED), reason (if rejected), timestamp.

---

**FR-APT-003**  
**Title:** Doctor Accepts or Rejects Appointment  
**Description:** A doctor must be able to view appointments in PENDING_DOCTOR_ACTION status in their pipeline and accept or reject each one. Acceptance transitions the appointment to SCHEDULED. Rejection transitions it to REJECTED_BY_DOCTOR and releases the slot.  
**Precondition:** Doctor is authenticated. Appointment status = PENDING_DOCTOR_ACTION.  
**Postcondition:** Appointment status is updated. Patient is notified.  
**Actor:** Doctor  
**Priority:** P0  
**Acceptance Criteria:**
- Rejection requires the doctor to enter a reason; empty reason is blocked.
- On acceptance, the appointment appears in the doctor's calendar view.
- Patient is notified via email and in-app within 60 seconds.
- Rejected slot is released and becomes bookable by other patients.

---

**FR-APT-004**  
**Title:** Patient Cancels Appointment  
**Description:** A patient must be able to cancel any appointment that is in PENDING_ADMIN_APPROVAL, PENDING_DOCTOR_ACTION, or SCHEDULED status. Cancellation transitions the appointment to CANCELLED_BY_PATIENT and releases the slot.  
**Precondition:** Patient is authenticated. The appointment exists and belongs to the patient. Appointment status is not COMPLETED, REJECTED, or already CANCELLED.  
**Postcondition:** Appointment status = CANCELLED_BY_PATIENT. Slot is released. Doctor and Admin are notified. First patient on waitlist (if any) is notified.  
**Actor:** Patient  
**Priority:** P1  
**Acceptance Criteria:**
- A confirmation modal is shown before cancellation: "Are you sure you want to cancel this appointment? This action cannot be undone."
- Cancellations within 1 hour of the scheduled appointment time display a warning but are still permitted in v1.
- If a waitlist exists for that slot, the first waitlisted patient receives notification: "A slot is now available with [Doctor Name] on [Date]. Book now."

---

**FR-APT-005**  
**Title:** Doctor Marks Appointment as Completed  
**Description:** A doctor must be able to mark a SCHEDULED appointment as COMPLETED after the consultation. This triggers prescription creation availability and invoice generation.  
**Precondition:** Doctor is authenticated. Appointment status = SCHEDULED. The appointment date/time has passed (or the doctor manually marks it).  
**Postcondition:** Appointment status = COMPLETED. Invoice is auto-generated. Prescription creation is unlocked for this appointment. Patient feedback prompt is sent.  
**Actor:** Doctor  
**Priority:** P0  
**Acceptance Criteria:**
- The "Mark as Completed" button is only visible when appointment status = SCHEDULED.
- On completion, a prescription creation CTA appears on the appointment detail screen.
- An invoice record is auto-generated and becomes visible to the patient in their appointment history.
- If a patient rating prompt is configured, it is sent within 1 hour of completion.

---

**FR-APT-006**  
**Title:** Waitlist Management  
**Description:** A patient must be able to join a waitlist for a specific doctor on a specific date when no slots are available. Each waitlist is per-doctor, per-date, ordered by join time (FIFO).  
**Precondition:** Patient is authenticated. All slots for the selected doctor on the selected date are booked.  
**Postcondition:** A waitlist entry is created. Patient receives confirmation that they are on the waitlist and their current position.  
**Actor:** Patient  
**Priority:** P1  
**Acceptance Criteria:**
- Patient can see their waitlist position: "You are #2 on the waitlist for Dr. X on [Date]."
- Patient can leave the waitlist at any time.
- When a slot is released, the system automatically notifies position #1 on the waitlist via email and in-app.
- If position #1 does not book within 2 hours of notification, the system notifies position #2.

---

### 1.5 Doctor Schedule Module

---

**FR-SCH-001**  
**Title:** Set Weekly Availability  
**Description:** A doctor must be able to define their recurring weekly schedule by selecting days of the week and, for each selected day, specifying a start time and end time.  
**Precondition:** Doctor is authenticated.  
**Postcondition:** The schedule is saved. The system auto-generates individual bookable slots based on the defined hours and the doctor's slot duration setting.  
**Actor:** Doctor  
**Priority:** P0  
**Acceptance Criteria:**
- Start time must be before end time; violations return: "End time must be after start time."
- A doctor can define different hours for different days (e.g., Mon 9:00–12:00, Wed 14:00–17:00).
- Changes to the schedule do not affect already-booked appointments.
- Future unbooked slots regenerate immediately after schedule update.

---

**FR-SCH-002**  
**Title:** Set Consultation Fee  
**Description:** A doctor must be able to set their per-appointment consultation fee (in the local currency unit). This fee is displayed publicly on the doctor's profile and on booking confirmation.  
**Precondition:** Doctor is authenticated.  
**Postcondition:** Fee is saved and immediately visible on the doctor's public profile.  
**Actor:** Doctor  
**Priority:** P0  
**Acceptance Criteria:**
- Fee must be a positive number greater than zero; negative or zero values are rejected.
- Admin may configure a maximum fee cap; submissions above the cap return: "Fee exceeds the maximum allowed consultation fee."
- Fee change does not retroactively alter already-confirmed appointments.

---

**FR-SCH-003**  
**Title:** Block Dates / Leave  
**Description:** A doctor must be able to select a single date or a date range and mark it as blocked. Blocked dates have no available slots and are not shown on the patient booking calendar.  
**Precondition:** Doctor is authenticated.  
**Postcondition:** Selected dates are marked as blocked. All unbooked slots on those dates are removed from the booking calendar.  
**Actor:** Doctor  
**Priority:** P1  
**Acceptance Criteria:**
- Attempting to block a date that has already-confirmed appointments shows a warning: "You have [N] confirmed appointments on this date. Blocking will not cancel them."
- Blocked dates appear on the doctor's own calendar in grey.
- Unblocking a date restores available slots immediately.

---

### 1.6 Medical Records Module

---

**FR-REC-001**  
**Title:** View Patient Medical History (Doctor)  
**Description:** A doctor must be able to view a patient's complete medical record from within an appointment detail screen. The record includes: demographics, blood group, allergies, chronic conditions, past diagnoses, clinical notes from previous visits, uploaded documents, and prescription history.  
**Precondition:** Doctor is authenticated. The doctor has an appointment (in any non-rejected status) with the patient.  
**Postcondition:** Patient record is rendered in read-only view for the doctor.  
**Actor:** Doctor  
**Priority:** P0  
**Acceptance Criteria:**
- A doctor cannot access a patient's record unless they have an active appointment with that patient.
- Clinical notes are displayed in reverse-chronological order (newest first).
- Uploaded documents are listed with download links.
- Prescription history shows all past prescriptions with issuing doctor name and date.

---

**FR-REC-002**  
**Title:** Add Clinical Notes  
**Description:** A doctor must be able to add free-text clinical notes to a patient's record from within an appointment detail screen. The note is submitted as an update request and is NOT displayed on the patient's record until Admin approves it.  
**Precondition:** Doctor is authenticated. Appointment status is SCHEDULED or COMPLETED.  
**Postcondition:** A data update request is created with type = CLINICAL_NOTE, linked to the appointment and patient. The note is held in PENDING_ADMIN_APPROVAL state. Admin receives a notification.  
**Actor:** Doctor  
**Priority:** P0  
**Acceptance Criteria:**
- Notes field is a rich text area with a minimum of 20 characters.
- A doctor can see their submitted (pending) notes labeled as "Awaiting Admin Approval" in the appointment detail view.
- On Admin approval, the note is added to the patient's record with the original submission timestamp and doctor's name.
- On Admin rejection, the doctor is notified with the rejection reason.

---

**FR-REC-003**  
**Title:** Submit Patient Data Update Request (Doctor)  
**Description:** A doctor must be able to submit a formal request to update a specific field in a patient's structured medical record (e.g., update allergy list, update chronic conditions). The request specifies: field name, current value, proposed new value, and clinical justification.  
**Precondition:** Doctor is authenticated. The patient has an active or completed appointment with the doctor.  
**Postcondition:** A data update request record is created with status = PENDING. Admin receives a notification.  
**Actor:** Doctor  
**Priority:** P0  
**Acceptance Criteria:**
- Clinical justification is mandatory (min. 20 characters).
- Doctor can submit multiple update requests for the same patient (one per field per request).
- Doctor can view all submitted requests and their statuses from the patient's record view.
- Approved updates are applied atomically and logged in the audit trail with: approving admin ID, timestamp, old value, new value.

---

### 1.7 Prescription Module

---

**FR-PRESC-001**  
**Title:** Create Prescription  
**Description:** A doctor must be able to create a digital prescription linked to a specific completed appointment. The prescription must contain one or more medication entries, each with: medication name (required), dosage (required), frequency (required), duration (required), and additional instructions (optional).  
**Precondition:** Doctor is authenticated. Appointment status = COMPLETED.  
**Postcondition:** Prescription is saved, linked to the appointment and patient record. Patient is notified that a prescription is available.  
**Actor:** Doctor  
**Priority:** P0  
**Acceptance Criteria:**
- A prescription can contain 1 to 20 medication entries.
- Each required field in a medication entry must be filled; partial entries block submission with field-specific error.
- A maximum of one prescription can be created per appointment; if one exists, the doctor can only edit it.
- On save, a PDF version of the prescription is auto-generated with: clinic logo, doctor name & credentials, patient name, appointment date, all medication entries, and doctor signature block.

---

**FR-PRESC-002**  
**Title:** Patient Downloads Prescription  
**Description:** A patient must be able to download any of their prescriptions as a PDF from their appointment history.  
**Precondition:** Patient is authenticated. A prescription exists for the appointment.  
**Postcondition:** PDF is delivered to the patient's browser as a download.  
**Actor:** Patient  
**Priority:** P1  
**Acceptance Criteria:**
- Download button is present on each appointment card that has an associated prescription.
- PDF is generated with clinic branding, doctor credentials, and all medication fields.
- PDF filename format: `Prescription_[PatientName]_[Date].pdf`.

---

### 1.8 Admin Panel Module

---

**FR-ADM-001**  
**Title:** Admin Approval Queue Dashboard  
**Description:** The Admin dashboard must display a prioritized, real-time queue of all items pending admin action. Items include: appointment approval requests and patient data update requests. Items are sorted by submission timestamp (oldest first).  
**Precondition:** Admin is authenticated.  
**Postcondition:** Queue is rendered with real-time data.  
**Actor:** Admin  
**Priority:** P0  
**Acceptance Criteria:**
- Queue is split into two tabs: "Appointment Requests" and "Data Update Requests."
- Each item in the queue shows: submission time, patient name, doctor name, type of request, and time elapsed since submission.
- Items older than 2 hours are highlighted in amber. Items older than 4 hours are highlighted in red.
- The total pending count is displayed in the page title and browser tab.
- The page auto-refreshes every 60 seconds or updates in real-time via WebSocket.

---

**FR-ADM-002**  
**Title:** Manage Doctor Accounts  
**Description:** Admin must be able to create new doctor accounts, view and edit existing doctor profiles, and activate/deactivate accounts. Doctor account creation requires: full name, specialty, gender, credentials, email, phone. A temporary password is auto-generated and emailed to the doctor on creation.  
**Precondition:** Admin is authenticated.  
**Postcondition:** Doctor account is created/updated/deactivated. Audit log entry is created.  
**Actor:** Admin  
**Priority:** P0  
**Acceptance Criteria:**
- Deactivating a doctor hides them from all patient-facing searches and listings immediately.
- Deactivation does not cancel existing SCHEDULED appointments; those remain and a warning is shown: "This doctor has [N] upcoming scheduled appointments."
- Creating a doctor with an email already in the system returns: "A user with this email already exists."
- A temporary password is at least 12 characters, randomly generated, and sent only once.

---

**FR-ADM-003**  
**Title:** View Full Audit Log  
**Description:** Admin must be able to view a complete, immutable log of all system events. Each log entry contains: event ID, user ID, user role, action type, affected entity type, affected entity ID, old value (for updates), new value (for updates), IP address, and timestamp.  
**Precondition:** Admin is authenticated.  
**Postcondition:** Audit log is rendered.  
**Actor:** Admin  
**Priority:** P0  
**Acceptance Criteria:**
- Log is read-only; Admin cannot delete or modify log entries.
- Filter options: user (by name/email), action type (CREATE/UPDATE/DELETE/APPROVE/REJECT), entity type (Appointment/Patient/Doctor/Prescription), date range.
- Log is paginated (50 entries per page).
- Log entries are displayed in reverse-chronological order by default.
- Admin can export the filtered log as a CSV file.

---

**FR-ADM-004**  
**Title:** Generate Reports  
**Description:** Admin must be able to generate the following reports from the system: (a) Total appointments per time period (daily/weekly/monthly), (b) Appointments broken down by doctor, (c) Appointments broken down by specialty, (d) Revenue summary (total fees for completed appointments), (e) Patient registration trend.  
**Precondition:** Admin is authenticated.  
**Postcondition:** Report is generated and displayed as an interactive chart + data table.  
**Actor:** Admin  
**Priority:** P1  
**Acceptance Criteria:**
- Report date range is configurable via date picker.
- Charts are interactive (hover to view data point values).
- Each report has an "Export as CSV" and "Export as PDF" button.
- Reports reflect only data up to the current moment; real-time data.

---

### 1.9 Notifications Module

---

**FR-NOTIF-001**  
**Title:** In-App Notification Center  
**Description:** The system must provide an in-app notification bell icon in the top navigation bar for all authenticated users. Clicking it opens a panel listing all notifications for that user, sorted by timestamp (newest first).  
**Precondition:** User is authenticated.  
**Postcondition:** Notification panel is rendered.  
**Actor:** Patient, Doctor, Admin  
**Priority:** P0  
**Acceptance Criteria:**
- Unread notification count is shown as a badge on the bell icon.
- Clicking a notification marks it as read and navigates to the relevant record.
- A "Mark all as read" button clears the unread badge.
- Notifications older than 90 days are automatically archived (hidden from main panel but accessible via "View all").

---

**FR-NOTIF-002**  
**Title:** Email Notification Triggers  
**Description:** The system must send automated email notifications for the following events, to the relevant actor(s):

| Event | Recipients |
|-------|-----------|
| Patient submits appointment request | Patient (confirmation), Admin (pending action) |
| Admin approves appointment | Patient, Doctor |
| Admin rejects appointment | Patient |
| Doctor accepts appointment | Patient |
| Doctor rejects appointment | Patient |
| Patient cancels appointment | Doctor, Admin |
| Appointment reminder (24h before) | Patient |
| Doctor submits data update request | Admin |
| Admin approves data update | Doctor, Patient |
| Admin rejects data update | Doctor |
| Prescription created | Patient |
| Doctor refers patient | Patient, referred Doctor |

**Precondition:** The triggering event occurs.  
**Postcondition:** Email is queued for delivery within 60 seconds of the event.  
**Actor:** System (automated)  
**Priority:** P0  
**Acceptance Criteria:**
- All emails use a consistent branded template with clinic name and logo.
- Emails include a CTA button linking directly to the relevant record in the system.
- Delivery failures are logged and retried up to 3 times with exponential backoff.
- Users can opt out of non-critical email notifications from their profile settings.

---

### 1.10 Billing Module

---

**FR-BILL-001**  
**Title:** Auto-Generate Invoice on Appointment Completion  
**Description:** The system must automatically generate an invoice record when a doctor marks an appointment as COMPLETED. The invoice contains: invoice number (auto-incremented), patient name, patient contact, doctor name, specialty, appointment date/time, and consultation fee.  
**Precondition:** Doctor marks appointment as COMPLETED. The appointment has an associated consultation fee.  
**Postcondition:** Invoice record is created and linked to the appointment. Patient can download it as PDF.  
**Actor:** System (automated)  
**Priority:** P1  
**Acceptance Criteria:**
- Invoice PDF filename format: `Invoice_[InvoiceNumber]_[PatientName]_[Date].pdf`.
- Invoice PDF includes clinic header, clinic address, invoice number, and all required fields.
- Invoice is immediately accessible to the patient from their appointment history.
- Admin can view all invoices in the billing section, filterable by date and doctor.

---

### 1.11 Referral Module

---

**FR-REF-001**  
**Title:** Doctor Creates Patient Referral  
**Description:** A doctor must be able to refer a patient to another doctor within the system by selecting the receiving doctor, specifying the reason for referral, and adding clinical notes for the receiving doctor.  
**Precondition:** Doctor is authenticated. The referring doctor has an active or completed appointment with the patient.  
**Postcondition:** A referral record is created. The receiving doctor is notified. A pre-filled appointment request (status = PENDING_ADMIN_APPROVAL) is created on behalf of the patient for the receiving doctor.  
**Actor:** Doctor  
**Priority:** P1  
**Acceptance Criteria:**
- Referral reason is mandatory (min. 20 characters).
- The patient is notified: "Dr. [Name] has referred you to Dr. [Name]. A new appointment request has been submitted on your behalf."
- The receiving doctor can view the referral notes from within the appointment detail screen.
- A referral cannot be made to a deactivated or inactive doctor.

---

### 1.12 Feedback & Ratings Module

---

**FR-RATE-001**  
**Title:** Patient Submits Doctor Rating  
**Description:** A patient must be able to submit a star rating (1–5) and an optional written review for a doctor after an appointment is marked COMPLETED. Each patient can submit only one rating per appointment.  
**Precondition:** Patient is authenticated. Appointment status = COMPLETED. No existing rating for this appointment from this patient.  
**Postcondition:** Rating and review are stored. Doctor's aggregate rating is recalculated. Review appears on doctor's public profile.  
**Actor:** Patient  
**Priority:** P2  
**Acceptance Criteria:**
- Star rating is mandatory; written review is optional.
- Written review has a maximum of 500 characters.
- Patient cannot submit more than one rating per appointment; the submit button is hidden after first submission.
- Aggregate rating = average of all ratings, rounded to 1 decimal place.

---

## 2. Non-Functional Requirements

---

### 2.1 Performance

| ID | Requirement | Metric |
|----|------------|--------|
| NFR-PERF-001 | All page load times for authenticated dashboard views must be within acceptable limits under normal load. | P95 page load time ≤ 2 seconds under load of 100 concurrent users. |
| NFR-PERF-002 | Doctor listing and filter API responses must be fast. | API response time ≤ 500 ms for filtered doctor listing queries. |
| NFR-PERF-003 | Appointment submission API must respond quickly. | API response time ≤ 800 ms for appointment booking submission. |
| NFR-PERF-004 | PDF generation (prescriptions, invoices) must complete within acceptable time. | PDF generation ≤ 3 seconds per document. |
| NFR-PERF-005 | The notification delivery system must be near-real-time. | In-app notifications delivered ≤ 5 seconds after triggering event. |
| NFR-PERF-006 | The admin approval queue must reflect real-time data. | Queue refreshes ≤ 60 seconds without manual reload (auto-refresh or WebSocket). |

---

### 2.2 Security

| ID | Requirement | Detail |
|----|------------|--------|
| NFR-SEC-001 | All data in transit must be encrypted. | HTTPS (TLS 1.2 minimum) enforced on all endpoints. HTTP requests must be redirected to HTTPS. |
| NFR-SEC-002 | All passwords must be hashed before storage. | Passwords stored using bcrypt with a minimum cost factor of 12. Plaintext passwords must never be stored or logged. |
| NFR-SEC-003 | All JWTs must be cryptographically signed. | RS256 algorithm. Tokens must contain: user ID, role, issued-at, expiry. Tokens must not contain sensitive data (email, password). |
| NFR-SEC-004 | API endpoints must be protected against injection attacks. | All database queries use parameterized statements or ORM-level sanitization. Raw SQL with user input is prohibited. |
| NFR-SEC-005 | All file uploads must be validated server-side. | File type verified by MIME type inspection, not file extension alone. Uploaded files are scanned for malware before storage. |
| NFR-SEC-006 | The system must protect against CSRF attacks. | All state-changing requests (POST, PUT, PATCH, DELETE) require a CSRF token or use SameSite=Strict cookies. |
| NFR-SEC-007 | Rate limiting must be applied to authentication endpoints. | Login endpoint: max 10 requests per minute per IP. OTP endpoint: max 3 OTP requests per hour per account. |
| NFR-SEC-008 | Patient medical data must be encrypted at rest. | Medical record fields are encrypted at the database column level using AES-256. |
| NFR-SEC-009 | Admin account must be protected with 2FA. | See FR-AUTH-005. Admin login without 2FA must be blocked system-wide. |
| NFR-SEC-010 | Sensitive data must never appear in URL query strings or application logs. | Patient IDs in URLs must use non-sequential, non-guessable UUIDs. Logs must mask emails, phone numbers, and medical fields. |

---

### 2.3 Reliability & Availability

| ID | Requirement | Metric |
|----|------------|--------|
| NFR-REL-001 | System uptime must meet SLA requirements. | Minimum 99.5% uptime per calendar month (excluding scheduled maintenance windows). |
| NFR-REL-002 | Scheduled maintenance windows must be announced in advance. | Minimum 24 hours notice via in-app banner before any maintenance causing downtime. |
| NFR-REL-003 | The system must handle third-party service failures gracefully. | If the email provider is down, notification delivery must be queued and retried; the user-facing action must still succeed with a degraded message. |
| NFR-REL-004 | Database must have automated backup. | Automated daily snapshots retained for 30 days. Point-in-time recovery (PITR) enabled. |
| NFR-REL-005 | Critical failures must trigger automated alerts. | P0 errors (5xx spikes, DB connection failures) must trigger alerts to the engineering on-call within 5 minutes. |

---

### 2.4 Scalability

| ID | Requirement | Detail |
|----|------------|--------|
| NFR-SCAL-001 | The system architecture must support horizontal scaling. | Stateless API servers must be deployable behind a load balancer. Session state must not be stored in application memory. |
| NFR-SCAL-002 | The database must support growth to at least 50,000 patient records in v1 without schema changes. | Database schema designed with indexing on: patient ID, doctor ID, appointment date, appointment status, specialty. |
| NFR-SCAL-003 | File storage must use a scalable cloud object store. | Medical documents and generated PDFs stored in S3-compatible object storage, not local disk. |
| NFR-SCAL-004 | Notification delivery must use a queue-based architecture. | Email/notification jobs processed via a message queue (e.g., Redis + BullMQ or equivalent). No synchronous blocking notification calls in the request lifecycle. |

---

### 2.5 Usability

| ID | Requirement | Detail |
|----|------------|--------|
| NFR-USE-001 | The UI must be accessible to users with low-to-medium digital literacy. | All primary actions (booking, viewing appointments, managing schedule) must be completable within 3 clicks or interactions from the relevant dashboard. |
| NFR-USE-002 | The system must be responsive and functional on screens 375px and wider. | All pages must be usable on mobile browsers (iPhone SE and larger). No horizontal scrolling on mobile. |
| NFR-USE-003 | All form validation errors must be inline, specific, and actionable. | Error messages must appear next to the offending field and describe exactly what is wrong and how to fix it (not generic "An error occurred"). |
| NFR-USE-004 | All destructive actions must require confirmation. | Any action that cannot be undone (cancellation, deactivation, rejection) must display a modal with explicit confirmation and warning text. |
| NFR-USE-005 | The system must provide loading state feedback for all async operations. | Any operation taking > 300 ms must display a loading spinner or skeleton screen. Users must never see a blank or frozen screen during data fetching. |
| NFR-USE-006 | Empty states must be meaningful and actionable. | Any list or view with no data must show a descriptive message and a relevant CTA (e.g., "No appointments yet. Book your first appointment → [CTA]"). |

---

### 2.6 Maintainability

| ID | Requirement | Detail |
|----|------------|--------|
| NFR-MAINT-001 | Backend code must follow a layered architecture. | Strict separation of: routing layer, controller/handler layer, service/business-logic layer, data-access layer. Business logic must not exist in route handlers. |
| NFR-MAINT-002 | All API endpoints must be documented. | OpenAPI 3.0 specification maintained for all endpoints. Documentation auto-generated from code annotations (e.g., Swagger). |
| NFR-MAINT-003 | The system must have automated test coverage. | Minimum 80% unit test coverage for service layer. All P0 user flows must have end-to-end tests. |
| NFR-MAINT-004 | Database schema changes must be version-controlled. | All schema changes applied via migration files (e.g., Flyway, Alembic, Prisma Migrate). No manual SQL edits to production DB. |
| NFR-MAINT-005 | Environment-specific configuration must be externalized. | No hardcoded secrets, API keys, or environment-specific values in source code. All configuration via environment variables. |

---

### 2.7 Data Integrity

| ID | Requirement | Detail |
|----|------------|--------|
| NFR-DI-001 | All database relationships must be enforced with foreign key constraints. | No orphaned records allowed. E.g., an appointment must always have a valid patient ID and doctor ID. |
| NFR-DI-002 | Appointment slot booking must be atomic. | Booking a slot must use a database-level transaction to prevent double-booking under concurrent requests. |
| NFR-DI-003 | Patient medical records must maintain a full change history. | Every update to a patient's medical record must preserve the previous value in a versioned history table. No in-place updates without logging. |
| NFR-DI-004 | Audit log entries must be immutable after creation. | Audit log table must have no UPDATE or DELETE permissions at the database role level used by the application. |
| NFR-DI-005 | Soft deletion must be used for all user-facing entities. | Doctors, patients, appointments, and prescriptions must be soft-deleted (is_deleted flag + deleted_at timestamp), not hard-deleted. Hard deletion is Admin-only via a separate purge operation. |

---

### 2.8 Compliance & Privacy

| ID | Requirement | Detail |
|----|------------|--------|
| NFR-COMP-001 | Patient data must be handled in accordance with applicable data protection regulations. | System design must be compatible with GDPR-equivalent principles: data minimization, purpose limitation, right to access, right to erasure (on Admin request). |
| NFR-COMP-002 | Patient must provide explicit consent at registration. | Registration form must include a clearly labeled checkbox for consent to data processing. Consent timestamp and version must be stored per patient. |
| NFR-COMP-003 | Patients must be able to request export of their own data. | A "Download my data" feature must be available in patient profile settings, generating a ZIP of all personal and medical records. |
| NFR-COMP-004 | Retention policy must be defined and enforced. | Inactive patient accounts (no activity for 5 years) must be flagged for Admin review. Deletion of patient records must be Admin-authorized. |

---

### 2.9 Auditability

| ID | Requirement | Detail |
|----|------------|--------|
| NFR-AUD-001 | Every create, update, delete, approve, and reject action in the system must generate an audit log entry. | Audit log must capture: actor user ID, actor role, action type, entity type, entity ID, payload diff (old value / new value), IP address, timestamp. |
| NFR-AUD-002 | Audit log must be tamper-proof at the application level. | The application service layer must never expose an API endpoint to delete or update audit log entries. |
| NFR-AUD-003 | Audit log queries must perform within acceptable limits. | Audit log must be indexed on: user_id, entity_type, action_type, created_at. Query response for filtered log ≤ 1 second for datasets up to 1 million entries. |

---

## Revision History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0.0 | 2026-04-20 | Engineering Team | Initial draft |
