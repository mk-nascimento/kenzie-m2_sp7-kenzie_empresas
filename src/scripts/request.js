const baseurl = `http://localhost:6278`;
const companies = `${baseurl}/companies`

export async function getAllCompanies() {
  const response = await fetch( companies )

  return response.json()
}

export async function getCompanyBySector( sector ) {
  const response = await fetch( `${companies}/${sector}` );

  return response.json()
}

export async function getAllSectors() {
  const response = await fetch( `${baseurl}/sectors` );

  return response.json()
}

export async function loginPost( data ) {
  const post = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( data )
  }
  const postRequest = ( await fetch( `${baseurl}/auth/login`, post ) )
  const response = await postRequest.json()

  return response
}

export async function registerPost( data ) {
  const post = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( data )
  }
  const postRequest = ( await fetch( `${baseurl}/auth/register`, post ) )
  const response = await postRequest.json()

  return response
}

export async function validateUser( token ) {

  const getUserType = await fetch( `${baseurl}/auth/validate_user`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );
  const userType = await getUserType.json();

  return userType.is_admin;
}

export async function getUserInfo( token ) {

  const getInfo = await fetch( `${baseurl}/users/profile`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );
  const info = await getInfo.json();

  return info;
}

export async function getUserDepartment( token ) {

  const getDepartment = await fetch( `${baseurl}/users/departments`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );
  const department = await getDepartment.json();

  return department
}

export async function updateUser( token, data ) {

  const update = await fetch( `${baseurl}/users`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify( data )
  } );
  const resposeUpdate = await update.json();

  return resposeUpdate;
}

export async function getAllUsers( token ) {

  const allUsers = await fetch( `${baseurl}/users`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );
  const users = await allUsers.json();

  return users;
}

export async function getAllDepartments( token ) {

  const allDepartments = await fetch( `${baseurl}/departments`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );
  const departments = await allDepartments.json();

  return departments;
}

export async function getDepartmentsByCompany( token, id ) {

  const departments = await fetch( `${baseurl}/departments/${id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );
  const responseDepartments = await departments.json();

  return responseDepartments;
}

export async function postNewDepartment( token, data ) {
  const postDepartment = await fetch( `${baseurl}/departments`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify( data )
  } );
  const responsePost = await postDepartment.json();

  return responsePost;
}

export async function editDepartment( token, data, id ) {
  const editDepartment = await fetch( `${baseurl}/departments/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify( data )
  } );
  const responsePatch = await editDepartment.json();

  return responsePatch;
}

export async function deleteDepartment( token, id ) {
  const deleteDept = await fetch( `${baseurl}/departments/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );

  return deleteDept;
}

export async function adminEditUser( token, data, id ) {
  const editUser = await fetch( `${baseurl}/admin/update_user/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify( data )
  } );
  const responsePatch = await editUser.json();

  return responsePatch;
}

export async function adminDeleteUser( token, id ) {
  const deleteUser = await fetch( `${baseurl}/admin/delete_user/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );

  return deleteUser;
}

export async function hireUser( token, data ) {
  const hire = await fetch( `${baseurl}/departments/hire/`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify( data )
  } );
  const responsePatch = await hire.json();

  return responsePatch;

}
export async function unemployedUsers( token ) {
  const freeUsers = await fetch( `${baseurl}/admin/out_of_work`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  } );
  const users = await freeUsers.json();

  return users;
}
