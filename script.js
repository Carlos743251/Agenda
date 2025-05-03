const formulario = document.getElementById("formulario");
const listaTareasActivas = document.getElementById("listaTareasActivas");
const listaTareasCompletadas = document.getElementById("listaTareasCompletadas");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

formulario.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("tarea").value;
  const fecha = document.getElementById("fecha").value;
  if (!nombre || !fecha) return;

  const nueva = {
    id: Date.now(),
    nombre,
    fecha,
    completada: false
  };
  tareas.push(nueva);
  guardarYMostrar();
  formulario.reset();
});

function calcularDiasRestantes(fecha) {
  const hoy = new Date();
  const objetivo = new Date(fecha);
  const diferencia = objetivo - hoy;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

function crearElemento(tarea) {
  const li = document.createElement("li");
  const label = document.createElement("label");
  label.className = "checkbox-wrapper-4";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "inp-cbx";
  input.checked = tarea.completada;

  const cbx = document.createElement("span");
  cbx.className = "cbx";
  cbx.innerHTML = `<span></span><span>${tarea.nombre}<br>${tarea.fecha} - ${calcularDiasRestantes(tarea.fecha)} días restantes</span>`;

  input.addEventListener("change", () => {
    tarea.completada = input.checked;
    guardarYMostrar();
  });

  label.appendChild(input);
  label.appendChild(cbx);
  li.appendChild(label);

  return li;
}

function guardarYMostrar() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
  listaTareasActivas.innerHTML = "";
  listaTareasCompletadas.innerHTML = "";

  tareas
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .forEach(tarea => {
      const elemento = crearElemento(tarea);
      if (tarea.completada) {
        elemento.style.textDecoration = "underline";
        listaTareasCompletadas.appendChild(elemento);
      } else {
        listaTareasActivas.appendChild(elemento);
      }
    });
}

guardarYMostrar();

const btnEliminar = document.getElementById("eliminarCompletadas");

btnEliminar.addEventListener("click", () => {
  if (confirm("¿Estás seguro de que deseas eliminar todas las tareas completadas?")) {
    tareas = tareas.filter(t => !t.completada);
    guardarYMostrar();
  }
});
