import { getLoggedUser } from './global.js';
import { getAllCompanies, getAllSectors, getCompanyBySector, validateUser } from "./request.js";

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
  else if ( token && userAdmin ) { };
}

const homeJobs = document.getElementById( 'home-jobs' );

function createJobCard( company = {} ) {
  const { name, opening_hours, sectors } = company;
  const li =
    `<li class="job-item border-b pt-[13px] px-[15px] pb-[30px] min-w-[15rem] h-[13rem] md:h-[8.4375rem] flex flex-col justify-between">
        <h3 class="">${name}</h3>
        <div class="job-item__details flex flex-col gap-[16px]">
          <p class="text-base justify-self-end">${opening_hours.split( ':' )[0]} Horas</p>
        
          <span class="border text-base w-fit px-[16px] py-[6px] rounded-full justify-self-end">${sectors.description}</span>
        </div>
      </li>`;
  return li;
}

async function renderhomeJobs( sector ) {
  homeJobs.innerHTML = ''
  const allCompanies = !sector ? await getAllCompanies() : await getCompanyBySector( sector );

  allCompanies.forEach( company => {
    homeJobs.insertAdjacentHTML( 'beforeend', createJobCard( company ) )
  } )

}

function createOptionSector( sectorCompany ) {
  const li =
    `<li class='sector py-[6px] px-[20px] border shadow-xl'>${sectorCompany}</li>`// hover:scale-[1.025]
  return li;
}

async function renderOptionsSectors() {
  const allSectors = ( await getAllSectors() ).map( sector => sector.description ).sort();
  const ulSectorsList = document.getElementById( 'select-sectors__list' );

  ulSectorsList.innerHTML = '';
  allSectors.unshift( 'todos os setores' );

  allSectors.forEach( sector => {
    ulSectorsList.insertAdjacentHTML( 'beforeend',
      createOptionSector( sector ) );

  } )

  return allSectors;
}
renderOptionsSectors();

function downUpSectors() {
  const sectorOptions = document.getElementById( 'select-sectors__list' );
  const jobs = document.getElementById( 'home-jobs' );
  const asideHeader = document.querySelector( '.aside-header' )

  const arrowSectors =
    document.querySelector( '.show-options' );
  asideHeader.addEventListener( 'click', () => {
    if ( sectorOptions.classList.contains( 'hidden' ) ) {
      asideHeader.classList.add( 'scale-105' )
      sectorOptions.classList.remove( 'hidden' );
      jobs.classList.add( 'hidden' );
      setTimeout( () => {
        arrowSectors.className = 'show-options fa-sharp fa-solid fa-arrow-up absolute top-3 right-4'
      }, 25 )
    } else {
      asideHeader.classList.remove( 'scale-105' )
      sectorOptions.classList.add( 'hidden' );
      jobs.classList.remove( 'hidden' );

      setTimeout( () => {
        arrowSectors.className = 'show-options fa-sharp fa-solid fa-arrow-down absolute top-3 right-4'
      }, 25 )
    }
  } )
}
downUpSectors()

async function selectSector() {
  const selectedTitle = document.getElementById( 'selected-sector' );
  const sectorsOptions = document.getElementsByClassName( 'sector' )
  const allSectors = ( await getAllSectors() ).map( sector => sector.description ).sort();

  [...sectorsOptions].forEach( sector => {

    sector.addEventListener( 'click', () => {
      selectedTitle.click();
      if ( allSectors.includes( sector.innerHTML ) ) {
        selectedTitle.innerHTML = sector.innerHTML;
        localStorage.setItem( '#selected-option', sector.innerHTML );
      } else {
        selectedTitle.innerHTML = 'Selecionar Setor';
        localStorage.clear();
      }

      checkLocalStorage()
    } )
  } )
}
selectSector();

function checkLocalStorage() {
  const selectedOption = localStorage.getItem( '#selected-option' );
  const selectedTitle = document.getElementById( 'selected-sector' );
  !selectedOption ? renderhomeJobs() : renderhomeJobs( selectedOption )
  !selectedOption ?
    selectedTitle.innerHTML = 'Selecionar Setor'
    : selectedTitle.innerHTML = selectedOption
}
checkLocalStorage()

function clickButtons() {
  const allRegister = document.querySelectorAll( '.register' );
  const allLogin = document.querySelectorAll( '.login' );
  const allButtons = [...allLogin, ...allRegister];

  allButtons.forEach( button => {
    button.addEventListener( 'click', () => {
      document.location.replace( `/src/pages/${event.target.dataset.buttonFunction}.html` )
    } )
  } )

  return allButtons
}
clickButtons();

checkLogin();
