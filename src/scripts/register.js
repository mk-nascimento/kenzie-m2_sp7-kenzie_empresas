import { getLoggedUser } from './global.js';
import { registerPost, validateUser } from './request.js';

function checkMenuBars() {
  const menuBars = document.querySelector( '.mobile-header > .fa-sharp' );
  const buttons = document.getElementsByClassName( 'mobile-buttons' )[0];

  menuBars.addEventListener( 'click', () => {
    const containsBars = event.target.classList.contains( 'fa-bars' )
    if ( containsBars ) {
      event.target.className = "fa-sharp fa-solid fa-xmark";
      buttons.classList.remove( 'hidden' );

    } else {
      event.target.className = "fa-sharp fa-solid fa-bars"; buttons.classList.add( 'hidden' );

    }

    return
  }
  );
}
checkMenuBars();

async function checkLogin() {
  const token = getLoggedUser() || null;
  let userAdmin = ''
  if ( token ) { userAdmin = await validateUser( token ) };
  if ( token && !userAdmin ) { window.location.replace( '/src/pages/dashboard.html' ) }
  else if ( token && userAdmin ) { window.location.replace( '/src/pages/admin.html' ) }

}
checkLogin();

function redirectPage() {
  const allButtons = document.querySelectorAll( '[data-button-function]' );

  allButtons.forEach( button => {
    button.addEventListener( 'click', () => {
      event.preventDefault();
      if ( button.dataset.buttonFunction == 'login' ) { window.location.replace( '/src/pages/login.html' ) }
      else if ( button.dataset.buttonFunction == 'home' ) { window.location.replace( '/' ) }
    } )
  } );


}
redirectPage();

function registerUser() {
  const inputs = document.querySelectorAll( ".input-register" );
  const select = document.querySelector( ".select-register" );
  const button = document.getElementById( "register" );
  const registerUser = { professional_level: null };

  select.addEventListener( 'change', () => { registerUser[select.name] = select.value } )
  button.addEventListener( "click", async ( event ) => {
    event.preventDefault();

    inputs.forEach( ( input ) => { registerUser[input.name] = input.value } );

    const { error } = await registerPost( registerUser ) || null;

    if ( error ) { renderModal( error ) }
    else { window.location.replace( '/src/pages/login.html' ) }
  } );

}
registerUser();

function renderModal( text ) {
  const modal = document.getElementById( 'info-register' );
  modal.insertAdjacentHTML( 'afterbegin', `<h2>${text}</h2>` );

  modal.show();
  setTimeout( () => { modal.classList.add( 'close-error' ) }, 2000 )
  setTimeout( () => { modal.close(); modal.classList.remove( 'close-error' ); modal.innerHTML = '' }, 3500 )
}
