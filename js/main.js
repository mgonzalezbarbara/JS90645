// Constantes y arrays
const PRECIO_ENTRADA = 1500;
const peliculas = ["Avengers", "Spiderman", "Inside Out 2", "El Conjuro"];

// Función para mostrar las películas y dejar elegir una
function elegirPelicula() {
  let mensaje = "¿Qué película querés ver?\n";
  peliculas.forEach((peli, index) => {
    mensaje += `${index + 1}. ${peli}\n`;
  });

  let opcion = parseInt(prompt(mensaje));
  if (opcion >= 1 && opcion <= peliculas.length) {
    return peliculas[opcion - 1];
  } else {
    alert("Opción no válida. Se canceló la reserva.");
    return null;
  }
}

// Función para pedir cantidad de entradas
function pedirEntradas() {
  let cantidad = parseInt(prompt("¿Cuántas entradas querés comprar?"));
  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Cantidad inválida. Se canceló la reserva.");
    return null;
  }
  return cantidad;
}

// Función principal
function simuladorCine() {
  alert("¡Bienvenido/a al simulador de entradas al cine!");

  const deseaContinuar = confirm("¿Querés hacer una reserva?");
  if (!deseaContinuar) {
    alert("Hasta luego 👋");
    return;
  }

  const peliculaElegida = elegirPelicula();
  if (!peliculaElegida) return;

  const cantidadEntradas = pedirEntradas();
  if (!cantidadEntradas) return;

  const total = cantidadEntradas * PRECIO_ENTRADA;
  alert(`Elegiste "${peliculaElegida}" y compraste ${cantidadEntradas} entradas.\nTotal a pagar: $${total}`);
  console.log(`Película: ${peliculaElegida}`);
  console.log(`Entradas: ${cantidadEntradas}`);
  console.log(`Total: $${total}`);
}

// Iniciar simulador
simuladorCine();




