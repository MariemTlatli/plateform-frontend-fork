// const url = process.env.NEXT_PUBLIC_API_BASE_URL
const url = 'http://localhost:4000/api'
export const ENDPOINTS = {
  // DEPARTMENTS
  GET_DEPARTMENTS_NAMES_IDS: `${url}/department/names-ids`,
  //Departements :
  FETCH_DEPARTEMENTS: () => `${url}/department/all`,
  CREATE_DEPARTEMENT: () => `${url}/department/create`,
  UPDATE_DEPARTEMENT: (departmentId: string) =>
    `${url}/department/update/${departmentId}`,
  DELETE_DEPARTEMENT: (departmentId: string) =>
    `${url}/department/delete/${departmentId}`,
  //Instructors :
  FETCH_INSTRUCTORS: () => `${url}/instructor/all`,
  CREATE_INSTRUCTOR: () => `${url}/instructor/create-with-department`,
  UPDATE_INSTRUCTOR: (instructorId: string) =>
    `${url}/instructor/update/${instructorId}`,
  DELETE_INSTRUCTOR: (instructorId: string) =>
    `${url}/instructor/delete/${instructorId}`,
  GET_INSTRUCTORS_NAMES: `${url}/instructor/get-instructors-names`,
  // Members :
  FETCH_MEMBERS: (departmentId: string) => `${url}/member/all/${departmentId}`,
  FETCH_MEMBERS_FOR_ADMIN: `${url}/member/admin/all`,
  GET_MEMBERS_NAMES: `${url}/member/get-members-names`,
  UPDATE_MEMBER_FOR_ADMIN: (idUser: string) => `${url}/member/update/${idUser}`,
  DELETE_MEMBER_FOR_ADMIN: (idUser: string | number) =>
    `${url}/member/delete/${idUser}`,
  ADD_MEMBER_FOR_ADMIN: `${url}/member/create`,
  // Sessions :
  FETCH_SESSIONS_BY_DEPARTMENT: (DepartmentId: string) =>
    `${url}/session/department/${DepartmentId}`,
  UPDATE_SESSION: `${url}/session/Instructor_modify_Session_In_department/`,
  ADD_SESSION: `${url}/session/add-session-in-department/`,
  DELETE_SESSION_FOR_INSTRUCTOR: (idSession: string | number) =>
    `${url}/session/${idSession}`,
  // Response :
  FETCH_RESPONSES_FOR_INSTRUCTOR: (idAssignment: string) =>
    `${url}/response/responsesByAssignment/${idAssignment}`,
  ADD_RESPONSE_FOR_MEMBER: `${url}/response/responses`,
  FETCH_RESPONSE_BY_ASSIGNMENT_AND_USER: `${url}/response/responsesByAssignmentIdAndUserId`,
  UPDATE_RESPONSE_BY_MEMBER: (idResponse: string) =>
    `${url}/response/update/${idResponse}`,

  // Authentification
  LOGIN: `${url}/user/login`,
  LOGOUT: `${url}/user/logout`,

  // Chats :
  FETCH_CHATS_FOR_INSTRUCTOR: (instructorId: string) =>
    `${url}/chats/${instructorId}`,
  FETCH_MESSAGES_FOR_CHAT: (Chat_Id: string) =>
    `${url}/chats/getChat/${Chat_Id}`,
  CREATE_MESSAGES_IN_CHAT: () => `${url}/chats/addMessage`,

  // Assignments :
  FETCH_ASSIGNMENTS: (departmentId: string) =>
    `${url}/assignment/department/${departmentId}`,
  CREATE_ASSIGNMENT: (departmentId: string) =>
    `${url}/assignment/department/${departmentId}/addAssignment`,
  UPDATE_ASSIGNMENT: (assignmentId: string) =>
    `${url}/assignment/updateAssignment/${assignmentId}`,
  DELETE_ASSIGNMENT: (assignmentId: string, departmentId: string) =>
    `${url}/assignment/deleteAssignment/${assignmentId}/${departmentId}`,
  FETCH_ALL_Assignements: () => `${url}/assignment/getAssignments`
}
