import { getLoggedUser } from './global.js';
import { loginPost, validateUser } from './request.js';

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

function redirectPage() {
  const allButtons = document.querySelectorAll( '[data-button-function]' );

  allButtons.forEach( button => {
    button.addEventListener( 'click', () => {
      event.preventDefault();
      if ( button.dataset.buttonFunction == 'register' ) { window.location.replace( '/src/pages/register.html' ) }
      else if ( button.dataset.buttonFunction == 'home' ) { window.location.replace( '/' ) }
    } )
  } );
}
redirectPage();

async function loginForm() {
  const inputs = document.querySelectorAll( ".login-section > input" );
  const button = document.getElementById( "login" );
  const loginUser = {};

  button.addEventListener( "click", async ( event ) => {
    event.preventDefault();
    inputs.forEach( ( input ) => {
      loginUser[input.name] = input.value;
    } );
    const { token, error } = await loginPost( loginUser );

    if ( token ) {
      localStorage.setItem( "#Kenzie_empresas-token:", JSON.stringify( token ) );
      checkLogin();
    } else if ( error ) {
      renderModal( error );
    }
  } );
}
loginForm();

async function checkLogin() {
  const token = getLoggedUser() || null;
  let userAdmin = ''
  if ( token ) { userAdmin = await validateUser( token ) };
  if ( token && !userAdmin ) { window.location.replace( '/src/pages/dashboard.html' ) }
  else if ( token && userAdmin ) { };
}

function renderModal( text ) {
  const modal = document.getElementById( 'info-login' );
  modal.insertAdjacentHTML( 'afterbegin', `<h2>${text}</h2>` );

  modal.show();
  setTimeout( () => { modal.classList.add( 'close-error' ) }, 2500 )
  setTimeout( () => { modal.close(); modal.classList.remove( 'close-error' ); modal.innerHTML = '' }, 3500 )
}

checkLogin();
