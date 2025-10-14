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

export default api
