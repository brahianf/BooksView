class AuthFirebase {

  resetPasswordByEmail(email) {
    if (email) {
      const auth = firebase.auth();
      const configuracion = {
        url: "https://brahianf.github.io/BooksView/"
      };
      auth.sendPasswordResetEmail(email, configuracion)
        .then(result => {
          alert('Se ha enviado un correo para reestablecer la contraseña');
        })
        .catch(error => {
          console.log(error);
          alert(`error.message`);
        });
    } else {
      alert('Por favor ingrese su correo');
    }
  }

  addClickSettings(){
    const $primaryUserSettings = document.getElementById('primary-user-settings');
    if ($primaryUserSettings .classList.contains('is-active')){
      $primaryUserSettings.classList.remove('is-active');
    } else{
      $primaryUserSettings.classList.add('is-active');
    }
  }

  onAuthStateChanged(){
    firebase.auth().onAuthStateChanged( user => {
      if(user){
        document.getElementById('singUp-button').style.display = 'none';
        document.getElementById('singIn-button').textContent = user.displayName;
        document.getElementById('primary-user-email').textContent = user.email;
        document.getElementById('user-photo').style.display = 'block';
        if(user.photoURL){
          document.getElementById('user-photo').setAttribute('src' , user.photoURL);
        }
        document.getElementById('user-photo').addEventListener('click', () => {
          this.addClickSettings();
        });
        document.getElementById('logOut-button').addEventListener('click', () => {
          firebase.auth().signOut()
          alert('Sesión Finalizada');
          this.onAuthStateChanged();
        });
      }else {
        document.getElementById('singUp-button').style.display = 'block';
        document.getElementById('singIn-button').textContent = 'Inicio';
        document.getElementById('user-photo').style.display = 'none';
        document.getElementById('user-photo').setAttribute('src' , '../../images/covers/logo.jpg"');
        document.getElementById('primary-user-settings').style.display = 'none';
      }
    });
  }

  authEmailPass (email, password){
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        if(result.user.emailVerified){
          document.getElementById('modal').style.animation = 'modalOut .8s forwards';
          document.getElementById('overlay').classList.remove('active');
          this.onAuthStateChanged();
        } else {
          console.log('Para continuar verificar correo');
        }
      })
      .catch((error) => {
        firebase.auth().signOut();
        if(error.code==='auth/user-not-found'){
          alert('Usuario no existe');
        }
        console.error(error.message);
      });
  };

  crearCuentaEmailPass(name, email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        result.user.updateProfile({
          displayName: name
        });

        const configuracion = {
          url : 'https://brahianf.github.io/BooksView/',
        }
        result.user.sendEmailVerification(configuracion)
        .catch((error) => {
          console.error(error.message);
        });

        firebase.auth().signOut();
        alert('Bienvenido, verificar correo para continuar');
      })
      .catch((error) => {
        if(error.code==='auth/email-already-in-use'){
          alert('Email no disponible');
        }
        console.error(error.message);
      });
  };

  authAccountGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      document.getElementById('modal').style.animation = 'modalOut .8s forwards';
      // Elements Overlay Modal;
      document.getElementById('overlay').classList.remove('active');
      this.onAuthStateChanged();
    })
    .catch(error => {
      firebase.auth().signOut()
      console.log(error);
      alert(`Problema de autenticacion google ${error}} `);
    })
  };

  authAccountFacebook(){
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      document.getElementById('modal').style.animation = 'modalOut .8s forwards';
      // Elements Overlay Modal;
      document.getElementById('overlay').classList.remove('active');
      this.onAuthStateChanged();
    })
    .catch(error => {
      firebase.auth().signOut()
      console.log(error);
      alert(`Problema de autenticacion facebook ${error} !! `, 4000)
    })
  };
}

export default AuthFirebase;