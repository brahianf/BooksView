class AuthFirebase {

  authEmailPass (email, password){
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        if(result.user.emailVerified){

          document.getElementById('modal').style.animation = 'modalOut .8s forwards';
          // Elements Overlay Modal;
          document.getElementById('overlay').classList.remove('active');

          document.getElementById('singUp-button').style.display = 'none';
          document.getElementById('singIn-button').textContent = result.user.displayName;
          document.getElementById('user-photo').style.display = 'block'

          alert(`Bienvenido ${result.user.displayName}`);

        } else {
          console.log('Para continuar verificar correo');
        }
      })
      .catch((error) => {
        if(error.code==='auth/user-not-found'){
          alert('Usuario no existe');
        }
        console.error(error.message);
      });
  }

  crearCuentaEmailPass(name, email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        result.user.updateProfile({
          displayName: name
        });

        const configuracion = {
          url : 'http://localhost:9000/',
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
  }
}

export default AuthFirebase;