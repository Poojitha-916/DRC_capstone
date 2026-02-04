# G-Scholar Hub

## Software Requirements Specification (SRS)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements of **G-Scholar Hub**, a digital research scholar management and approval system for GITAM University. The purpose of the system is to replace paper-based and email-driven processes with a centralized, auditable, and role-based digital workflow covering the complete PhD scholar lifecycle.

This SRS serves as the authoritative reference for system behavior, responsibilities, data requirements, and approval workflows.

---

### 1.2 Scope

G-Scholar Hub manages the academic and administrative lifecycle of PhD scholars, including:

- Scholar profile and academic data management
- Research progress tracking
- Application submission and tracking
- Multi-stage approval workflows
- Committee-based decision recording
- Document management and audit trail

The system enforces the official university approval hierarchy:

**Scholar → DRC → IRC → DoAA**

The system does not make academic decisions. It records, controls, and tracks them.

---

### 1.3 Definitions and Acronyms

- **DRC** – Departmental Research Committee
- **IRC** – Institutional Research Committee
- **DoAA** – Directorate of Academic Affairs
- **RAC** – Research Advisory Committee (used interchangeably with DRC in implementation context)
- **SRS** – Software Requirements Specification

---

## 2. Overall System Description

### 2.1 System Overview

G-Scholar Hub is a role-based web portal that provides a single unified interface for scholars, supervisors, and academic committees. All users access the same system, but visibility and actions are controlled by role and by the current stage of an approval process.

The system maintains a single application record for each scholar request. This record progresses sequentially through predefined approval stages without duplication.

---

### 2.2 User Roles

The system supports the following user roles:

- Scholar
- Supervisor
- DRC Member
- IRC Member
- DoAA Officer
- System Administrator

---

## 3. User Roles and Responsibilities

### 3.1 Scholar

**Responsibilities**

- Maintain personal, academic, and contact information
- Upload required documents
- Submit applications related to PhD progression
- Track application status and decisions
- View notices and announcements

**Permissions**

- Can submit applications
- Can upload documents
- Can view application status and remarks
- Cannot modify applications after submission
- Cannot approve or reject any request

---

### 3.2 Supervisor

**Responsibilities**

- Academic oversight of assigned scholars
- Monitoring research progress
- Providing reports or remarks where required

**Permissions**

- View scholar profiles and progress
- View scholar applications
- Submit academic reports
- Cannot finalize approvals
- Cannot move applications across stages

---

### 3.3 Departmental Research Committee (DRC)

**Responsibilities**

- First-level academic review and approval
- Department-level quality and compliance checks

**Permissions**

- View applications at the DRC stage
- Review documents and scholar history
- Record decisions and remarks
- Cannot act on applications outside the DRC stage
- Cannot bypass IRC or DoAA

---

### 3.4 Institutional Research Committee (IRC)

**Responsibilities**

- Institutional-level compliance review
- Policy and regulation enforcement

**Permissions**

- View applications at the IRC stage
- Review DRC decisions and remarks
- Record IRC-level decisions
- Cannot act before DRC or after DoAA

---

### 3.5 Directorate of Academic Affairs (DoAA)

**Responsibilities**

- Final academic authority
- Final approval and closure of applications

**Permissions**

- View complete application history
- Record final outcome
- Permanently close applications
- Cannot modify past committee decisions

---

## 4. Approval Workflow

### 4.1 Approval Stages

Each application progresses through the following stages in strict order:

1. DRC
2. IRC
3. DoAA
4. Completed

Stages cannot be skipped or reordered.

---

### 4.2 Approval Logic

- An application is actionable only by the authority corresponding to its current stage
- Each authority records a decision and remarks
- Decisions are immutable once recorded
- A rejection or request for modification terminates the process
- Approval advances the application to the next stage

---

### 4.3 Same-Page, Role-Based Visibility

All users access the same application page. Visibility and actions are controlled by:

- User role
- Current application stage

This ensures consistency, transparency, and ease of audit.

---

## 5. Functional Requirements

### 5.1 User and Role Management

- The system shall identify user roles at login
- The system shall enforce role-based navigation and actions

---

### 5.2 Profile Management

- Scholars shall be able to manage personal and academic profiles
- Faculty and committees shall have read-only access to scholar profiles

---

### 5.3 Application Management

- Scholars shall be able to submit applications
- Each application shall have a type, stage, and status
- Applications shall progress sequentially through approval stages

---

### 5.4 Supported Application Types

The system shall support the following application types. Each application type corresponds to officially used paper forms and captures specific data fields as defined by university regulations.

---

## 5.5 Application-wise Data Requirements

This section defines the exact data required for each application type, derived from the official PDF and DOC forms currently in use.

### 5.5.1 Research Progress Report

**Based on:** Research Progress Report Template

**Submitted by:** Scholar (with Supervisor endorsement)

**Required Data:**
- Scholar identification (name, scholar ID, department)
- Research title
- Registration date
- Reporting period
- Work completed during the period
- Problems or deviations (if any)
- Plan of work for next period
- Supervisor name and remarks

**Reviewed by:** DRC

---

### 5.5.2 Extension of PhD Duration

**Based on:** Form-VIII – Extension of PhD Duration

**Submitted by:** Scholar

**Required Data:**
- Scholar identification details
- Date of registration
- Approved duration and requested extension period
- Reasons for extension
- Summary of research progress
- Coursework completion status
- Publication details
- Supervisor recommendation

**Reviewed by:** DRC → IRC → DoAA

---

### 5.5.3 Re-Registration for PhD

**Based on:** Form-IX – PhD Re-Registration

**Submitted by:** Scholar

**Required Data:**
- Scholar identification details
- Research area and title
- Original registration details
- Period for re-registration
- Justification for re-registration
- Fee payment details
- Supervisor recommendation

**Reviewed by:** DRC → IRC → DoAA

---

### 5.5.4 Change / Addition of Supervisor

**Based on:** Request for Change / Addition of Supervisor Form

**Submitted by:** Scholar

**Required Data:**
- Scholar identification details
- Current supervisor details
- Proposed supervisor details
- Justification for change or addition
- Consent from existing and proposed supervisors

**Reviewed by:** DRC → IRC → DoAA

---

### 5.5.5 Pre-Submission (Pre-Talk) Request

**Based on:** Form-IV Part-A – Guide Approval for Pre-Submission Talk

**Submitted by:** Scholar

**Required Data:**
- Scholar identification details
- Research title and area
- Coursework completion confirmation
- Fee clearance status
- Supervisor approval

**Reviewed by:** Supervisor → DRC

---

### 5.5.6 Pre-Submission (Pre-Talk) Report

**Based on:** Form-V – PhD Pre-Talk Report

**Submitted by:** Scholar and Committee

**Required Data:**
- Summary of research work
- Pre-talk presentation date
- Committee member details
- Committee remarks and recommendations

**Reviewed by:** DRC

---

### 5.5.7 Thesis Submission

**Based on:** Application for Thesis Submission Form

**Submitted by:** Scholar

**Required Data:**
- Scholar identification details
- Thesis title
- Supervisor details
- Coursework completion status
- Publication compliance details
- Uploaded thesis document
- Plagiarism report

**Reviewed by:** DRC → IRC → DoAA

---

### 5.5.8 Revised Thesis Submission Approval

**Based on:** Revised Thesis Approval Form

**Submitted by:** Scholar

**Required Data:**
- Revised thesis document
- Reference to original submission
- Supervisor endorsement
- Committee remarks

**Reviewed by:** DRC

---

### 5.5.9 Declarations and No-Dues

**Based on:** Undertaking Form and No-Dues Certificate

**Submitted by:** Scholar

**Required Data:**
- Declaration of originality and compliance
- Confirmation of no pending dues
- Supporting clearance documents

**Reviewed by:** DRC / DoAA (as applicable)

---


### 5.5 Review and Decision Recording

- Committees shall record decisions only at their authorized stage
- Remarks shall be mandatory for all decisions
- All decisions shall be stored as permanent records

---

### 5.6 Research Progress Tracking

- The system shall track completed reviews
- The system shall track pending reviews
- The system shall track publication counts

---

### 5.7 Document Management

- Scholars shall upload required documents
- Committees shall view documents relevant to their stage
- Documents shall be linked to applications or profiles

---

### 5.8 Checklists and Declarations

- The system shall support eligibility checklists
- The system shall record scholar declarations digitally

---

### 5.9 Notifications and Status Visibility

- Users shall be able to view application stage and status
- Pending actions shall be clearly indicated

---

### 5.10 Audit and Traceability

- The system shall maintain a complete audit trail
- Each decision shall record:
  - Actor
  - Stage
  - Decision
  - Remarks
  - Timestamp

---

## 6. Data Requirements (Conceptual Schema)

### 6.1 Users

Stores:
- Identity and contact details
- Role and authority
- Scholar-specific or faculty-specific attributes

---

### 6.2 Applications

Stores:
- Application type
- Scholar reference
- Current stage
- Current status
- Final outcome

---

### 6.3 Application Reviews

Stores:
- Reviewer identity
- Approval stage
- Decision and remarks
- Timestamp

---

### 6.4 Research Progress

Stores:
- Completed reviews
- Pending reports
- Publications
- Last review date

---

## 7. Non-Functional Requirements

### 7.1 Security

- Role-based access control
- Secure authentication
- Protection of academic records

---

### 7.2 Usability

- Simple and consistent interface
- Same-page design for all roles
- Clear indication of responsibilities

---

### 7.3 Reliability and Integrity

- No data loss
- Immutable decision history
- Consistent enforcement of workflow rules

---

### 7.4 Maintainability

- Modular design
- Configurable approval rules
- Extendable to additional committees if required

---

## 8. Out of Scope

- Automated academic decision-making
- Replacement of committee discussions
- Policy definition or modification

---

## 9. Conclusion

G-Scholar Hub provides a structured, transparent, and regulation-aligned digital platform for managing the PhD scholar lifecycle. By enforcing a strict approval hierarchy and maintaining a complete audit trail, the system ensures academic governance while eliminating manual and paper-based inefficiencies.

---

**End of Software Requirements Specification**

