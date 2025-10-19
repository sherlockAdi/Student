# Registration Module Documentation

## Overview
A comprehensive Registration management panel in the admin sidebar with 9 tabbed sections to manage different registration field categories.

## Features

### 9 Registration Categories (Tabs)

1. **Administration Details**
   - Date of Admission
   - Fee Category
   - Organization
   - College Name
   - Branch

2. **Address Details**
   - Address Line 1
   - Address Line 2
   - Country
   - State
   - District
   - City
   - Pin Code

3. **Admission Status**
   - E_Country
   - E_State
   - E_District
   - E_Pincode
   - E_Address

4. **Last Education**
   - Passing College
   - Passing Principal Name
   - Board Name
   - Exam Id
   - Roll No

5. **Previous School Details**
   - Category/Subject Name
   - Educator Name
   - Percentage
   - TC Number
   - Roll Number

6. **School Master**
   - School/College Name
   - Country
   - State
   - District
   - Pincode

7. **Sport Details**
   - Sport Type
   - Sport_1_Name
   - Sport_2_Name
   - Sport_3_Name
   - Sport_4_Name

8. **Staff Details**
   - Joining Date
   - Leaving Date
   - Designation
   - Department
   - Salary

9. **Transport**
   - Route Name
   - Route_id
   - Stoppage
   - Vehicle Number
   - Driver Name

## Functionality

### ✅ Fully Functional Features

1. **Tab Navigation**
   - Click any tab to switch between categories
   - Active tab is highlighted
   - Each tab maintains its own data

2. **Add New Field**
   - Click "Add Field" button
   - Modal opens with form
   - Enter field name, type, and status
   - Field types: Text, Number, Date, Dropdown, Checkbox, Radio, Textarea

3. **Edit Field**
   - Click edit (pencil) icon on any row
   - Modal opens with current values
   - Modify and save changes

4. **Delete Field**
   - Click delete (trash) icon
   - Confirmation dialog appears
   - Field is removed from list

5. **Field Properties**
   - **Field Name**: Custom name for the field
   - **Field Type**: Text, Number, Date, Dropdown, Checkbox, Radio, Textarea
   - **Status**: Active or Inactive

6. **Visual Indicators**
   - Field type shown as blue badge
   - Status shown as green (Active) or gray (Inactive) badge
   - Empty state message when no fields exist

## Files Created/Modified

### 1. **New Component** (`src/views/admin/Registration.js`)
- Complete registration management interface
- 9 tabs with dummy data
- Add/Edit/Delete functionality
- Modal for form operations
- Responsive table layout

### 2. **Updated Routes** (`src/routes.js`)
- Added: `{ path: '/admin/registration', name: 'Registration', element: AdminRegistration, roles: ['admin'] }`

### 3. **Updated Navigation** (`src/_nav.js`)
- Added Registration link in admin sidebar
- Positioned between Students and Fees

## Usage

### Access the Registration Panel
1. Login as Admin
2. Look at the sidebar
3. Click on **"Registration"**
4. You'll see 9 tabs

### Add a New Field
1. Select any tab (e.g., "Administration Details")
2. Click "Add Field" button
3. Fill in:
   - Field Name (e.g., "Student Type")
   - Field Type (e.g., "Dropdown")
   - Status (e.g., "Active")
4. Click "Add Field"
5. New field appears in the table

### Edit a Field
1. Click the pencil icon on any row
2. Modify the values
3. Click "Save Changes"

### Delete a Field
1. Click the trash icon on any row
2. Confirm deletion
3. Field is removed

## Data Structure

Each field has:
```javascript
{
  id: 1,                    // Unique identifier
  name: 'Field Name',       // Display name
  type: 'Text',            // Field type
  status: 'Active'         // Active or Inactive
}
```

## Field Types Available

- **Text**: Single-line text input
- **Number**: Numeric input
- **Date**: Date picker
- **Dropdown**: Select dropdown
- **Checkbox**: Checkbox input
- **Radio**: Radio button
- **Textarea**: Multi-line text input

## Current State

✅ **Fully Functional with Dummy Data**
- All tabs work independently
- Add/Edit/Delete operations work
- Data persists during session (in-memory)
- Modal forms validate and save
- Visual feedback with badges

⚠️ **Future Enhancements** (when connecting to backend)
- Save data to database
- Load data from API
- Persist changes across sessions
- Add field validation rules
- Add field dependencies
- Export/Import field configurations

## Navigation Path

```
Admin Sidebar → Registration → [9 Tabs]
```

## Screenshots Structure

The interface shows:
- **Header**: "Registration - Manage Registration Fields"
- **Tabs**: 9 horizontal tabs for each category
- **Table**: Lists all fields with columns:
  - # (Serial number)
  - Field Name
  - Field Type (badge)
  - Status (badge)
  - Actions (Edit/Delete buttons)
- **Add Button**: Top-right "Add Field" button
- **Modal**: Form for adding/editing fields

## Benefits

✅ **Organized**: 9 clear categories matching database structure
✅ **User-friendly**: Intuitive tab interface
✅ **Functional**: All CRUD operations work
✅ **Responsive**: Works on all screen sizes
✅ **Visual**: Color-coded badges for quick identification
✅ **Safe**: Confirmation before deletion
✅ **Flexible**: Multiple field types supported

The Registration module is now fully functional and ready to use with dummy data!
