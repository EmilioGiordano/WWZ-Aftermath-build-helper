const container = document.getElementById('perks-container');
const titleDiv = document.getElementById('perk-title');
const textDiv = document.getElementById('perk-text');
const classTitle = document.getElementById('class-title');
const classButtons = document.querySelectorAll('.class-btn');
const layoutButtons = document.querySelectorAll('.layout-btn');
let selectedClass = 'exterminator';
let currentLayout = 'grid';

// Vertical layout configuration for each class
const verticalLayoutConfig = {
  exterminator: {
    gridSize: { columns: 3, rows: 16 },
    // Define custom positions by perk name or by original position
    customPositions: {
      // Example: Map perks by their original grid position to new vertical position
      // Format: "originalRow-originalCol": { column: newCol, row: newRow }
      "1-1": { column: 1, row: 1 },   // First red perk
      "1-4": { column: 2, row: 1 },   // Second red perk  
      "1-7": { column: 3, row: 1 },   // Third red perk
      "1-10": { column: 1, row: 6 },  // Fourth red perk
      // You can define specific positions for any perk
      // If not defined, it will use automatic placement
    }
  }
};

// Alternative: Use perk names for more precise control
const verticalLayoutByName = {
  exterminator: {
    "Gunslinger": { column: 1, row: 1 },
    "Hellraiser": { column: 2, row: 1 },
    "Medic": { column: 3, row: 1 }
    // Add more specific perk positions as needed
  }
};

function renderPerks(classname) {
  fetch('perks.json')
    .then(res => res.json())
    .then(data => {
      const perks = data[classname];
      container.innerHTML = '';
      
      // Apply layout class
      container.className = `layout-${currentLayout}`;
      
      if (currentLayout === 'grid') {
        renderGridLayout(perks);
      } else if (currentLayout === 'vertical') {
        renderVerticalLayout(perks);
      }
    });
}

function renderGridLayout(perks) {
  // Original grid layout
  container.style.gridTemplateColumns = 'repeat(13, 60px)';
  container.style.gridTemplateRows = 'repeat(4, 60px)';
  
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
      const cell = createPerkCell(perk);
      container.appendChild(cell);
    }
  }
}

function renderVerticalLayout(perks) {
  // Set vertical grid layout (3 columns, 16 rows)
  container.style.gridTemplateColumns = 'repeat(3, 60px)';
  container.style.gridTemplateRows = 'repeat(16, 60px)';
  
  // Create 16x3 grid (16 rows, 3 columns)
  const verticalGrid = Array.from({ length: 16 }, () => Array(3).fill(null));
  
  // Separate red and gray perks
  const redPerks = perks.filter(perk => perk.type.toLowerCase() === 'red');
  const grayPerks = perks.filter(perk => perk.type.toLowerCase() === 'gray');
  
  // Place red perks in horizontal rows (rows 0, 5, 10, 15)
  const redRows = [0, 5, 10, 15];
  redPerks.forEach((perk, index) => {
    const rowIndex = redRows[Math.floor(index / 3)];
    const colIndex = index % 3;
    if (rowIndex < 16 && colIndex < 3) {
      verticalGrid[rowIndex][colIndex] = perk;
    }
  });
  
  // Place gray perks in remaining positions, maintaining original relative order
  let grayIndex = 0;
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 3; col++) {
      // Skip positions already occupied by red perks
      if (verticalGrid[row][col] === null && grayIndex < grayPerks.length) {
        verticalGrid[row][col] = grayPerks[grayIndex];
        grayIndex++;
      }
    }
  }
  
  // Render the vertical grid
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 3; col++) {
      const perk = verticalGrid[row][col];
      const cell = createPerkCell(perk);
      container.appendChild(cell);
    }
  }
}

function createPerkCell(perk) {
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
  
  return cell;
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

// Layout switcher functionality
function updateLayoutButtons(layout) {
  layoutButtons.forEach(btn => {
    if (btn.dataset.layout === layout) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

layoutButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const layout = btn.dataset.layout;
    currentLayout = layout;
    updateLayoutButtons(layout);
    renderPerks(selectedClass);
  });
});

updateSelectedButton(selectedClass);
updateLayoutButtons(currentLayout);
renderPerks(selectedClass);