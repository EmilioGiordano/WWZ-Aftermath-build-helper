const container = document.getElementById('perks-container');
const titleDiv = document.getElementById('perk-title');
const textDiv = document.getElementById('perk-text');
const classTitle = document.getElementById('class-title');
const classButtons = document.querySelectorAll('.class-btn');
let selectedClass = 'exterminator';

function renderPerks(classname) {
  fetch('perks.json')
    .then(res => res.json())
    .then(data => {
      const perks = data[classname];
      container.innerHTML = '';
      const grid = Array.from({ length: 4 }, () => Array(13).fill(null));
      
      perks.forEach(perk => {
        const col = perk.column - 1;
        const row = perk.row - 1;
        if (col >= 0 && col < 13 && row >= 0 && row < 4) {
          grid[row][col] = perk;
        }
      });
      
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 13; col++) {
          const perk = grid[row][col];
          const cell = document.createElement('div');
          
          if (perk) {
            cell.className = `perk-circle ${perk.type.toLowerCase() === 'red' ? 'perk-red' : 'perk-gray'}`;
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'perk-icon';
            cell.appendChild(iconDiv);
            
            cell.addEventListener('mouseenter', () => {
              titleDiv.textContent = perk.name;
              textDiv.textContent = perk.description;
            });
            cell.addEventListener('mouseleave', () => {
              titleDiv.textContent = '';
              textDiv.textContent = '';
            });
          } else {
            cell.className = 'perk-empty';
          }
          container.appendChild(cell);
        }
      }
    });
}

function updateSelectedButton(classname) {
  classButtons.forEach(btn => {
    if (btn.dataset.class === classname) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

classButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const classname = btn.dataset.class;
    selectedClass = classname;
    updateSelectedButton(classname);
    renderPerks(classname);
    classTitle.textContent = classname.toUpperCase();
  });
});

updateSelectedButton(selectedClass);
renderPerks(selectedClass);