import axios from 'axios'

const api = axios.create({
  // Leave baseURL blank to allow Vite proxy in development
  baseURL: 'http://localhost:62623/',
  // baseURL: 'http://61.246.33.108:8069/',
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

// 📚 Get Previous School Details
export async function getPreviousSchoolDetails(studentId) {
  const { data } = await api.get(`/studentapi/student/previousschooldetails/${studentId}`);
  return data;
}

// 📚 Insert Previous School Details
export async function insertPreviousSchoolDetails(schoolData) {
  const { data } = await api.post('/studentapi/student/insertpreviousschooldetails', schoolData);
  return data;
}

// 👨‍👩‍👧‍👦 Add Sibling
export async function addSibling(siblingData) {
  const { data } = await api.post('/studentapi/sibling/add', siblingData);
  return data;
}

// 👨‍👩‍👧‍👦 Get Siblings
export async function getSiblings(studentId) {
  const { data } = await api.get(`/studentapi/sibling/${studentId}`);
  return data;
}

// 👥 Add Best Friend
export async function addBestFriend(friendData) {
  const { data } = await api.post('/studentapi/bestfriend/add', friendData);
  return data;
}

// 👥 Get Best Friend
export async function getBestFriend(studentId) {
  const { data } = await api.get(`/studentapi/bestfriend/${studentId}`);
  return data;
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

// 🚌 Insert Transport Details
export async function insertTransportDetails(transportData) {
  const { data } = await api.post('/studentapi/transport/insert', transportData);
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
  const { data } = await api.get(`/studentapi/master/subcategories/${categoryId}`);
  return data;
}

// 🕉️ Get Religions
export async function getReligions() {
  const { data } = await api.get('/studentapi/master/religions');
  return data;
}
// 🏢 Get FinancialYear Names
export async function getFinancialYear() {
  const { data } = await api.get('/studentapi/financialyear/get');
  return data;
}
export async function getCourseList(courseTypeId, universityId, batchId) {  
  const { data } = await api.get('/studentapi/courses/by-CourseTypeUniversitybatch', {
    params: {
      coursetype: 12,
      universityid: 27,
      batchid: 6107,
    },
  });
  return data;
}
export async function getSections(courseId) {
  const { data } = await api.get('/studentapi/semesters/by-courseuniversity',{ params: {
      coursetype: 12,
      universityid: 27,
      batchid: 6107,
      courses: courseId,
    },});
  return data;
}
export async function getFeeHeads() {
  try {
    const { data } = await api.get('/studentapi/feehead/active');
    return data;
  } catch (error) {
    console.error('Error fetching fee heads:', error);
    throw error;
  }
}
export async function getStudentFeeSummary(financialYear = '', courseId = null, section = null, FeeHeadId = null) {
  try {
    const params = new URLSearchParams();

    if (financialYear) {
      params.append('financialYear', financialYear);
    }

    if (courseId) {
      params.append('CourseId', courseId);
    }

    if (section) {
      params.append('SectionId', section);
    }

    if (FeeHeadId) {
      params.append('feeheadid', FeeHeadId);
    }

    const { data } = await api.get(`/studentapi/student/fee-summary?${params.toString()}`);
    return data;
  } catch (error) {
    console.error('Error fetching student fee summary:', error);
    throw error;
  }
}
// 📅 Get Batches by University
export async function getBatchesByUniversity2(courseTypeId, universityId) {
  const { data } = await api.get('/studentapi/batches/by-university', {
    params: {
      coursetype: 12,
      universityid: 27,
    },
  });
  return data;
}
// 📊 Get Fee Categories
export async function getFeeCategories() {
  const { data } = await api.get('/studentapi/feecategory/all');
  return data;
}
// 📊 Get Fee Categories
export async function getadmissionCategories() {
  const { data } = await api.get('/studentapi/admissioncategory/all');
  return data;
}
/**
 * Fetch student records from searchstudent2_New
 * @param {Object} params - Filters for search
 * @returns {Promise<Object>} - { success, students, totalRecords, message }
 */
export async function getAllStudentRecords(params = {}) {
  const {
    CollegeId = 1,       // @collegeid
    BranchId = 12,        // @branchid
    CourseId = '%',        // @courseid
    UniversityId = '%',    // @universityid
    CourseTypeId = '%',    // @coursetypeid
    BatchId = '%',         // @batchid
    SemesterId = '%',      // @semesterid
    IsLeft = '%',          // @isleft
    FirstName = '%',       // @firstname (will search full name)
    CEmail = '%',          // @cemail (admission no)
    UserId = '%',          // @userid (for private students)
    mobileno1='%',
    Gender='%',
  } = params;


    const res = await api.post('/studentapi/searchstudentRecords', {
      CollegeId,
      BranchId,
      CourseId,
      UniversityId,
      CourseTypeId,
      BatchId,
      SemesterId,
      IsLeft,
      FirstName,
      CEmail,
      UserId,
      mobileno1,
      Gender,
    });
    // console.log('Raw response:', response);        
    // console.log('isSuccess:', response.data.isSuccess);
    // console.log('data.data:', response.data.data);\
    return res
   
}
export default api
