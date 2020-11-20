if (sessionStorage.getItem("sesionActiva") == "true") {
  private(sessionStorage.getItem("sesionEmail"));
} else {
  loadLogin();
}

function registrar() {
  let nombre = document.getElementById("nombre").value;
  let apellido1 = document.getElementById("apellido1").value;
  let apellido2 = document.getElementById("apellido2").value;
  let dni = document.getElementById("dni").value;
  let telf = document.getElementById("telf").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (emailIsValid(email)) {
    if (passIsValid(password)) {
      fetch("/user/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          apellido1: apellido1,
          apellido2: apellido2,
          dni: dni,
          telf: telf,
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.unico) {
            document.getElementById("nombre").value = "";
            document.getElementById("apellido1").value = "";
            document.getElementById("apellido2").value = "";
            document.getElementById("dni").value = "";
            document.getElementById("telf").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById(
              "formularioFeedback"
            ).innerHTML = `<h4>${data.mensaje}</h4>
            <button onclick="reloadUser()">INICIAR SESIÓN</button>`;
          } else {
            document.getElementById(
              "formularioFeedback"
            ).innerHTML = `<h5>${data.mensaje}</h5>`;
          }
        });
    } else {
      document.getElementById("password").style.color = "red";
      document.getElementById("formularioFeedback").innerHTML =
        "<h4>La contraseña no cumple los requisitos.</h4>";
    }
  } else {
    document.getElementById("email").style.color = "red";
    document.getElementById("formularioFeedback").innerHTML =
      "<h5>El e-mail no cumple los requisitos.</h5>";
  }
}

function login() {
  let email = document.getElementById("logEmail").value;
  let password = document.getElementById("logPassword").value;

  fetch("/user/login", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.getElementById(
          "formulario2Feedback"
        ).innerHTML = `<p>${data.mensaje}</p>`;
      } else {
        sesionManager(email);
        private(email);
      }
    });
}

function private(email) {
  let entradas = "";
  fetch("/user/perfil", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((res) => res.json())
    .then((datos) => {
      console.log(datos);
      if (datos[0].entradas != undefined) {
        for (let i = 0; i < datos[0].entradas.length; i++) {
          entradas += `<div class="entradaUser">
        <div><img src="${datos[0].entradas[i].cartel}"/></div>
        <div id="canvas${i}"></canvas></div>
        <div class="entradaUserDatos">
        <h2>${datos[0].entradas[i].grupo}</h2>
        <p>Fecha: ${datos[0].entradas[i].fecha}</p>
        <p>Lugar: ${datos[0].entradas[i].sala}</p>
        <p>Entrada nº: ${datos[0].entradas[i].numero}</p>
        </div>
        
        </div>`;
        }
      }
      document.getElementById("user").innerHTML = `
      <div class="form" id="perfil">
      <h1>${datos[0].nombre} ${datos[0].apellido1} ${datos[0].apellido2}</h1>
      <p id="emailPerfil">Email: ${datos[0].email}</p>
      <p>Teléfono: ${datos[0].telf}</p>
      <p>DNI: ${datos[0].dni}</p>
      <p id="feedbackEditar"></p>
      <div id="entradasUser">${entradas}</div>
      <button onclick="editar()">Editar datos</button>
      <button onclick="borrar()">Borrar perfil</button>
      <button onclick="unload()">Cerrar sesión</button>
      </div>
      `;
      if (datos[0].entradas != undefined) {
        for (let i = 0; i < datos[0].entradas.length; i++) {
          var typeNumber = 0;
          var errorCorrectionLevel = "L";
          var qr = qrcode(typeNumber, errorCorrectionLevel);
          qr.addData(
            JSON.stringify({
              email: datos[0].email,
              dni: datos[0].dni,
              entrada: {
                id: datos[0].entradas[i].id,
                artista: datos[0].entradas[i].grupo,
                entrada: datos[0].entradas[i].numero,
                lugar: datos[0].entradas[i].sala,
                fecha: datos[0].entradas[i].fecha,
              },
            })
          );
          qr.make();
          document.getElementById("canvas" + i).innerHTML = qr.createImgTag();
        }
      }
    });
}

function editar() {
  fetch("/user/perfil/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: sessionStorage.getItem("sesionEmail") }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("user").innerHTML = `
      <div class="form" id="formulario">
      <p>Nombre: <input type="text" placeholder="Nombre" id="Enombre"> </p>
      <p>Primer apellido: <input type="text" placeholder="Primer apellido" id="Eapellido1"></p>
      <p>Segundo apellido: <input type="text" placeholder="Segundo apellido" id="Eapellido2"></p>
      <p>DNI: <input type="text" placeholder="DNI" id="Edni"></p>
      <p>Teléfono: <input type="tel" placeholder="Teléfono" id="Etelf"></p>

      <button onclick="editarEnviar()">Enviar</button>
      <div id="formularioFeedback"></div>
      </div>`;
      document.getElementById("Enombre").value = data[0].nombre;
      document.getElementById("Eapellido1").value = data[0].apellido1;
      document.getElementById("Eapellido2").value = data[0].apellido2;
      document.getElementById("Edni").value = data[0].dni;
      document.getElementById("Etelf").value = data[0].telf;
    });
}

function editarEnviar() {
  let nombre = document.getElementById("Enombre").value;
  let apellido1 = document.getElementById("Eapellido1").value;
  let apellido2 = document.getElementById("Eapellido2").value;
  let dni = document.getElementById("Edni").value;
  let telf = document.getElementById("Etelf").value;

  fetch("/user/perfil/editar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: sessionStorage.getItem("sesionEmail"),
      nombre: nombre,
      apellido1: apellido1,
      apellido2: apellido2,
      dni: dni,
      telf: telf,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      private(sessionStorage.getItem("sesionEmail"));
    });
}

function borrar() {
  fetch("/user/perfil/borrar", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: sessionStorage.getItem("sesionEmail") }),
  })
    .then((res) => res.json())
    .then((data) => {
      loadLogin();
    });
}

function sesionManager(email) {
  if (email.length > 0) {
    sessionStorage.setItem("sesionEmail", email);
    sessionStorage.setItem("sesionActiva", true);
  } else {
    sessionStorage.setItem("sesionEmail", "");
    sessionStorage.setItem("sesionActiva", false);
  }
}

function unload() {
  sesionManager("");
  loadLogin();
}

function loadLogin() {
  document.getElementById("user").innerHTML = `
          <div class="form" id="formulario2">
            <input type="email" placeholder="e-mail" id="logEmail">
              <input type="password" placeholder="Contraseña" id="logPassword">
              <button onclick="login()">Iniciar sesión</button>
              <p>¿Aún no tienes cuenta? <a onclick="loadRegistro()">Regístrate</a></p>
              <div id="formulario2Feedback"></div>
          </div>`;
}

function loadRegistro() {
  document.getElementById("user").innerHTML = `
  <div class="form" id="formulario">
              <input type="text" placeholder="Nombre" id="nombre">
              <input type="text" placeholder="Primer apellido" id="apellido1">
              <input type="text" placeholder="Segundo apellido" id="apellido2">
              <input type="text" placeholder="DNI" id="dni">
              <input type="tel" placeholder="Teléfono" id="telf">
              <input type="email" placeholder="e-mail" id="email">
              <input type="password" placeholder="Contraseña" id="password">
              <p>La contraseña debe tener: 1 mayúscula, 1 minúscula, una cifra, un símbolo y debe ser de más de 6 caracteres de longitud</p>
              <button onclick="registrar()">Registrar</button>
              <p>Si ya tienes una cuenta: <a onclick="loadLogin()">Inicia sesión</a></p>
              <div id="formularioFeedback"></div>
          </div>`;
}

/* function borraEntrada(id) {
  fetch("/entradas/borrar", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: sessionStorage.getItem("sesionEmail"), id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      reloadUser()
    });
} */



function emailIsValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function passIsValid(password) {
  return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);
}

function reloadUser(){
  window.location.assign("./user.html")
}

