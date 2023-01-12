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
