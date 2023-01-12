export function getLoggedUser() {
  return JSON.parse( localStorage.getItem( "#Kenzie_empresas-token:" ) ) || null
}

export function logoff() {
  localStorage.clear();
  window.location.replace( '/' )
}
