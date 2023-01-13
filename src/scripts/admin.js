import { getLoggedUser, logoff } from './global.js';
import { deleteDepartment, editDepartment, getAllCompanies, getAllDepartments, getAllUsers, getDepartmentsByCompany, postNewDepartment, validateUser } from './request.js';

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

async function listUser( user ) {
  const { username, professional_level, department_uuid, uuid } = user;
  let companyName = null;
  if ( department_uuid ) {
    const allDepartments = await getAllDepartments( getLoggedUser() );
    const company = allDepartments.find( department => department.uuid == department_uuid );
    company ? companyName = company.companies.name : null
  }

  const li = `
  <li class="user bg-[var(--grey-1)] border-b border-[var(--brand-1)] p-[28px] flex flex-col gap-[28px]">
    <div class="user-info flex flex-col gap-[10px]">
      <h3 class="font-[var(--bold)] text-xl text-[var(--grey-0)] capitalize">${username}</h3>
      <p class="font-[var(--regular)] text-lg text-[var(--grey-0)] capitalize">${professional_level ? professional_level : '-'}</p>
      <p class="font-[var(--regular)] text-lg text-[var(--grey-0)]">${companyName ? companyName : '-'}</p>
    </div>
    <div class="user-icons flex flex-row items-center justify-center gap-[16px]">
      <button id="edit-user" class="hover:scale-110" data-uuid="${uuid}"><img src="/src/assets/img/pencil.svg"></button>
      <button id="trash-user" class="hover:scale-110" data-uuid="${uuid}"><img src="/src/assets/img/trash.svg"></button>
    </div>
  </li>
  `
  return li;
}

async function renderUsers( token ) {

  const ul = document.getElementById( 'users' );
  const allUsers = await getAllUsers( token );

  allUsers.forEach( async ( user ) => {
    ul.insertAdjacentHTML( 'beforeend', await listUser( user ) )
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

// Form -- Area
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

  return form
}

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

function renderToast( text, color ) {
  const toast = document.getElementById( 'toast' );
  toast.classList.add( color )
  toast.insertAdjacentHTML( 'afterbegin', `<h2 class="font-[var(--bold)] text-xl text-[var(--grey-1)]" >${text}</h2>` );

  toast.show();
  setTimeout( () => { toast.classList.add( 'close-error' ) }, 2000 )
  setTimeout( () => { toast.close(); toast.classList.remove( 'close-error', color ); toast.innerHTML = '' }, 3500 )
}



onLogoutClick();
