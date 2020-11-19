conciertos();

function conciertos() {
  let print = "";
  fetch("/entradas/conciertos")
    .then((res) => res.json())
    .then(function (datos) {
      for (let i = 0; i < datos.length; i++) {
        print += `<a class="card" href="#">
        <div class="card__background" style="background-image: url(${datos[i].cartel})"></div>
        <div class="card__content">
          <p class="card__category">${datos[i].fecha}</p>
          <h3 class="card__heading">${datos[i].artista}</h3>
        </div>
      </a>`;
      }
      
      document.getElementById("entradas").innerHTML = `
        <section class="hero-section">
        <div class="card-grid">
        ${print}
        <div>
      </section>`;
    });
}
