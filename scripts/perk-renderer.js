// Perk Renderer Module
class PerkRenderer {
  constructor(container, titleDiv, textDiv) {
    this.container = container;
    this.titleDiv = titleDiv;
    this.textDiv = textDiv;
    this.currentLayout = 'grid';
    
    // Listen for build changes
    document.addEventListener('buildChanged', () => {
      // Re-render current perks to update selection indicators
      if (this.lastRenderedPerks) {
        this.render(this.lastRenderedPerks, this.currentLayout);
      }
    });
  }

  setLayout(layout) {
    this.currentLayout = layout;
  }

  render(perks, layout = null) {
    if (layout) this.currentLayout = layout;
    this.lastRenderedPerks = perks;
    
    this.container.innerHTML = '';
    this.container.className = `layout-${this.currentLayout}`;
    
    if (this.currentLayout === 'grid') {
      this.renderGridLayout(perks);
    } else if (this.currentLayout === 'vertical') {
      this.renderVerticalLayout(perks);
    }
  }

  renderGridLayout(perks) {
    this.container.style.gridTemplateColumns = 'repeat(13, 60px)';
    this.container.style.gridTemplateRows = 'repeat(4, 60px)';
    
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
        const cell = this.createPerkCell(perk);
        this.container.appendChild(cell);
      }
    }
  }

  renderVerticalLayout(perks) {
    this.container.style.gridTemplateColumns = 'repeat(3, 60px)';
    this.container.style.gridTemplateRows = 'repeat(16, 60px)';
    
    const verticalGrid = Array.from({ length: 16 }, () => Array(3).fill(null));
    
    const redPerks = perks.filter(perk => perk.type.toLowerCase() === 'red');
    const grayPerks = perks.filter(perk => perk.type.toLowerCase() === 'gray');
    
    const redRows = [0, 5, 10, 15];
    redPerks.forEach((perk, index) => {
      const rowIndex = redRows[Math.floor(index / 3)];
      const colIndex = index % 3;
      if (rowIndex < 16 && colIndex < 3) {
        verticalGrid[rowIndex][colIndex] = perk;
      }
    });
    
    let grayIndex = 0;
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 3; col++) {
        if (verticalGrid[row][col] === null && grayIndex < grayPerks.length) {
          verticalGrid[row][col] = grayPerks[grayIndex];
          grayIndex++;
        }
      }
    }
    
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 3; col++) {
        const perk = verticalGrid[row][col];
        const cell = this.createPerkCell(perk);
        this.container.appendChild(cell);
      }
    }
  }

  createPerkCell(perk) {
    const cell = document.createElement('div');
    
    if (perk) {
      cell.className = `perk-circle ${perk.type.toLowerCase() === 'red' ? 'perk-red' : 'perk-gray'}`;
      
      // Store perk data for easy access
      cell.perkData = perk;
      
      // Check if this perk should be selected based on current build
      if (window.buildSystem && window.buildSystem.isPerkSelected(perk)) {
        cell.classList.add('perk-selected');
      }
      
      const iconDiv = document.createElement('div');
      iconDiv.className = 'perk-icon';
      cell.appendChild(iconDiv);
      
      cell.addEventListener('mouseenter', () => {
        this.titleDiv.textContent = perk.name;
        this.textDiv.textContent = perk.description;
      });
      
      cell.addEventListener('mouseleave', () => {
        this.titleDiv.textContent = '';
        this.textDiv.textContent = '';
      });

      // Add click handler for gray perks in creation mode
      if (perk.type.toLowerCase() === 'gray') {
        cell.addEventListener('click', () => {
          if (window.buildSystem && window.buildSystem.isCreationMode) {
            const wasToggled = window.buildSystem.togglePerkSelection(perk);
            if (wasToggled) {
              // Update visual selection immediately
              this.updatePerkSelection(cell, perk);
            }
          }
        });
        
        // Add hover effects for creation mode
        cell.addEventListener('mouseenter', () => {
          if (window.buildSystem && window.buildSystem.isCreationMode) {
            cell.style.cursor = 'pointer';
            cell.style.transform = 'scale(1.05)';
          }
        });
        
        cell.addEventListener('mouseleave', () => {
          if (window.buildSystem && window.buildSystem.isCreationMode) {
            cell.style.cursor = '';
            cell.style.transform = '';
          }
        });
      }
    } else {
      cell.className = 'perk-empty';
    }
    
    return cell;
  }

  // Update perk selection visual state
  updatePerkSelection(cell, perk) {
    if (window.buildSystem && window.buildSystem.isPerkSelected(perk)) {
      cell.classList.add('perk-selected');
    } else {
      cell.classList.remove('perk-selected');
    }
  }

  // Update all perk selections (used when switching modes)
  updateAllPerkSelections() {
    const perkCells = this.container.querySelectorAll('.perk-circle');
    perkCells.forEach((cell) => {
      if (cell.perkData) {
        this.updatePerkSelection(cell, cell.perkData);
      }
    });
  }
}

// Export for use in main script
window.PerkRenderer = PerkRenderer;