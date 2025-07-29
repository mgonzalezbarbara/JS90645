const peliculas = ["Avengers", "Spiderman", "Inside Out 2", "El Conjuro"];
const precioEntrada = 1500;

const selectPelicula = document.getElementById("pelicula");
const inputCantidad = document.getElementById("cantidad");
const formulario = document.getElementById("formulario");
const listaReservas = document.getElementById("reservas");

// Cargar las películas en el select
peliculas.forEach(peli => {
  const option = document.createElement("option");
  option.value = peli;
  option.textContent = peli;
  selectPelicula.appendChild(option);
});

// Cargar reservas previas del localStorage
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
renderizarReservas();

// Evento al enviar el formulario
formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const pelicula = selectPelicula.value;
  const cantidad = parseInt(inputCantidad.value);

  if (cantidad > 0) {
    const total = cantidad * precioEntrada;
    const nuevaReserva = { pelicula, cantidad, total };

    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    renderizarReservas();
    formulario.reset();
  }
});

// Mostrar reservas en pantalla
function renderizarReservas() {
  listaReservas.innerHTML = "";

  if (reservas.length === 0) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = "No hay reservas todavía.";
    listaReservas.appendChild(li);
    return;
  }

  reservas.forEach((reserva, index) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `
      <strong>${reserva.pelicula}</strong> - ${reserva.cantidad} entradas - Total: $${reserva.total}
      <button class="btn btn-sm btn-danger float-end" onclick="eliminarReserva(${index})">Eliminar</button>
    `;
    listaReservas.appendChild(li);
  });
}

// Función para eliminar una reserva individual
function eliminarReserva(index) {
  reservas.splice(index, 1);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  renderizarReservas();
}




