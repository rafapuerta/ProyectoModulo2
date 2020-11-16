function registrar() {
  let nombre = document.getElementById("nombre").value;
  let apellido1 = document.getElementById("apellido1").value;
  let apellido2 = document.getElementById("apellido2").value;
  let dni = document.getElementById("dni").value;
  let telf = document.getElementById("telf").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (emailIsValid(email)) {
    console.log(emailIsUnic(email))
    if (emailIsUnic(email)) {
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
            document.getElementById("nombre").value = "";
            document.getElementById("apellido1").value = "";
            document.getElementById("apellido2").value = "";
            document.getElementById("dni").value = "";
            document.getElementById("telf").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("formularioFeedback").innerHTML =
              "<p>Registro realizado correctamente.</p>";
            console.log(data.mensaje);
          });
      } else {
        document.getElementById("password").style.color = "red";
        document.getElementById("formularioFeedback").innerHTML =
          "<p>La contraseña no cumple los requisitos.</p>";
      }
    } else {
      document.getElementById("email").style.color = "red";
      document.getElementById("formularioFeedback").innerHTML =
        "<p>El e-mail ya está registrado.</p>";
    }
  } else {
    document.getElementById("email").style.color = "red";
    document.getElementById("formularioFeedback").innerHTML =
      "<p>El e-mail no cumple los requisitos.</p>";
  }
}

function emailIsValid(email) {
  return /\S+@\S+\.\S+/.test(email)
}

function emailIsUnic(email) {
  let check;
  console.log(email)
  fetch(`/user/check/${email}`)
    .then((response) => response.json())
    .then(function(data) {
      console.log(data)
      console.log(data.length)
      data.length == 0 ? check = true : check = false;
      console.log(check)

      return check;
    });
    /* La funcion no está devolviendo el booleano correctamente. Comprobar */
}

function passIsValid(password) {
  return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);
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
      console.log(data);
    });
}

function private() {
  fetch("/perfil")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("user").innerHTML = "jaja";
    });
}
