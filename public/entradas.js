conciertos();

function conciertos() {
  let print = "";
  fetch("/entradas/conciertos")
    .then((res) => res.json())
    .then(function (datos) {
      for (let i = 0; i < datos.length; i++) {
        print += `<a class="card">
        <div class="card__background" style="background-image: url(${datos[i].cartel})"></div>
        <div class="card__content">
          <p class="card__category">${datos[i].fecha}</p>
          <h4 class="card__heading">${datos[i].artista}</h4>
          <button class="card__button" onclick="comprar('${datos[i]._id}')">Comprar</button>
        </div>
      </a>`

      }

      document.getElementById("entradas").innerHTML = `
        <section class="hero-section">
        <div class="card-grid">
        ${print}
        <div>
      </section>`;
    });
}

/* crear funcion comprar() que recibe por parámetro el ObjectID de la base de datos para localizarlo. 
1- Comprueba si hay sesion activa
2- Si no hay, envia a login. Si hay a compra.
3- Se confirma la compra y se añade esa entrada al objeto "entradas" del usuario y se disminuye el contador del evento musical */

function comprar(ObjectID){
  if (sessionStorage.getItem("sesionActiva") == "true" ){
    checkout(ObjectID)
    }else{
      window.location.assign("./user.html")
    }
}

function checkout(ObjectID){
  fetch("/entradas/comprar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: ObjectID, email: sessionStorage.getItem("sesionEmail")}),
  })
  .then(res => res.json())
  .then(function (datos) {
    console.log(datos)
    document.getElementById("feedback").innerHTML = `<h3>${datos.mensaje}</h3>`
    abrePop()
    
   })
}

function abrePop() {
  document.getElementById("popup").style.display = "block";
}

function cierraPop() {
  document.getElementById("popup").style.display = "none";
}