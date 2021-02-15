import AuthFirebase from './authFirebase'
import googleIcon from '../../images/covers/googleIcon.svg'
import facebookIcon from '../../images/covers/facebookIcon.svg'

  const objAuth = new AuthFirebase();

  const $modal = document.getElementById('modal');
  // Elements Overlay Modal;
  const $overlay = document.getElementById('overlay');

  const signIntemtemplateModal = () => {
    return (
      `
      <div class="primary-search modal-signUp">
        <div class=" ">
          <button class="modal-btn primary" id="hide-modal">X</button>
        </div>
        <div class="signIn__social">
          <div class="signIn__social--item">
            <figure><img src=${googleIcon} alt="Google"/></figure>
            <p id="signIn__google">Iniciar sesión con Gmail</p>
          </div>
          <div class="signIn__social--item">
            <figure><img src=${facebookIcon}  alt="Facebook" /></figure>
            <p id="signIn__google">Iniciar sesión con Facebook</p>
          </div>
        </div> 
        <p> | Tengo contraseña ...continuar con mi correo  |
        <form type="submit" class="search" id="formSingUp">
          <input type="text" name="email" placeholder="usuario@email.com" aria-label='Email'/>
          <input type="password" name="password" placeholder="***********" aria-label='Contraseña'/>
        </form>
        <button class="search-button modal-button" type="submit" id="modal-button">Iniciar Sesión</button>
        <div class='modal__LogIn'>
          <p>¿No tengo cuenta? <b>Registrarme</b></p>
        </div>
      </div>  
      `
    );
  };

  const signUptemtemplateModal = () => {
    return (
      `
      <div class="primary-search modal-signUp">
        <div class=" ">
          <button class="modal-btn primary" id="hide-modal">X</button>
        </div>
        <p> | Registrarme con mis datos |
        <form type="submit" class="search" id="formSingUp">
          <input type="text" name="name" placeholder="Nombre Usuario" aria-label='Nombre'/>
          <input type="text" name="email" placeholder="usuario@email.com" aria-label='Email'/>
          <input type="password" name="password" placeholder="***********" aria-label='Contraseña'/>
        </form>
        <button class="search-button modal-button" type="submit" id="modal-button">Registrarme</button>
        <div class='modal__LogIn'>
          <p>¿Ya Estas Registrado? <b>Iniciar Sesión</b></p>
        </div>
      </div>
      `
    );
  }

  const createAccount = ($form) => {
    const name =  $form.elements[0].value;
    const email =  $form.elements[1].value;
    const password =  $form.elements[2].value;

    if(email.length > 0 && password.length > 0){
      if(password.length > 8){
        const auth = new AuthFirebase();
        auth.crearCuentaEmailPass(name, email, password);
      } else {
        alert("La contraseña debe ser mayor a 6 digitos");
      }
    } else {
        alert("Hay Datos vacíos ... llena todo los campos");
    }
  }

  const loginAccount = ($form) => {
    const email =  $form.elements[0].value;
    const password =  $form.elements[1].value;

    if(email.length > 0 && password.length > 0){
      if(password.length > 8){
        const auth = new AuthFirebase();
        auth.authEmailPass(email, password);
      } else {
        alert("La contraseña debe ser mayor a 6 digitos");
      }
    } else {
        alert("Hay Datos vacíos ... llena todo los campos");
    }
  }

  const showModalSingUp = () => {
    $modal.innerHTML = '';
    const HTMLString = signUptemtemplateModal();
    $modal.innerHTML = HTMLString;
    var $form = $modal.querySelector('form');
    const $modalButton = document.getElementById('modal-button');
    $modalButton.addEventListener('click', (event) => {
      event.preventDefault();
      createAccount($form);
    });
    const $modalLogIn = document.querySelector('div.modal__LogIn');
    $modalLogIn.addEventListener('click', () => {
      showModalSingIn();
    });

    $modal.style.animation = 'modalIn .6s forwards';
    $overlay.classList.add('active');
  
    const $hideModal = document.getElementById('hide-modal');
    $hideModal.addEventListener('click', () => {
      $overlay.classList.remove('active');
      $modal.style.animation = 'modalOut .8s forwards';
    });
  };

  const showModalSingIn= () => {
    $modal.innerHTML = '';
    const HTMLString = signIntemtemplateModal();
    $modal.innerHTML = HTMLString;
    var $form = $modal.querySelector('form');
    const $modalButton = document.getElementById('modal-button');
    $modalButton.addEventListener('click', (event) => {
      event.preventDefault();
      loginAccount($form);
    });
    const $signIn__google = document.getElementById('signIn__google');
    $signIn__google.addEventListener('click', () => {
      const auth = new AuthFirebase();
      auth.authAccountGoogle();
    });

    const $modalLogIn = document.querySelector('div.modal__LogIn');
    $modalLogIn.addEventListener('click', () => {
      showModalSingUp();
    });

    $modal.style.animation = 'modalIn .6s forwards';
    $overlay.classList.add('active');
  
    const $hideModal = document.getElementById('hide-modal');
    $hideModal.addEventListener('click', () => {
      $overlay.classList.remove('active');
      $modal.style.animation = 'modalOut .8s forwards';
    });
  };

  export const addEventClickSignIn = () => {
    const $btnsingUp = document.getElementById('singUp-button');
    $btnsingUp.addEventListener('click', () => {
      showModalSingUp();
    });
  };

  export const addEventClickSignUp = () => {
    const $btnLogin= document.getElementById('singIn-button');
    $btnLogin.addEventListener('click', () => {
      if($btnLogin.textContent==='Inicio'){
        showModalSingIn();
      }
    });
  };
