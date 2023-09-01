// Initializar socket.io
const socketIo = io();

// Agregar la clase disabled al botón de la página anterior si es la primera página
document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("previous-page");
  if (
    !localStorage.getItem("currentPage") ||
    localStorage.getItem("currentPage") === "1"
  ) {
    element.classList.add("disabled");
  } else if (localStorage.getItem("currentPage") === "4") {
    const element = document.getElementById("next-page");
    element.classList.add("disabled");
  }
});

// Agregar la clase active al elemento de la pagina actual
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = localStorage.getItem("currentPage");
  const elements = document.querySelectorAll(`li[data-page]`);
  elements.forEach((element) => {
    if (element.dataset.page === currentPage) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  });
  if (!currentPage && elements.length > 0) {
    elements[0].classList.add("active");
    localStorage.setItem("currentPage", elements[0].dataset.page);
  }
});

//Paginación de navegación
const pagination = (page, api) => {
  if (page) {
    let currentPage = localStorage.setItem("currentPage", page);
  }
  return (window.location.href = `${api}=${page}`);
};

//Paginación botón anterior
const previousPage = (api) => {
  let currentPage = localStorage.getItem("currentPage");
  currentPage = parseInt(currentPage);
  if (currentPage > 1) {
    currentPage -= 1;
  }
  const result = localStorage.setItem("currentPage", currentPage);
  return (window.location.href = `/api/${api}=${currentPage}`);
};

//Paginación botón siguiente
const nextPage = (api) => {
  let currentPage = localStorage.getItem("currentPage");
  currentPage = parseInt(currentPage);
  if (currentPage < 4) {
    currentPage += 1;
  }

  const result = localStorage.setItem("currentPage", currentPage);
  return (window.location.href = `${api}=${currentPage}`);
};
