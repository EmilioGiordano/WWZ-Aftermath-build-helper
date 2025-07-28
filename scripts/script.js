const container = document.getElementById('perks-container');
const titleDiv = document.getElementById('perk-title');
const textDiv = document.getElementById('perk-text');
const classTitle = document.getElementById('class-title');
const classButtons = document.querySelectorAll('.class-btn');
const layoutButtons = document.querySelectorAll('.layout-btn');
let selectedClass = 'exterminator';
let currentLayout = 'grid';

// Initialize perk renderer
let perkRenderer;

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
      if (perkRenderer) {
        perkRenderer.render(perks, currentLayout);
      }
    });
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  perkRenderer = new PerkRenderer(container, titleDiv, textDiv);
});

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
    
    // Notify other components of class change
    document.dispatchEvent(new CustomEvent('classChanged', { 
      detail: { className: classname } 
    }));
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
    if (perkRenderer) {
      perkRenderer.setLayout(layout);
    }
    renderPerks(selectedClass);
  });
});

updateSelectedButton(selectedClass);
updateLayoutButtons(currentLayout);
renderPerks(selectedClass);