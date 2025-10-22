import axios from 'axios'

const api = axios.create({
  // Leave baseURL blank to allow Vite proxy in development
  baseURL: 'http://localhost:62623/',
  // baseURL: 'http://61.246.33.108:8069/',
  timeout: 10000, // 10 second timeout to prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 🔐 LOGIN
export async function login({ email, password }) {
  const payload = {
    Username: email,
    Password: password,
  }
  const { data } = await api.post('/studentapi/login', payload)
  return data
}

// 🔍 SEARCH STUDENT BY SRN (with all params set to '%', except enrolmentno)
export async function searchStudentBySRN(enrolmentno) {
  const { data } = await api.get('/studentapi/student/get-by-EnrollmentNo', {
    params: {
      collegeId: '%',
      branchid: '%',
      courseid: '%',
      universityid: '%',
      coursetypeid: '%',
      batchid: '%',
      firstname: '%',
      categoryid: '%',
      enrolmentno: enrolmentno,
    },
  })
  return data
}

// 📱 SEARCH STUDENT BY MOBILE NUMBER
export async function searchStudentByMobile(mobileNumber) {
  const { data } = await api.get('/studentapi/student/get-by-mobile', {
    params: {
      mobileNumber,
    },
  })
  return data
}

// 💰 GET FEE SELECT STUDENT (POST with studentid in body)
export async function getFeeSelectStudent(studentid) {
  console.log(studentid)
  const { data } = await api.get('/studentapi/student/get-by-feeselectStudentId', {
     params: {
      studentid
     }
  })
  return data
}

// 💵 GET FEE INSTALLMENT DETAILS (GET with required query params)
export async function getFeeInstallmentDetails({ collegeid, SrnNo }) {
  const { data } = await api.get('/studentapi/student/get-by-SrnNo', {
    params: {
      collegeid,
      SrnNo,
    },
  })
  return data
}

// 📄 GET FEE BOOK NO RECEIPT NO (GET with all required query params)
export async function getFeeBookNoReceiptNo({ collegeid, uid, utype, message = '' }) {
  const { data } = await api.get('/studentapi/student/get-by-feeBookNoReceiptNo', {
    params: {
      collegeid,
      uid,
      utype,
      message,
    },
  })
  return data
}


export async function getAmiFeeDetails({ FeeCategoryId, InstalmentId, sid, installmenttype }) {
  const { data } = await api.get('/studentapi/student/get-by-InstallmentId', {
    params: {
      FeeCategoryId,
      InstalmentId,
      sid,
      installmenttype,
    },
  });
  return data;
}

// 🏦 OFFLINE PAYMENT APIs

// Get Payment Mode List
export async function getPaymentModeList() {
  const { data } = await api.get('/studentapi/student/PaymentMode/list');
  return data;
}

// Get Favour Of List (now working with studentId)
export async function getFavourOfList(studentId) {
  const { data } = await api.get('/studentapi/student/Favourof/list', {
    params: {
      studentId,
    },
  });
  return data;
}

// Get Bank List
export async function getBankList({ universityId, inFavourOf, paymentMode }) {
  const { data } = await api.get('/studentapi/student/bank/list', {
    params: {
      universityId,
      inFavourOf,
      paymentMode,
    },
  });
  return data;
}

// Get Account List
export async function getAccountList({ universityId, inFavourOf, paymentMode, bankName, collegeId }) {
  const { data } = await api.get('/studentapi/student/account/list', {
    params: {
      universityId,
      inFavourOf,
      paymentMode,
      bankName,
      collegeId,
    },
  });
  return data;
}

// Get Waiver List
export async function getWaiverList() {
  const { data } = await api.get('/studentapi/student/waiver/list');
  return data;
}

// Get Signatory List
export async function getSignatoryList() {
  const { data } = await api.get('/studentapi/student/signatory/list');
  return data;
}

// Get Student Profile
export async function getStudentProfile(admissionNo) {
  const { data } = await api.get('/studentapi/getProfile', {
    params: {
      id: admissionNo,
    },
  });
  return data;
}

// Get Complete Student Details by Student ID
export async function getStudentDetailsByStudentId(studentId) {
  const { data } = await api.get('/studentapi/student/details', {
    params: {
      studentId,
    },
  });
  return data;
}

// Get Student Administration Details by Student ID
export async function getAdministrationDetails(studentId) {
  const { data } = await api.get(`/studentapi/administrationdetails/${studentId}`);
  return data;
}

// Get Student Personal Details by Student ID
export async function getStudentDetails(studentId) {
  const { data } = await api.get(`/studentapi/studentdetails/${studentId}`);
  return data;
}

// Get Parent Details by Student ID
export async function getParentDetails(studentId) {
  try {
    const { data } = await api.get(`/studentapi/parent-details/${studentId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Parent details not found (404) - returning null');
      return null;
    }
    console.error('Error fetching parent details:', error);
    return null;
  }
}

// Get Address Details by Student ID
export async function getAddressDetails(studentId) {
  try {
    const { data } = await api.get(`/studentapi/address-details/${studentId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Address details not found (404) - returning null');
      return null;
    }
    console.error('Error fetching address details:', error);
    return null;
  }
}

// Get Last School Details
export async function getLastSchoolDetails(studentId) {
  try {
    const { data } = await api.get(`/studentapi/student/lastschooldetails/${studentId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Last school details not found (404) - returning null');
      return null;
    }
    console.error('Error fetching last school details:', error);
    return null;
  }
}

// Get School Master Dropdown (already exists but ensuring it's here)
// export async function getSchoolMasterDropdown() {
//   const { data } = await api.get('/studentapi/schoolmaster/dropdown');
//   return data;
// }

// Insert New School
export async function insertSchoolDetails(schoolData) {
  const { data } = await api.post('/studentapi/schoolmaster/insertschoolDetails', schoolData);
  return data;
}

// Get Previous School Details by Student ID
export async function getPreviousSchoolDetails(studentId) {
  try {
    const { data } = await api.get(`/studentapi/student/previousschooldetails/${studentId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Previous school details not found (404) - returning empty array');
      return [];
    }
    console.error('Error fetching previous school details:', error);
    return [];
  }
}

// Insert Previous School Details
export async function insertPreviousSchoolDetails(schoolData) {
  const { data } = await api.post('/studentapi/student/insertpreviousschooldetails', schoolData);
  return data;
}

// Get Medical Details by Student ID
export async function getMedicalDetails(studentId) {
  try {
    const { data } = await api.get(`/studentapi/medical/${studentId}`);
    return data;
  } catch (error) {
    // Return null for 404 or any error - don't throw
    if (error.response?.status === 404) {
      console.log('Medical details not found (404) - returning null');
      return null;
    }
    console.error('Error fetching medical details:', error);
    return null;
  }
}

// Insert Medical Details
export async function insertMedicalDetails(medicalData) {
  const { data } = await api.post('/studentapi/medical/insert', medicalData);
  return data;
}

// Update Medical Details
export async function updateMedicalDetails(medicalData) {
  const { data } = await api.post('/studentapi/medical/insert', medicalData);
  return data;
}

// Get Transport Details by Student ID
export async function getTransportDetails(studentId) {
  try {
    const { data } = await api.get(`/studentapi/transport/${studentId}`);
    return data;
  } catch (error) {
    // Return null for 404 or any error - don't throw
    if (error.response?.status === 404) {
      console.log('Transport details not found (404) - returning null');
      return null;
    }
    console.error('Error fetching transport details:', error);
    return null;
  }
}

// Insert Transport Details
export async function insertTransportDetails(transportData) {
  const { data } = await api.post('/studentapi/transport/insert', transportData);
  return data;
}

// Update Transport Details
export async function updateTransportDetails(transportData) {
  const { data } = await api.post('/studentapi/transport/insert', transportData);
  return data;
}

// Submit Offline Payment
export async function submitOfflinePayment(paymentData) {
  const { data } = await api.post('/studentapi/studentfee/submit', paymentData);
  return data;
}

// Submit Fee (insert into fee table)
export async function submitFee(feeData) {
  const { data } = await api.post('/studentapi/student/submit-fee', feeData);
  return data;
}

// Example: type=6 (Branch), type=1 (Country), type=2 (State with parentid=countryId)
export async function getCommonData({ type, parentid = -1, selfid = -1 }) {
  const { data } = await api.get('/studentapi/commondata', {
    params: { type, parentid, selfid },
  });
  // Normalize to array of {id,name}
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

// 👥 Get all students with filters and pagination
export async function getAllStudents(params = {}) {
  const {
    collegeId = -1,
    branchId = -1,
    courseId = -1,
    universityId = -1,
    courseTypeId = -1,
    batchId = -1,
    semesterId = -1,
    religionId = -1,
    casteId = -1,
    maritalStatusId = -1,
    presentStatusId = -1,
    gender = null,
    isLeft = null,
    admissionNo = null,
    studentName = null,
    mobile = null,
    searchTerm = null,
    pageNumber = 1,
    pageSize = 20,
  } = params;
  const { data } = await api.get('/studentapi/getall', {
    params: {
      collegeId,
      branchId,
      courseId,
      universityId,
      courseTypeId,
      batchId,
      semesterId,
      religionId,
      casteId,
      maritalStatusId,
      presentStatusId,
      gender,
      isLeft,
      admissionNo,
      studentName,
      mobile,
      searchTerm,
      pageNumber,
      pageSize,
    },
  });
  return data; // { isSuccess, message, totalRecords, data: [...] }
}

// 💰 Get Fee Categories
export async function getFeeCategories() {
  const { data } = await api.get('/studentapi/feecategory/all');
  return data; // [{ Id: 1, FeeCategoryName: "Govt (GEN/OBC)", Status: true, Archive: false }]
}

// 👔 Get Designations
export async function getDesignations() {
  const { data } = await api.get('/studentapi/designation');
  return data; // [{ Id: 10215, Desgid: 121, Desgname: "Finance Head", Shortname: "Finance Head", ... }]
}

// 💼 Get Professions
export async function getProfessions() {
  const { data } = await api.get('/studentapi/profession');
  return data; // [{ Id: 1, ProfessionCode: 101, ProfessionName: "Doctor", ShortName: "Dr", ... }]
}

// 💰 Get Income Ranges
export async function getIncomeRanges() {
  const { data } = await api.get('/studentapi/income');
  return data; // [{ IncomeId: 1, StartRange: 0, EndRange: 200000, RangeValue: "Rs 0 to 200000", ... }]
}

// 🔢 Get SRN (Student Registration Number)
export async function getSRN({ collegeId, courseTypeId, universityId, batchId }) {
  const { data } = await api.get('/studentapi/getsrn', {
    params: {
      collegeid: collegeId,
      ctype: courseTypeId,
      uid: universityId,
      batchid: batchId,
    },
  });
  return data; // { srn: "1001" }
}

// 📝 Insert Student Administration
export async function insertStudentAdministration(studentData) {
  const { data } = await api.post('/studentapi/insertAdministration', studentData);
  return data;
}

// 👨‍👩‍👧 Insert Parent Details
export async function insertParentDetails(parentData) {
  const { data } = await api.post('/studentapi/parent-details', parentData);
  return data;
}

// 📝 Update Student Details
export async function updateStudentDetails(studentDetails) {
  const { data } = await api.post('/studentapi/update-details', studentDetails);
  return data;
}

// 🏠 Submit Address Details
export async function submitAddressDetails(addressData) {
  const { data } = await api.post('/studentapi/submitaddressdetailsforguardian', addressData);
  return data;
}

// 🏫 Insert Last School Details
export async function insertLastSchoolDetails(schoolData) {
  const { data } = await api.post('/studentapi/student/insertlastschooldetails', schoolData);
  return data;
}

// 🏫 Get School Master Dropdown
export async function getSchoolMasterDropdown() {
  const { data } = await api.get('/studentapi/schoolmaster/dropdown');
  return data;
}

// 👨‍👩‍👧‍👦 Add Sibling
export async function addSibling(siblingData) {
  const { data } = await api.post('/studentapi/sibling/add', siblingData);
  return data;
}

// 👨‍👩‍👧‍👦 Get Siblings
export async function getSiblings(studentId) {
  try {
    const { data } = await api.get(`/studentapi/sibling/${studentId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Siblings not found (404) - returning empty array');
      return [];
    }
    console.error('Error fetching siblings:', error);
    return [];
  }
}

// 👥 Add Best Friend
export async function addBestFriend(friendData) {
  const { data } = await api.post('/studentapi/bestfriend/add', friendData);
  return data;
}

// 👥 Get Best Friend
export async function getBestFriend(studentId) {
  try {
    const { data } = await api.get(`/studentapi/bestfriend/${studentId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Best friends not found (404) - returning empty array');
      return [];
    }
    console.error('Error fetching best friends:', error);
    return [];
  }
}

// 🏥 Insert Medical Record
export async function insertMedicalRecord(medicalData) {
  const { data } = await api.post('/studentapi/medical/insert', medicalData);
  return data;
}

// 🏥 Get Medical Record
export async function getMedicalRecord(studentId) {
  const { data } = await api.get(`/studentapi/medical/${studentId}`);
  return data;
}

// 🚌 Get Transport Routes
export async function getTransportRoutes() {
  const { data } = await api.get('/studentapi/transport/routes');
  return data;
}

// 🚌 Get Transport Stops by Route
export async function getTransportStops(routeId) {
  const { data } = await api.get(`/studentapi/transport/stops/${routeId}`);
  return data;
}

// 🌍 Get Countries
export async function getCountries() {
  const { data } = await api.get('/studentapi/country/list');
  return data;
}

// 🌍 Get States by Country
export async function getStatesByCountry(countryId) {
  const { data } = await api.get('/studentapi/state/by-country', {
    params: { conid: countryId }
  });
  return data;
}

// 🌍 Get Districts by State
export async function getDistrictsByState(stateId) {
  const { data } = await api.get('/studentapi/district/by-state', {
    params: { stateid: stateId }
  });
  return data;
}

// 🌍 Get Areas (Tehsils) by District
export async function getAreasByDistrict(districtCode) {
  const { data } = await api.get('/studentapi/tehsil/by-district', {
    params: { district_code: districtCode }
  });
  return data;
}

// 🏢 Get Organization Names
export async function getOrganizations() {
  const { data } = await api.get('/studentapi/organization-names');
  return data;
}

// 🏫 Get Colleges by Organization
export async function getCollegesByOrganization(organizationId) {
  const { data } = await api.get(`/studentapi/colleges/${organizationId}`);
  return data;
}

// 🏢 Get Branches by College
export async function getBranchesByCollege(collegeId) {
  const { data } = await api.get(`/studentapi/branches/by-college/${collegeId}`);
  return data;
}

// 📚 Get Course Types by College
export async function getCourseTypesByCollege(collegeId) {
  const { data } = await api.get(`/studentapi/coursetypes/by-college/${collegeId}`);
  return data;
}

// 🎓 Get Universities by Course Type
export async function getUniversitiesByCourseType(courseTypeId) {
  const { data } = await api.get(`/studentapi/universities/by-course/${courseTypeId}`);
  return data;
}

// 📅 Get Batches by University
export async function getBatchesByUniversity(courseTypeId, universityId) {
  const { data } = await api.get('/studentapi/batches/by-university', {
    params: {
      coursetype: courseTypeId,
      universityid: universityId,
    },
  });
  return data;
}

// 📖 Get Courses by Batch
export async function getCoursesByBatch(courseTypeId, universityId, batchId) {
  const { data } = await api.get('/studentapi/courses/by-batch', {
    params: {
      coursetype: courseTypeId,
      universityid: universityId,
      batchid: batchId,
    },
  });
  return data;
}

// 📋 Get Sections by Course
export async function getSectionsByCourse(courseTypeId, universityId, batchId, courseId) {
  const { data } = await api.get('/studentapi/semesters/by-course', {
    params: {
      coursetype: courseTypeId,
      universityid: universityId,
      batchid: batchId,
      courses: courseId,
    },
  });
  return data;
}

// 🌍 Get Nationalities
export async function getNationalities() {
  const { data } = await api.get('/studentapt/master/nationalities');
  return data;
}

// 🗣️ Get Mother Tongues
export async function getMotherTongues() {
  const { data } = await api.get('/studentapi/master/mothertongues');
  return data;
}

// 📊 Get Caste Categories
export async function getCasteCategories() {
  const { data } = await api.get('/studentapi/master/castecategories');
  return data;
}

// 📊 Get Sub Categories by Category
export async function getSubCategories(categoryId) {
  const { data } = await api.get(`/studentapi/master/subcategories`);
  return data;
}

// 🕉️ Get Religions
export async function getReligions() {
  const { data } = await api.get('/studentapi/master/religions');
  return data;
}

export async function searchStudentByText(searchText) {
  const { data } = await api.get('/studentapi/search', {
    params: {
      searchText,
    },
  })
  return data
}

export default api
