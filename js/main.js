// ================================
// Configuración y estado
// ================================
const ENDPOINT_PELICULAS = './data/peliculas.json';
let catalogo = [];
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];


// ================================
// Elementos del DOM
// ================================
const selectPelicula = document.getElementById('pelicula');
const inputCantidad = document.getElementById('cantidad');
const formulario = document.getElementById('formulario');
const listaReservas = document.getElementById('reservas');
const totalPagarEl = document.getElementById('totalPagar');
const btnVaciar = document.getElementById('vaciar');
const loader = document.getElementById('loader');
const estadoCarga = document.getElementById('estadoCarga');

// ================================
// Utilidades UI (Toast/Alert)
// ================================
const toast = (texto) => {
Toastify({ text: texto, duration: 2000, gravity: 'bottom', position: 'right' }).showToast();
};


const alerta = (titulo, texto, icono = 'info') => {
return Swal.fire({ title: titulo, text: texto, icon: icono, confirmButtonText: 'OK' });
};

// ================================
// Carga remota de datos (fetch)
// ================================
async function cargarPeliculas() {
try {
loader.style.display = 'inline-block';
estadoCarga.textContent = 'Cargando cartelera...';


const resp = await fetch(ENDPOINT_PELICULAS);
if (!resp.ok) throw new Error('No se pudo cargar la cartelera');
catalogo = await resp.json();


poblarSelect(catalogo);
estadoCarga.textContent = 'Cartelera actualizada';
} catch (err) {
await alerta('Error', 'Hubo un problema al cargar las películas. Intenta recargar la página.', 'error');
} finally {
loader.style.display = 'none';
setTimeout(() => (estadoCarga.textContent = ''), 1500);
}
}


function poblarSelect(items) {
selectPelicula.innerHTML = '<option value="" disabled selected>Seleccioná una opción</option>';
items.forEach((p) => {
const opt = document.createElement('option');
opt.value = p.id; // guardamos id
opt.textContent = `${p.titulo} ( $${p.precio} )`;
selectPelicula.appendChild(opt);
});
}

// ================================
// Lógica de negocio: Reservas
// ================================
function calcularTotalReserva(precioUnitario, cantidad) {
return precioUnitario * cantidad;
}


function totalGeneral() {
return reservas.reduce((acc, r) => acc + r.total, 0);
}


function persistir() {
localStorage.setItem('reservas', JSON.stringify(reservas));
}


function renderizarReservas() {
listaReservas.innerHTML = '';


if (reservas.length === 0) {
const li = document.createElement('li');
li.className = 'list-group-item';
li.textContent = 'No hay reservas todavía.';
listaReservas.appendChild(li);
} else {
reservas.forEach((r, index) => {
const li = document.createElement('li');
li.className = 'list-group-item d-flex justify-content-between align-items-center';
li.innerHTML = `
<div>
<strong>${r.pelicula}</strong>
<span class="badge bg-secondary badge-precio ms-2">$${r.precio} c/u</span>
<div class="small text-muted">${r.cantidad} entradas</div>
<div><strong>Total:</strong> $${r.total}</div>
</div>
<div>
<button class="btn btn-sm btn-danger" data-index="${index}">Eliminar</button>
</div>
`;
listaReservas.appendChild(li);
});
}
totalPagarEl.textContent = `$${totalGeneral()}`;
}
function eliminarReserva(index) {
reservas.splice(index, 1);
persistir();
renderizarReservas();
toast('Reserva eliminada');
}


// Delegación de evento para botones Eliminar
listaReservas.addEventListener('click', (e) => {
if (e.target.matches('button.btn-danger')) {
const index = Number(e.target.getAttribute('data-index'));
eliminarReserva(index);
}
});
// ================================
// Manejo del formulario
// ================================
formulario.addEventListener('submit', async (e) => {
e.preventDefault();


const idSeleccionado = Number(selectPelicula.value);
const cantidad = Number(inputCantidad.value);


if (!idSeleccionado) {
toast('Seleccioná una película');
return;
}
if (!cantidad || cantidad < 1) {
toast('Ingresá una cantidad válida');
return;
}


const peli = catalogo.find((p) => p.id === idSeleccionado);
if (!peli) {
await alerta('Error', 'Película no encontrada en el catálogo', 'error');
return;
}


const total = calcularTotalReserva(peli.precio, cantidad);
const nueva = { pelicula: peli.titulo, precio: peli.precio, cantidad, total };


const confirm = await Swal.fire({
title: 'Confirmar reserva',
html: `\n <p><strong>${peli.titulo}</strong></p>\n <p>${cantidad} entradas x $${peli.precio}</p>\n <p><strong>Total:</strong> $${total}</p>\n `,
icon: 'question',
showCancelButton: true,
confirmButtonText: 'Confirmar',
cancelButtonText: 'Cancelar'
});


if (confirm.isConfirmed) {
reservas.push(nueva);
persistir();
renderizarReservas();
formulario.reset();
toast('Reserva confirmada ✅');
}
});
// Vaciar todas las reservas
btnVaciar.addEventListener('click', async () => {
if (reservas.length === 0) { toast('No hay reservas'); return; }


const res = await Swal.fire({
title: 'Vaciar reservas',
text: 'Esta acción eliminará todas las reservas guardadas',
icon: 'warning',
showCancelButton: true,
confirmButtonText: 'Sí, vaciar',
cancelButtonText: 'Cancelar'
});


if (res.isConfirmed) {
reservas = [];
persistir();
renderizarReservas();
toast('Reservas vaciadas');
}
});

// ================================
// Inicio
// ================================
renderizarReservas();
cargarPeliculas();
