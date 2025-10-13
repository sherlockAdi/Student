import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'

const Registration = () => {
  const [activeTab, setActiveTab] = useState('administration')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [currentItem, setCurrentItem] = useState({})

  // Dummy data for each category
  const [administrationData, setAdministrationData] = useState([
    { id: 1, name: 'Date of Admission', type: 'Date', status: 'Active' },
    { id: 2, name: 'Fee Category', type: 'Dropdown', status: 'Active' },
    { id: 3, name: 'Organization', type: 'Dropdown', status: 'Active' },
    { id: 4, name: 'College Name', type: 'Dropdown', status: 'Active' },
    { id: 5, name: 'Branch', type: 'Dropdown', status: 'Active' },
  ])

  const [addressDetailsData, setAddressDetailsData] = useState([
    { id: 1, name: 'Address Line 1', type: 'Text', status: 'Active' },
    { id: 2, name: 'Address Line 2', type: 'Text', status: 'Active' },
    { id: 3, name: 'Country', type: 'Dropdown', status: 'Active' },
    { id: 4, name: 'State', type: 'Dropdown', status: 'Active' },
    { id: 5, name: 'District', type: 'Dropdown', status: 'Active' },
    { id: 6, name: 'City', type: 'Dropdown', status: 'Active' },
    { id: 7, name: 'Pin Code', type: 'Text', status: 'Active' },
  ])

  const [admissionStatusData, setAdmissionStatusData] = useState([
    { id: 1, name: 'E_Country', type: 'Dropdown', status: 'Active' },
    { id: 2, name: 'E_State', type: 'Dropdown', status: 'Active' },
    { id: 3, name: 'E_District', type: 'Dropdown', status: 'Active' },
    { id: 4, name: 'E_Pincode', type: 'Text', status: 'Active' },
    { id: 5, name: 'E_Address', type: 'Text', status: 'Active' },
  ])

  const [lastEducationData, setLastEducationData] = useState([
    { id: 1, name: 'Passing College', type: 'Text', status: 'Active' },
    { id: 2, name: 'Passing Principal Name', type: 'Text', status: 'Active' },
    { id: 3, name: 'Board Name', type: 'Text', status: 'Active' },
    { id: 4, name: 'Exam Id', type: 'Text', status: 'Active' },
    { id: 5, name: 'Roll No', type: 'Text', status: 'Active' },
  ])

  const [previousSchoolData, setPreviousSchoolData] = useState([
    { id: 1, name: 'Category/Subject Name', type: 'Text', status: 'Active' },
    { id: 2, name: 'Educator Name', type: 'Text', status: 'Active' },
    { id: 3, name: 'Percentage', type: 'Number', status: 'Active' },
    { id: 4, name: 'TC Number', type: 'Text', status: 'Active' },
    { id: 5, name: 'Roll Number', type: 'Text', status: 'Active' },
  ])

  const [schoolMasterData, setSchoolMasterData] = useState([
    { id: 1, name: 'School/College Name', type: 'Text', status: 'Active' },
    { id: 2, name: 'Country', type: 'Dropdown', status: 'Active' },
    { id: 3, name: 'State', type: 'Dropdown', status: 'Active' },
    { id: 4, name: 'District', type: 'Dropdown', status: 'Active' },
    { id: 5, name: 'Pincode', type: 'Text', status: 'Active' },
  ])

  const [sportDetailsData, setSportDetailsData] = useState([
    { id: 1, name: 'Sport Type', type: 'Dropdown', status: 'Active' },
    { id: 2, name: 'Sport_1_Name', type: 'Text', status: 'Active' },
    { id: 3, name: 'Sport_2_Name', type: 'Text', status: 'Active' },
    { id: 4, name: 'Sport_3_Name', type: 'Text', status: 'Active' },
    { id: 5, name: 'Sport_4_Name', type: 'Text', status: 'Active' },
  ])

  const [staffDetailsData, setStaffDetailsData] = useState([
    { id: 1, name: 'Joining Date', type: 'Date', status: 'Active' },
    { id: 2, name: 'Leaving Date', type: 'Date', status: 'Active' },
    { id: 3, name: 'Designation', type: 'Dropdown', status: 'Active' },
    { id: 4, name: 'Department', type: 'Dropdown', status: 'Active' },
    { id: 5, name: 'Salary', type: 'Number', status: 'Active' },
  ])

  const [transportData, setTransportData] = useState([
    { id: 1, name: 'Route Name', type: 'Dropdown', status: 'Active' },
    { id: 2, name: 'Route_id', type: 'Text', status: 'Active' },
    { id: 3, name: 'Stoppage', type: 'Dropdown', status: 'Active' },
    { id: 4, name: 'Vehicle Number', type: 'Text', status: 'Active' },
    { id: 5, name: 'Driver Name', type: 'Text', status: 'Active' },
  ])

  // Tab configuration
  const tabs = [
    { key: 'administration', label: 'Administration Details', data: administrationData, setData: setAdministrationData },
    { key: 'address', label: 'Address Details', data: addressDetailsData, setData: setAddressDetailsData },
    { key: 'admission', label: 'Admission Status', data: admissionStatusData, setData: setAdmissionStatusData },
    { key: 'lastEducation', label: 'Last Education', data: lastEducationData, setData: setLastEducationData },
    { key: 'previousSchool', label: 'Previous School Details', data: previousSchoolData, setData: setPreviousSchoolData },
    { key: 'schoolMaster', label: 'School Master', data: schoolMasterData, setData: setSchoolMasterData },
    { key: 'sportDetails', label: 'Sport Details', data: sportDetailsData, setData: setSportDetailsData },
    { key: 'staffDetails', label: 'Staff Details', data: staffDetailsData, setData: setStaffDetailsData },
    { key: 'transport', label: 'Transport', data: transportData, setData: setTransportData },
  ]

  const getCurrentTabData = () => {
    const tab = tabs.find(t => t.key === activeTab)
    return tab ? { data: tab.data, setData: tab.setData } : { data: [], setData: () => {} }
  }

  const handleAdd = () => {
    setModalMode('add')
    setCurrentItem({ name: '', type: 'Text', status: 'Active' })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setModalMode('edit')
    setCurrentItem(item)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { data, setData } = getCurrentTabData()
      setData(data.filter(item => item.id !== id))
    }
  }

  const handleSave = () => {
    const { data, setData } = getCurrentTabData()
    
    if (modalMode === 'add') {
      const newItem = {
        ...currentItem,
        id: Math.max(...data.map(d => d.id), 0) + 1
      }
      setData([...data, newItem])
    } else {
      setData(data.map(item => item.id === currentItem.id ? currentItem : item))
    }
    
    setShowModal(false)
    setCurrentItem({})
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Registration</strong> <small>Manage Registration Fields</small>
          </CCardHeader>
          <CCardBody>
            {/* Tabs Navigation */}
            <CNav variant="tabs" role="tablist" className="mb-3">
              {tabs.map(tab => (
                <CNavItem key={tab.key}>
                  <CNavLink
                    active={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tab.label}
                  </CNavLink>
                </CNavItem>
              ))}
            </CNav>

            {/* Tab Content */}
            <CTabContent>
              {tabs.map(tab => (
                <CTabPane key={tab.key} visible={activeTab === tab.key}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>{tab.label}</h5>
                    <CButton color="primary" size="sm" onClick={handleAdd}>
                      <CIcon icon={cilPlus} className="me-1" />
                      Add Field
                    </CButton>
                  </div>

                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Field Name</CTableHeaderCell>
                        <CTableHeaderCell>Field Type</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {tab.data.map((item, idx) => (
                        <CTableRow key={item.id}>
                          <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                          <CTableDataCell>{item.name}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="info">{item.type}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={item.status === 'Active' ? 'success' : 'secondary'}>
                              {item.status}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-end">
                            <CButton
                              color="warning"
                              variant="ghost"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(item)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>

                  {tab.data.length === 0 && (
                    <div className="text-center py-4 text-muted">
                      No fields configured. Click "Add Field" to create one.
                    </div>
                  )}
                </CTabPane>
              ))}
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Add/Edit Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{modalMode === 'add' ? 'Add New Field' : 'Edit Field'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Field Name *</CFormLabel>
              <CFormInput
                value={currentItem.name || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                placeholder="Enter field name"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Field Type *</CFormLabel>
              <CFormSelect
                value={currentItem.type || 'Text'}
                onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value })}
              >
                <option value="Text">Text</option>
                <option value="Number">Number</option>
                <option value="Date">Date</option>
                <option value="Dropdown">Dropdown</option>
                <option value="Checkbox">Checkbox</option>
                <option value="Radio">Radio</option>
                <option value="Textarea">Textarea</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Status *</CFormLabel>
              <CFormSelect
                value={currentItem.status || 'Active'}
                onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            {modalMode === 'add' ? 'Add Field' : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Registration
