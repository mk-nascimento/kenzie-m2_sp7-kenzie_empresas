import { getLoggedUser, logoff } from './global.js';
import { adminDeleteUser, adminEditUser, deleteDepartment, editDepartment, getAllCompanies, getAllDepartments, getAllUsers, getDepartmentsByCompany, hireUser, postNewDepartment, unemployedUsers, validateUser } from './request.js';

async function checkLogin() {
  const token = getLoggedUser();
  let userAdmin = ''
  if ( token ) { userAdmin = await validateUser( token ) };
  if ( !token ) { window.location.replace( '/' ) }
  else if ( token && !userAdmin ) { window.location.replace( '/src/pages/dashboard.html' ) }
}
checkLogin();

function onLogoutClick() {
  const button = document.getElementById( 'logout' );
  button.addEventListener( 'click', () => { logoff() } );
  return button;
}

function buttonUser( icon, id, func ) {
  const button = document.createElement( 'button' );
  const img = document.createElement( 'img' );
  button.appendChild( img );
  button.classList = 'hover:scale-110';
  img.dataset.uuid = id;
  img.dataset.func = func;
  img.src = `/src/assets/img/${icon}`

  button.addEventListener( 'click', () => {
    const { func, uuid } = event.target.dataset;
    if ( func == 'edit' ) {
      editUserForm( uuid );
    }
    else if ( func == 'delete' ) {
      deleteUser( uuid );
    }
  } )

  return button;
}

async function listUser( user ) {
  const { username, professional_level, department_uuid, uuid } = user;
  let companyName = null;
  if ( department_uuid ) {
    const allDepartments = await getAllDepartments( getLoggedUser() );
    const company = allDepartments.find( department => department.uuid == department_uuid );
    company ? companyName = company.companies.name : null
  }

  const li = document.createElement( 'li' );
  li.classList = 'user bg-[var(--grey-1)] border-b border-[var(--brand-1)] p-[28px] flex flex-col gap-[28px]';

  const userInfo = document.createElement( 'div' );
  userInfo.classList = 'user-info flex flex-col gap-[10px]';

  const userInfoName = document.createElement( 'h3' );
  userInfoName.classList = 'font-[var(--bold)] text-xl text-[var(--grey-0)] capitalize';
  userInfoName.innerText = username;

  const userProfLevel = document.createElement( 'p' );
  userProfLevel.classList = 'ont-[var(--regular)] text-lg text-[var(--grey-0)] capitalize break-words';
  userProfLevel.innerText = professional_level;

  const pCompanyName = document.createElement( 'p' );
  pCompanyName.classList = 'font-[var(--regular)] text-lg text-[var(--grey-0)] capitalize break-words';
  pCompanyName.innerText = companyName;

  const buttonsDiv = document.createElement( 'div' );
  buttonsDiv.classList = 'user-icons flex flex-row items-center justify-center gap-[16px]';

  li.append( userInfo, buttonsDiv );
  userInfo.append( userInfoName, userProfLevel, pCompanyName );
  buttonsDiv.append( buttonUser( 'pencil.svg', uuid, 'edit' ), buttonUser( 'trash.svg', uuid, 'delete' ) );

  return li;
}

async function renderUsers( token ) {

  const ul = document.getElementById( 'users' );
  const allUsers = await getAllUsers( token );

  allUsers.forEach( async ( user ) => {
    ul.append( await listUser( user ) )
  } )

}
renderUsers( getLoggedUser() );

function buttonDpt( icon, id, func ) {
  const button = document.createElement( 'button' );
  const img = document.createElement( 'img' );
  button.appendChild( img );
  button.classList = 'dpt-button hover:scale-110';
  img.dataset.uuid = id;
  img.dataset.func = func;
  img.src = `/src/assets/img/${icon}`

  button.addEventListener( 'click', () => {
    const { func, uuid } = event.target.dataset;
    if ( func == 'view' ) {
      showDeptForm( uuid );
    }
    else if ( func == 'edit' ) {
      editDeptForm( uuid );
    }
    else if ( func == 'delete' ) {
      deleteDeptForm( uuid );
    }
  } )

  return button;
}

function listItemDepartment( department ) {
  const { name, description, companies, uuid } = department;

  const li = document.createElement( 'li' );
  li.classList = 'dpt bg-[var(--grey-1)] border-b border-[var(--brand-1)] p-[28px] flex flex-col gap-[28px]';

  const dptInfo = document.createElement( 'div' );
  dptInfo.classList = 'dpt-info flex flex-col gap-[10px]';

  const dptName = document.createElement( 'h3' );
  dptName.classList = 'font-[var(--bold)] text-xl text-[var(--grey-0)] capitalize';
  dptName.innerText = name;

  const dptDesc = document.createElement( 'p' );
  dptDesc.classList = 'font-[var(--regular)] text-lg text-[var(--grey-0)] capitalize break-words';
  dptDesc.innerText = description;

  const companyName = document.createElement( 'p' );
  companyName.classList = 'font-[var(--regular)] text-lg text-[var(--grey-0)] capitalize';
  companyName.innerText = companies.name;

  const buttonsDiv = document.createElement( 'div' );
  buttonsDiv.classList = 'dpt-icons flex flex-row items-center justify-center gap-[16px]';

  li.append( dptInfo, buttonsDiv );
  dptInfo.append( dptName, dptDesc, companyName );
  buttonsDiv.append( buttonDpt( 'eye.svg', uuid, 'view' ), buttonDpt( 'pencil-black.svg', uuid, 'edit' ), buttonDpt( 'trash.svg', uuid, 'delete' ) )

  return li;
}

async function renderDepartment( token, id ) {
  const ul = document.getElementById( 'departments' );
  ul.innerHTML = "";

  if ( id ) {
    const allDepartments = await getDepartmentsByCompany( token, id );

    allDepartments.forEach( async ( department ) => {
      ul.appendChild( listItemDepartment( department ) );
    } )

  }
  else {
    const allDepartments = await getAllDepartments( token );

    allDepartments.forEach( ( department ) => {
      ul.appendChild( listItemDepartment( department ) );
    } )
  }
}
renderDepartment( getLoggedUser() );

async function renderOptionsInitial() {
  const select = document.getElementById( 'select-department' );
  const allCompanies = await getAllCompanies();
  select.insertAdjacentHTML( 'beforeend',
    `<option value="">Todos os departamentos</option>`
  )

  allCompanies.forEach( company => {
    const { uuid, name } = company;

    select.insertAdjacentHTML( 'beforeend',
      `<option value="${uuid}">${name}</option>`
    )
  } )
}
renderOptionsInitial();

function renderDepartmentsByCompany() {
  const select = document.getElementById( 'select-department' );
  select.addEventListener( 'change', async () => {
    await renderDepartment( getLoggedUser(), select.value );
  } )
}
renderDepartmentsByCompany()
//
// Form -- Area
//
function formPostDepartment() {
  const form = `<form id="form-post-dept" class="bg-[var(--grey-1)] flex flex-col gap-[14px]">
    <span id="x-close" class="absolute top-[16px] right-[16px] hover:scale-110 cursor-pointer"><img src="/src/assets/img/close.svg"></span>
    <h3 class="font-[var(--bold)] text-4xl text-[var(--grey-0)] select-none">Criar Departamento</h3>
    <input name="name" placeholder="Nome do departamento" type="text"
      class="bg-[var(--grey-1)] focus:outline-none p-[16px] font-[var(--regular)] text-lg text-[var(--grey-0)] border border-30-op">
    <input name="description" placeholder="Descrição" type="text"
      class="bg-[var(--grey-1)] focus:outline-none p-[16px] font-[var(--regular)] text-lg text-[var(--grey-0)] border border-30-op">
    <div class="bg-[var(--grey-1)] p-[16px] border border-30-op">
      <select name="company_uuid"
        class="bg-[var(--grey-1)] focus:outline-none font-[var(--regular)] text-lg text-[var(--grey-0)] w-full h-full cursor-pointer"
        id="create-dep-select">
        <option value="" data-id="none" disabled selected>Selecionar Empresa</option>
      </select>
    </div>
    <button id="close-modal__post-dep" class="bg-[var(--brand-1)] font-[var(--bold)] text-lg text-[var(--grey-1)] py-[12px] cursor-pointer">Criar o departamento</button>
  </form>`

  return form;
}

function formEditDepartment() {
  const form = `<form id="form-upd-dept" class="bg-[var(--grey-1)] flex flex-col gap-[14px]">
  <span id="x-close" class="absolute top-[16px] right-[16px] hover:scale-110 cursor-pointer"><img src="/src/assets/img/close.svg"></span>
  <h3 class="font-[var(--bold)] text-4xl text-[var(--grey-0)] select-none">Editar Departamento</h3>
  <input
    class="bg-[var(--grey-1)] focus:outline-none w-[424px] h-[112px] p-[16px] font-[var(--regular)] text-lg text-[var(--grey-0)] border border-30-op"
    type="text" placeholder="Atualize aqui a descrição do departamento">
  <button id="save-update"
    class="bg-[var(--brand-1)] font-[var(--bold)] text-lg text-[var(--grey-1)] py-[12px]">Salvar
    alterações</button>
</form>`

  return form;
}
//
//
//
function createDepartmentForm() {
  const modal = document.getElementById( 'default-dialog' );
  const button = document.getElementById( 'create-department' );

  button.addEventListener( 'click', async () => {
    modal.innerHTML = '';
    modal.insertAdjacentHTML( 'afterbegin', formPostDepartment() )
    modal.classList = 'relative p-[40px]'
    const allCompanies = await getAllCompanies();
    const inputs = document.querySelectorAll( '#form-post-dept > input' );
    const select = document.getElementById( 'create-dep-select' );
    const create = document.getElementById( 'close-modal__post-dep' );
    const close = document.getElementById( 'x-close' );

    allCompanies.forEach( company => {
      const { uuid, name } = company;

      select.insertAdjacentHTML( 'beforeend',
        `<option value="${uuid}">${name}</option>`
      )
    } )

    create.addEventListener( 'click', async () => {
      event.preventDefault()
      const dep = {}
      inputs.forEach( input => { dep[input.name] = input.value } )
      dep['company_uuid'] = select.value;
      const post = await postNewDepartment( getLoggedUser(), dep );
      const { error } = post;
      if ( !error ) {
        modal.close();
        renderToast( 'Department created successfully', 'bg-[var(--sucess)]' );
        setTimeout( () => { window.location.reload() }, 1500 );
        modal.innerHTML = '';
      } else { renderToast( error, 'bg-[var(--error)]' ) }


    } )
    modal.showModal();
    close.addEventListener( 'click', () => { modal.close(); modal.innerHTML = ''; } )

  } )

}
createDepartmentForm()

function liEmployees( id, username, level, companies ) {

  const li = document.createElement( 'li' );
  li.classList = 'flex flex-col gap-[22px] border-b border-[var(--brand-1)] min-w-[308px] bg-[var(--grey-1)] px-[28px] pt-[18px] pb-[20px]';

  const div = document.createElement( 'div' );
  div.classList = 'user-info flex flex-col gap-[8px]';

  const h3 = document.createElement( 'div' );
  h3.classList = 'name font-[var(--bold)] text-xl text-[var(--grey-0)] capitalize';
  h3.innerText = username

  const p1 = document.createElement( 'div' );
  p1.classList = 'font-[var(--regular)] text-lg text-[var(--grey-0)] capitalize';
  p1.innerText = level

  const p2 = document.createElement( 'div' );
  p2.classList = 'font-[var(--regular)] text-lg text-[var(--grey-0)] capitalize';
  p2.innerText = companies.name

  const button = document.createElement( 'button' );
  button.id = 'dismiss';
  button.classList = 'bg-[var(--grey-1)] font-[var(--bold)] text-lg text-[var(--error)] border border-[var(--error)] py-[14px] px-[26px] self-center cursor-pointer';
  button.dataset.uuid = id;
  button.innerText = 'Desligar';

  li.append( div, button );
  div.append( h3, p1, p2 );
  return li;
}

async function showDeptForm( id ) {
  const toHire = await unemployedUsers( getLoggedUser() );
  const allDepartments = await getAllDepartments( getLoggedUser() );
  const allUsers = await getAllUsers( getLoggedUser() );
  const deptUsers = allUsers.filter( user => user.department_uuid == id );
  const company = allDepartments.find( department => department.uuid == id );
  const { name, description, companies } = company;
  const modal = document.getElementById( 'default-dialog' );

  const modalContent = `<div class="show-dept__container flex flex-col gap-[20px]">
    <span id="x-close" class="absolute top-[16px] right-[16px] hover:scale-110 cursor-pointer"><img src="/src/assets/img/close.svg"></span>
    <h3 class="show-dept__title font-[var(--bold)] text-4xl text-[var(--grey-0)] capitalize">${name}</h3>
    <div class="show-dept__info flex flex-row items-center justify-between gap-[64px]">
      <div class="dept__info flex flex-col gap-[40px]">
        <p class="dept__info-desc font-[var(--bold)] text-xl text-[var(--grey-0)] normal-case">${description}</p>
        <p class="dept__info-company font-[var(--regular)] text-lg text-[var(--grey-0)]">${companies.name}</p>
      </div>
      <div class="dept__hire-form">
        <form id="hire-form" class="flex flex-col gap-[14px]">
          <div
            class="hire-select-container bg-[var(--grey-1)] p-[12px] border border-30-op">
            <select id="hire-select" class="cursor-pointer focus:outline-none bg-[var(--grey-1)]">
              <option value="" disabled selected>Selecionar usuário⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</option>
              <option value="1"
                class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)]">1
              </option>
            </select>
          </div>
          <button id="hire"
            class="bg-[var(--sucess)] font-[var(--bold)] text-lg text-[var(--grey-1)] py-[14px] px-[26px] self-end">Contratar</button>
        </form>
      </div>
    </div>
    <ul id="dept-employees" class="show-dept__employees mt-[28px] bg-[#F8F8F8] px-[32px] pt-[44px] pb-[52px] overflow-x-auto flex flex-row gap-[32px]"></ul>
  </div>`

  modal.innerHTML = '';
  modal.insertAdjacentHTML( 'afterbegin', modalContent )
  modal.classList = 'relative px-[40px] pt-[40px] pb-[68px] max-w-[52.5rem]';
  const close = document.getElementById( 'x-close' );
  const hire = document.getElementById( 'hire' );
  const select = document.getElementById( 'hire-select' );
  const employees = document.getElementById( 'dept-employees' );

  toHire.forEach( user => {
    const { uuid, username } = user; select.insertAdjacentHTML( 'beforeend', `<option value="${uuid}"
      class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)] capitalize">${username}</option>` )
  } )

  deptUsers.forEach( user => {
    const { uuid, username, professional_level } = user;

    employees.append( liEmployees( uuid, username, professional_level, companies ) )
  } )

  hire.addEventListener( 'click', async () => {
    event.preventDefault();
    const hireData = {};
    hireData['user_uuid'] = select.value;
    hireData['department_uuid'] = id;
    console.log( hireData );
    const patch = await hireUser( getLoggedUser(), hireData );
    const { error } = patch;
    if ( !error ) {
      modal.close();
      renderToast( `⠀⠀⠀⠀⠀Hired!!!⠀⠀⠀⠀⠀`, 'bg-[var(--sucess)]' );
      setTimeout( () => { window.location.reload() }, 1500 );
      modal.innerHTML = '';
    } else { renderToast( error.toUpperCase(), 'bg-[var(--error)]' ) }
  } )

  modal.showModal();
  close.addEventListener( 'click', () => { modal.close(); modal.innerHTML = ''; } )

}

function editDeptForm( id ) {
  const modal = document.getElementById( 'default-dialog' );
  modal.innerHTML = '';
  modal.insertAdjacentHTML( 'afterbegin', formEditDepartment() )
  modal.classList = 'relative p-[40px]';
  const close = document.getElementById( 'x-close' );
  const save = document.getElementById( 'save-update' );
  const input = document.querySelector( '#form-upd-dept > input' );

  save.addEventListener( 'click', async () => {
    event.preventDefault()
    const dep = {}
    dep['description'] = input.value

    const patch = await editDepartment( getLoggedUser(), dep, id );
    const { error } = patch;
    if ( !error ) {
      modal.close();
      renderToast( 'Department updated successfully', 'bg-[var(--sucess)]' );
      setTimeout( () => { window.location.reload() }, 1500 );
      modal.innerHTML = '';
    } else { renderToast( error, 'bg-[var(--error)]' ) }
  } )

  modal.showModal();
  close.addEventListener( 'click', () => { modal.close(); modal.innerHTML = ''; } )

}

async function deleteDeptForm( id ) {
  const modal = document.getElementById( 'default-dialog' );
  let name = null;
  const allDepartments = await getAllDepartments( getLoggedUser() );
  const company = allDepartments.find( department => department.uuid == id );
  name = company.name;

  modal.innerHTML = '';
  modal.insertAdjacentHTML( 'afterbegin',
    `<form id="form-delete-dept" class="bg-[var(--grey-1)] flex flex-col gap-[40px] max-w-[732px]">
        <span id="x-close" class="absolute top-[16px] right-[16px] hover:scale-110 cursor-pointer"><img src="/src/assets/img/close.svg"></span>
        <h3 class="font-[var(--bold)] text-4xl text-[var(--grey-0)] select-none">Realmente deseja deletar o Departamento: "${name[0].toUpperCase() + name.substring( 1 )}" e demitir seus funcionários?</h3>
        <button id="delete-dept"
          class="bg-[var(--sucess)] font-[var(--bold)] text-lg text-[var(--grey-1)] py-[12px] cursor-pointer">Confirmar</button>
    </form>`)
  modal.classList = 'relative px-[156px] py-[68px]';
  const close = document.getElementById( 'x-close' );
  const deleteDeptButton = document.getElementById( 'delete-dept' );

  deleteDeptButton.addEventListener( 'click', async () => {
    event.preventDefault();

    const deleteDept = await deleteDepartment( getLoggedUser(), id );
    const { ok } = deleteDept;
    if ( ok ) {
      modal.close();
      renderToast( 'Department deleted successfully', 'bg-[var(--sucess)]' );
      setTimeout( () => { window.location.reload() }, 1500 );
      modal.innerHTML = '';
    } else { renderToast( error, 'bg-[var(--error)]' ) }
  } )

  modal.showModal();
  close.addEventListener( 'click', () => { modal.close(); modal.innerHTML = ''; } )

}

function editUserForm( id ) {
  const modal = document.getElementById( 'default-dialog' );
  modal.innerHTML = '';
  modal.insertAdjacentHTML( 'afterbegin',
    `<form id="form-upd-user" class="bg-[var(--grey-1)] flex flex-col gap-[14px]">
      <span id="x-close" class="absolute top-[16px] right-[16px] hover:scale-110 cursor-pointer"><img src="/src/assets/img/close.svg"></span>
      <h3 class="font-[var(--bold)] text-4xl text-[var(--grey-0)] mb-[8px] select-none">Editar Usuário</h3>
      <div class="bg-[var(--grey-1)] p-[16px] border border-30-op">
        <select
          class="bg-[var(--grey-1)] focus:outline-none font-[var(--regular)] text-lg text-[var(--grey-0)] w-full h-full cursor-pointer"
          id="work-modalities">
          <option disabled selected value="">Selecionar modalidade de trabalho</option>
          <option class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)]"
            value="presencial">Presencial</option>
          <option class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)]"
            value="home office">Home Office</option>
          <option class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)]"
            value="hibrido">Híbrido</option>
        </select>
      </div>
      <div class="bg-[var(--grey-1)] p-[16px] border border-30-op">
        <select
          class="bg-[var(--grey-1)] focus:outline-none font-[var(--regular)] text-lg text-[var(--grey-0)] w-full h-full cursor-pointer"
          id="professional-level">
          <option disabled selected value="">Selecionar nível profissional</option>
          <option class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)]"
            value="estágio">Estágio</option>
          <option class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)]"
            value="júnior">Júnior</option>
          <option class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)]"
            value="pleno">Pleno</option>
          <option class="bg-[var(--grey-1)] font-[var(--regular)] text-base text-[var(--grey-0)]"
            value="sênior">Sênior</option>
        </select>
      </div>
      <button id="save-update"
        class="bg-[var(--brand-1)] font-[var(--bold)] text-lg text-[var(--grey-1)] py-[12px]">Editar</button>
    </form>`)
  modal.classList = 'relative p-[40px] min-w-[508px]';
  const close = document.getElementById( 'x-close' );
  const save = document.getElementById( 'save-update' );
  const kindOfWork = document.getElementById( 'work-modalities' );
  const professionalLevel = document.getElementById( 'professional-level' );

  save.addEventListener( 'click', async () => {
    event.preventDefault()
    const user = {}
    user['kind_of_work'] = kindOfWork.value;
    user['professional_level'] = professionalLevel.value;

    const patch = await adminEditUser( getLoggedUser(), user, id );

    const { error } = patch;
    if ( !error ) {
      modal.close();
      renderToast( 'User updated successfully', 'bg-[var(--sucess)]' );
      setTimeout( () => { window.location.reload() }, 1500 );
      modal.innerHTML = '';

    } else { renderToast( error, 'bg-[var(--error)]' ) }
  } )

  modal.showModal();
  close.addEventListener( 'click', () => { modal.close(); modal.innerHTML = ''; } )

}

async function deleteUser( id ) {
  const modal = document.getElementById( 'default-dialog' );
  let name = null;
  const allUsers = await getAllUsers( getLoggedUser() );
  const user = allUsers.find( user => user.uuid == id );
  name = user.username;

  modal.innerHTML = '';
  modal.insertAdjacentHTML( 'afterbegin',
    `<form id="form-delete-user" class="bg-[var(--grey-1)] flex flex-col gap-[40px] max-w-[732px]">
        <span id="x-close" class="absolute top-[16px] right-[16px] hover:scale-110 cursor-pointer"><img src="/src/assets/img/close.svg"></span>
        <h3 class="font-[var(--bold)] text-4xl text-[var(--grey-0)] select-none">Realmente deseja remover o usuário: "${name.toUpperCase()}"?</h3>
        <button id="delete-user"
          class="bg-[var(--sucess)] font-[var(--bold)] text-lg text-[var(--grey-1)] py-[12px] cursor-pointer">Confirmar</button>
    </form>`)
  modal.classList = 'relative px-[156px] py-[68px]';
  const close = document.getElementById( 'x-close' );
  const deleteUserButton = document.getElementById( 'delete-user' );

  deleteUserButton.addEventListener( 'click', async () => {
    event.preventDefault();

    const deleteUser = await adminDeleteUser( getLoggedUser(), id );
    const { ok } = deleteUser;
    if ( ok ) {
      modal.close();
      renderToast( 'User deleted successfully', 'bg-[var(--sucess)]' );
      setTimeout( () => { window.location.reload() }, 1500 );
      modal.innerHTML = '';
    } else { renderToast( error, 'bg-[var(--error)]' ) }
  } )

  modal.showModal();
  close.addEventListener( 'click', () => { modal.close(); modal.innerHTML = ''; } )

}

function renderToast( text, bgColor ) {
  const toast = document.getElementById( 'toast' );
  toast.classList.add( bgColor )
  toast.insertAdjacentHTML( 'afterbegin', `<h2 class="font-[var(--bold)] text-xl text-[var(--grey-1)]" >${text}</h2>` );

  toast.show();
  setTimeout( () => { toast.classList.add( 'close-error' ) }, 2000 )
  setTimeout( () => { toast.close(); toast.classList.remove( 'close-error', bgColor ); toast.innerHTML = '' }, 3500 )
}

onLogoutClick();
