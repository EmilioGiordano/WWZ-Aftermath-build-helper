const selector = document.getElementById('class-selector');
const container = document.getElementById('perks-container');
const titleDiv = document.getElementById('perk-title');
const textDiv = document.getElementById('perk-text');

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

// Evento para cambiar de clase
selector.addEventListener('change', (e) => {
  renderPerks(e.target.value);
});

// Renderiza la clase seleccionada por defecto al cargar
renderPerks(selector.value);