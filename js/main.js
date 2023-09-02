let cantidadPersonas;

let alturas = [];
let edades = [];
let personasQueEntran = [];
let mayores = [];
let menores = [];

let boton = document.getElementById("queueBtn");
boton.addEventListener("click", largoFila);

document.getElementById("climaBtn").addEventListener("click", obtenerClima);

/* Obtención de datos climáticos utilizando API OpenWeatherMap */

async function obtenerClima() {
  const apiKey = "77d075019f468f201ba673122d3cc714";
  const ciudad = "Jupiter,us";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&lang=es&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    mostrarClima(data);
  } catch (error) {
    console.error("Error al obtener el clima:", error);
  }
}

function mostrarClima(data) {
  const { main, weather, name } = data;
  const { temp } = main;
  const { description } = weather[0];

  const mensaje = `El clima en ${name} es ${description} con una temperatura de ${temp}°C.`;

  climaResultado.textContent = mensaje;

  climaResultado.style.display = "block";
}

/* Manejo de cantidad de personas en la fila */

function largoFila() {
  document.getElementById("largoFila").style.display = "block";
  document.getElementById("indicaciones").style.display = "none";
  document.getElementById("tarifa").style.display = "none";
  boton.style.display = "none";

  let botonCorta = document.getElementById("corta");
  let botonMedia = document.getElementById("media");
  let botonLarga = document.getElementById("larga");

  botonCorta.addEventListener("click", () => {
    cantidadPersonas = 3;
    alturaPersona();
  });

  botonMedia.addEventListener("click", () => {
    cantidadPersonas = 5;
    alturaPersona();
  });

  botonLarga.addEventListener("click", () => {
    cantidadPersonas = 8;
    alturaPersona();
  });
}

/* Ingreso de la altura de las personas presentes en la fila */

function alturaPersona() {
  document.getElementById("largoFila").style.display = "none";
  document.getElementById("alturaPersona").style.display = "block";
  document.getElementById("alturaBtn").style.display = "block";

  let inputsCompletados = 0;

  for (let i = 1; i <= cantidadPersonas; i++) {
    let div = document.createElement("div");
    div.classList.add("personasLista");

    let h2 = document.createElement("h2");
    h2.textContent = "Persona " + i;
    h2.classList.add("personaI");
    div.appendChild(h2);

    let input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Ingrese la altura en centimetros (entre 54 y 251)";
    input.classList.add("alturaInput");
    div.appendChild(input);

    document.getElementById("alturaPersona").appendChild(div);

    input.addEventListener("change", function (event) {
      let altura = parseInt(event.target.value);
      alturas.push(altura);

      inputsCompletados++;

      if (inputsCompletados === cantidadPersonas) {
        document.getElementById("alturaBtn").disabled = false;
        document.getElementById("alturaBtn").classList.remove("disabledBtn");
        document
          .getElementById("alturaBtn")
          .classList.add("animate__heartBeat");
      }
    });
  }

  document.getElementById("alturaBtn").addEventListener("click", edadPersona);
}

/* Ingreso de la edad de las personas que, al cumplir con la altura requerida, sí pueden ingresar */

function edadPersona() {
  document.getElementById("alturaPersona").style.display = "none";
  document.getElementById("alturaBtn").style.display = "none";
  document.getElementById("edadPersona").style.display = "block";
  document.getElementById("edadBtn").style.display = "block";

  let inputsCompletados = 0;

  for (i = 0; i < alturas.length; i++) {
    if (alturas[i] >= 160 && alturas[i] <= 254) {
      personasQueEntran.push("Persona " + (i + 1));
    }
  }

  console.log("Personas que entran:", personasQueEntran);

  let swalContent = "<ul>";
  for (let i = 0; i < personasQueEntran.length; i++) {
    swalContent += "<li>" + personasQueEntran[i] + "</li>";

    let div = document.createElement("div");
    div.classList.add("personasLista");

    let h2 = document.createElement("h2");
    h2.textContent = personasQueEntran[i];
    h2.classList.add("personaI");
    div.appendChild(h2);

    let input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Ingrese la edad (entre 0 y 118)";
    input.classList.add("edadInput");
    div.appendChild(input);

    document.getElementById("edadPersona").appendChild(div);

    input.addEventListener("change", function (event) {
      let edad = parseInt(event.target.value);
      inputsCompletados++;

      if (inputsCompletados === personasQueEntran.length) {
        document.getElementById("edadBtn").disabled = false;
        document.getElementById("edadBtn").classList.remove("disabledBtn");
        document.getElementById("edadBtn").classList.add("animate__heartBeat");
      }

      if (edad >= 18) {
        mayores.push(edad);
      } else if (edad > 0) {
        menores.push(edad);
      }
    });
  }

  /* Sweet Alert que muestra las personas que cumplen con los requisitos de altura */

  swalContent += "</ul>";

  Swal.fire({
    title: "Personas que entran:",
    html: swalContent,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });

  document.getElementById("edadBtn").addEventListener("click", ganancias);
}

function simularDelay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* Cálculo de ganancias */

async function ganancias() {
  document.getElementById("edadPersona").style.display = "none";
  document.getElementById("edadBtn").style.display = "none";
  document.getElementById("ganancias").style.display = "block";
  document.getElementById("resetBtn").style.display = "block";

  console.log("Mayores:", mayores);
  console.log("Menores:", menores);

  let totalMoney = mayores.length * 1000 + menores.length * 500;
  let yourWage = (totalMoney * 30) / 100;

  let div = document.createElement("div");

  let totalMoneyTxt = document.createElement("h2");
  totalMoneyTxt.textContent = "Today's earnings: $" + totalMoney;
  div.appendChild(totalMoneyTxt);

  let wageTxt = document.createElement("h2");
  wageTxt.textContent = "Today's wage : $" + yourWage;
  div.appendChild(wageTxt);

  document.getElementById("ganancias").appendChild(div);

  await simularDelay(2000);

  setTimeout(() => {
    document.getElementById("resetBtn").disabled = false;
    document.getElementById("resetBtn").classList.remove("disabledBtn");
    document.getElementById("resetBtn").classList.add("animate__heartBeat");
  }, 2000);

  const earningsData = {
    totalMoney: totalMoney,
    yourWage: yourWage,
  };

  /* Almacenamiento local de datos */

  localStorage.setItem("earningsData", JSON.stringify(earningsData));
}

/* Carga de datos almacenados en la página */

function cargarDatosGuardados() {
  const storedData = localStorage.getItem("earningsData");

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    const { totalMoney, yourWage } = parsedData;

    let div = document.createElement("div");

    let totalMoneyTxt = document.createElement("h2");
    totalMoneyTxt.textContent = "Yesterday's earnings: $" + totalMoney;
    div.appendChild(totalMoneyTxt);

    let wageTxt = document.createElement("h2");
    wageTxt.textContent = "Yesterday's wage: $" + yourWage;
    div.appendChild(wageTxt);

    document.getElementById("ganancias").appendChild(div);

    document.getElementById("resetBtn").disabled = false;
    document.getElementById("resetBtn").classList.remove("disabledBtn");
    document.getElementById("resetBtn").classList.add("animate__heartBeat");
  }
}

window.addEventListener("load", cargarDatosGuardados);
