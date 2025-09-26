// Static masters for dropdowns (mock data)

export const organizations = [
  { id: 1, name: 'ATM Group' },
  { id: 2, name: 'ABC Education Trust' },
]

export const colleges = [
  { id: 10, name: 'ATM College of Engineering', organizationId: 1 },
  { id: 11, name: 'ATM Institute of Technology', organizationId: 1 },
]

export const branches = [
  { id: 5, name: 'Computer Science' },
  { id: 6, name: 'Electronics' },
]

export const sectors = [
  { id: 2, name: 'Technology' },
  { id: 3, name: 'Research' },
]

export const courseTypes = [
  { id: 'Regular', name: 'Regular' },
  { id: 'Part-Time', name: 'Part-Time' },
]

export const universities = [
  { id: 100, name: 'ABC University' },
  { id: 101, name: 'XYZ University' },
]

export const courses = [
  { id: 101, name: 'B.Tech' },
  { id: 102, name: 'B.Sc' },
]

export const batches = [
  { id: '2021', name: '2021' },
  { id: '2022', name: '2022' },
]

export const sessions = [
  { id: '2021-22', name: '2021-22' },
  { id: '2022-23', name: '2022-23' },
]

// Address hierarchy
export const countries = [
  { code: 'IN', name: 'India' },
]

export const states = [
  { code: 'UP', name: 'Uttar Pradesh', country: 'IN' },
  { code: 'MH', name: 'Maharashtra', country: 'IN' },
]

export const districts = [
  { code: 'GBN', name: 'Gautam Buddha Nagar', state: 'UP' },
  { code: 'MUM', name: 'Mumbai Suburban', state: 'MH' },
]

export const cities = [
  { code: 'NOIDA', name: 'Noida', district: 'GBN' },
  { code: 'MUMBAI', name: 'Mumbai', district: 'MUM' },
]
