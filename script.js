const selector = document.getElementById('class-selector');
const container = document.getElementById('perks-container');
const titleDiv = document.getElementById('perk-title');
const textDiv = document.getElementById('perk-text');
const classButtons = document.querySelectorAll('.class-btn');
let selectedClass = 'exterminator'; // Por defecto

function renderPerks(className) {
  fetch('perks.json')
    .then(res => res.json())
    .then(data => {
      const perks = data[className];
      // Limpia el contenedor antes de renderizar
      container.innerHTML = '';
      // Crear una matriz vacía de 4 filas x 13 columnas
      const grid = Array.from({ length: 4 }, () => Array(13).fill(null));
      // Ubicar cada perk en su posición
      perks.forEach(perk => {
        const col = perk.column - 1;
        const row = perk.row - 1;
        if (col >= 0 && col < 13 && row >= 0 && row < 4) {
          grid[row][col] = perk;
        }
      });
      // Renderizar la grilla
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 13; col++) {
          const perk = grid[row][col];
          const cell = document.createElement('div');
          if (perk) {
            cell.className = `flex items-center justify-center rounded-full w-20 h-20 text-center font-semibold text-white shadow-lg border-4 mb-2 cursor-pointer ${perk.type.toLowerCase() === 'red' ? 'bg-red-700 border-red-900' : 'bg-gray-500 border-gray-700'}`;
            cell.textContent = perk.name;
            cell.addEventListener('mouseenter', () => {
              titleDiv.textContent = perk.name;
              textDiv.textContent = perk.description;
            });
            cell.addEventListener('mouseleave', () => {
              titleDiv.textContent = '';
              textDiv.textContent = '';
            });
          } else {
            cell.className = 'w-20 h-20'; // Espacio vacío
          }
          container.appendChild(cell);
        }
      }
    });
}

function updateSelectedButton(className) {
  classButtons.forEach(btn => {
    if (btn.dataset.class === className) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

classButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const className = btn.dataset.class;
    selectedClass = className;
    updateSelectedButton(className);
    renderPerks(className);
    document.querySelector('h1').textContent = `Perks de ${className.charAt(0).toUpperCase() + className.slice(1)}`;
  });
});

// Inicializar selección y perks
updateSelectedButton(selectedClass);
renderPerks(selectedClass);