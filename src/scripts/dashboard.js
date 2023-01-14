import { getLoggedUser, logoff } from './global.js';
import { getCoworkes, getUserDepartment, getUserInfo, updateUser, validateUser } from './request.js';

let userInfo = await getUserInfo( getLoggedUser() );

async function checkLogin() {
  const token = getLoggedUser() || null;
  let userAdmin = ''
  if ( token ) { userAdmin = await validateUser( token ) };
  if ( !token ) { window.location.replace( '/' ) }
  else if ( token && userAdmin ) { window.location.replace( '/src/pages/admin.html' ) }
}
checkLogin();

function onLogoutClick() {
  const button = document.getElementById( 'logout' );
  button.addEventListener( 'click', () => { logoff() } );
  return button;
}

async function checkDepartment() {
  const { error, name, departments } = await getUserDepartment( getLoggedUser() );
  const mycoworkers = await getCoworkes( getLoggedUser() );

  const { department_uuid } = userInfo;
  const section = document.querySelector( '.company-info' );
  const departmentHeader = document.querySelector( '.company-info__header' );
  const coworkers = document.querySelector( '.company-info__coworkers' );
  const notHired = document.querySelector( '.company-info__empty-company' );
  const company = document.querySelector( '.company-info__title' );
  if ( error ) {
    section.classList.add( 'justify-center', 'items-center' );
    departmentHeader.classList.add( 'hidden' );
    coworkers.classList.add( 'hidden' );
    notHired.classList.remove( 'hidden' );
  } else {
    const { users } = mycoworkers[0];
    const userDept = departments.find( dept => dept.uuid == department_uuid );

    section.classList.remove( 'justify-center', 'items-center' );
    departmentHeader.classList.remove( 'hidden' );
    coworkers.classList.remove( 'hidden' );
    notHired.classList.add( 'hidden' );
    company.innerText = `${name} - ${userDept.name}`
    users.forEach( coworker => {
      const { professional_level, username } = coworker;
      coworkers.insertAdjacentHTML( 'beforeend', `<li class="border border-[var(--brand-1)] px-[24px] pt-[14px] pb-[12px]">
        <p class="font-[var(--bold)] text-[0.9375rem] text-[var(--grey-0)] capitalize">${username}</p>
        <p class="font-[var(--regular)] text-[0.9375rem] text-[var(--grey-0)] capitalize">${professional_level}</p>
      </li>`)
    } )

  }
}
checkDepartment()

function showUserInfo( info = {} ) {
  const { username, email, professional_level, kind_of_work } = info;
  const name = document.querySelector( '.user-info__username' );
  const mail = document.querySelector( '.info-data__email' );
  const profLevel = document.querySelector( '.info-data__professional-level' );
  const kindWork = document.querySelector( '.info-data__kind-of-work' );

  name.innerText = username;
  mail.innerText = 'Email: ' + email;
  profLevel.innerText = professional_level || '';
  kindWork.innerText = kind_of_work || '';
}
showUserInfo( userInfo );

function fillActualInfo( info = {}, inputs ) {
  const { username, email } = info;

  inputs.forEach( input => { input.name == 'username' ? input.value = username : null; input.name == 'email' ? input.value = email : null } )
}

function editProfile( info ) {
  const editButton = document.getElementById( 'edit' );
  const patch = document.getElementById( 'edit-patch' );
  const inputs = document.querySelectorAll( '#edit-form > input' );
  const closeModal = document.getElementById( 'close-form' );
  const modal = document.getElementById( 'edit-modal' );

  editButton.addEventListener( 'click', () => {
    fillActualInfo( info, inputs );
    modal.showModal();
  } )

  closeModal.addEventListener( 'click', () => { modal.close() } )

  patch.addEventListener( 'click', async () => {
    const dataUpdate = {};
    inputs.forEach( input => dataUpdate[input.name] = input.value )
    const { error } = await updateUser( getLoggedUser(), dataUpdate );
    if ( !error ) { renderModal( 'profile updated successfully', 'bg-[var(--sucess)]' ); setTimeout( () => { window.location.reload() }, 1500 ) }
    else { renderModal( error, 'bg-[var(--error)]' ) }
  } )

}
editProfile( userInfo )


onLogoutClick();

function renderModal( text, color ) {
  const modal = document.getElementById( 'update-info' );
  modal.classList.add( color )
  modal.insertAdjacentHTML( 'afterbegin', `<h2>${text}</h2>` );

  modal.show();
  setTimeout( () => { modal.classList.add( 'close-error' ) }, 2000 )
  setTimeout( () => { modal.close(); modal.classList.remove( 'close-error', color ); modal.innerHTML = '' }, 3500 )
}
