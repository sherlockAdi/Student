# SRN Auto-Generation Implementation

## Overview
Implemented automatic Student Registration Number (SRN) generation in the student admission form based on College, Course Type, University, and Batch selection.

## Files Modified/Created

### 1. **API Functions** (`src/api/api.js`)
Added two new API functions:

#### `getSRN({ collegeId, courseTypeId, universityId, batchId })`
- Fetches auto-generated SRN from backend
- Endpoint: `GET /studentapi/getsrn`
- Parameters: `collegeid`, `ctype`, `uid`, `batchid`
- Returns: `{ srn: "1001" }`

#### `insertStudentAdministration(studentData)`
- Submits new student admission data
- Endpoint: `POST /studentapi/insertAdministration`
- Payload structure:
```json
{
  "DateOfAdmission": "2025-10-11T10:30:06.855Z",
  "FeeCategoryId": 0,
  "OrganizationId": 0,
  "CollegeId": 1,
  "BranchId": 0,
  "CourseTypeId": 1,
  "UniversityId": 1,
  "FinancialYearId": 0,
  "CourseId": 0,
  "BatchId": 1,
  "SectionId": 0,
  "FirstName": "John",
  "MiddleName": "M",
  "LastName": "Doe",
  "MobileNo1": "1234567890",
  "MobileNo2": "",
  "MobileNo3": "",
  "AdmissionNo": "",
  "StudentId": "1001"
}
```

### 2. **New Component** (`src/views/admin/StudentAdd.js`)
Created a complete student admission form with:

#### Features:
- **Auto SRN Generation**: Automatically fetches SRN when all required fields are filled
  - College (required)
  - Course Type (required)
  - University (required)
  - Batch (required)
  
- **Real-time Updates**: SRN updates automatically when any of the 4 required fields change

- **Master Data Integration**: Loads dropdowns from `getCommonData` API
  - Colleges (type=10)
  - Branches (type=6, filtered by college)
  - Course Types (type=9)
  - Universities (type=11)
  - Courses (type=8)

- **Form Validation**: 
  - Required fields marked with *
  - Submit button disabled until SRN is generated
  - Error/Success alerts

- **Loading States**:
  - Spinner shown while SRN is being fetched
  - Spinner shown during form submission
  - Student ID field is read-only (auto-generated)

### 3. **Updated StudentList** (`src/views/admin/StudentList.js`)
- Added "Add Student" button in header
- Imports `cilPlus` icon
- Button navigates to `/admin/students/add`

### 4. **Updated Routes** (`src/routes.js`)
- Added route: `{ path: '/admin/students/add', name: 'Add Student', element: AdminStudentAdd, roles: ['admin'] }`
- Imported `AdminStudentAdd` component

## How It Works

### SRN Auto-Generation Flow:
1. User selects **College**, **Course Type**, **University**, and **Batch**
2. `useEffect` hook detects changes in these 4 fields
3. If all 4 fields have values, API call is triggered: `getSRN({ collegeId, courseTypeId, universityId, batchId })`
4. Loading spinner appears next to Student ID field
5. SRN is fetched and auto-populated in the **Student ID** field
6. Field is read-only to prevent manual editing
7. If any of the 4 fields changes, SRN is re-fetched automatically

### Form Submission Flow:
1. User fills all required fields (marked with *)
2. Submit button is enabled only when SRN is available
3. On submit, data is validated
4. API call: `insertStudentAdministration(payload)`
5. Success: Shows success message and redirects to student list
6. Error: Shows error message with details

## Usage

### To Add a New Student:
1. Navigate to Admin → Students
2. Click "Add Student" button
3. Fill in the required fields:
   - College *
   - Course Type *
   - University *
   - Batch * (enter batch ID as number)
4. **Student ID (SRN) will auto-generate**
5. Fill in student details:
   - First Name *
   - Last Name *
   - Mobile numbers (optional)
   - Other fields (optional)
6. Click "Save Student"

### Navigation:
- `/admin/students` - Student list with filters
- `/admin/students/add` - Add new student (NEW)
- `/admin/students/:id/view` - View student details
- `/admin/students/:id/edit` - Edit student

## API Requirements

### Backend must support:
1. **GET** `/studentapi/getsrn?collegeid={id}&ctype={id}&uid={id}&batchid={id}`
   - Returns: `{ "srn": "1001" }`

2. **POST** `/studentapi/insertAdministration`
   - Accepts JSON payload with student data
   - Returns success/error response

## Notes

- SRN generation is **automatic** - no manual input required
- Student ID field is **read-only** to prevent tampering
- Form validates all required fields before submission
- Batch field currently uses number input (may need to be changed to dropdown if batch master data is available)
- Error handling includes both validation errors and API errors
- Success message appears before auto-redirect to student list
