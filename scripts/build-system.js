// Build System Module
class BuildSystem {
  constructor() {
    this.currentBuild = null;
    this.builds = {};
    this.isCreationMode = false;
    this.buildInCreation = {}; // Object storing selected perks by column
    this.loadBuilds();
  }

  // Load predefined builds
  loadBuilds() {
    this.builds = {
      exterminator: {
        "Fire Claymore": [1, 2, 4, 3, 3, 1, 4, 2, 4], // 9 elementos para columnas [2,3,4,6,7,8,10,11,12]
        "Tank Build": [1, 3, 2, 4, 2, 2, 3, 1, 3],
        "DPS Build": [2, 1, 3, 2, 4, 3, 1, 4, 2],
        "Support Build": [3, 2, 1, 4, 3, 2, 1, 3, 2],
        "Crowd Control": [4, 3, 2, 1, 4, 3, 2, 1, 4]
      },
      gunslinger: {
        "Assault Build": [1, 2, 1, 3, 2, 1, 3, 2, 4],
        "Sniper Build": [2, 1, 4, 1, 3, 2, 1, 4, 2],
        "Run & Gun": [3, 2, 1, 4, 2, 3, 4, 1, 3],
        "Support DPS": [2, 3, 4, 1, 2, 4, 3, 2, 1]
      },
      hellraiser: {
        "Explosives Build": [1, 3, 2, 4, 1, 2, 3, 1, 4],
        "Demolition": [4, 2, 3, 1, 4, 2, 1, 3, 2],
        "Area Control": [2, 4, 1, 3, 2, 4, 1, 2, 3],
        "Breach Expert": [3, 1, 4, 2, 3, 1, 2, 4, 1]
      },
      medic: {
        "Combat Medic": [1, 3, 2, 4, 1, 3, 2, 4, 1],
        "Field Doctor": [2, 4, 1, 3, 2, 4, 1, 3, 2],
        "Support Healer": [3, 1, 4, 2, 3, 1, 4, 2, 3]
      },
      fixer: {
        "Ammo Support": [2, 3, 1, 4, 2, 3, 1, 4, 2],
        "Equipment Master": [1, 4, 2, 3, 1, 4, 2, 3, 1],
        "Resource Manager": [3, 2, 4, 1, 3, 2, 4, 1, 3]
      }
    };
  }

  // Check if a perk should be selected based on current build or creation mode
  isPerkSelected(perk) {
    if (perk.type.toLowerCase() !== 'gray') return false;
    
    const column = perk.column;
    const row = perk.row;
    
    // In creation mode, check buildInCreation
    if (this.isCreationMode) {
      return this.buildInCreation[column] === row;
    }
    
    // In view mode, check currentBuild
    if (!this.currentBuild) return false;
    const grayColumns = this.getGrayColumns();
    const columnIndex = grayColumns.indexOf(column);
    if (columnIndex === -1) return false; // This column doesn't have gray perks
    const buildSelection = this.currentBuild[columnIndex];
    return row === buildSelection;
  }

  // Apply a build to the current class
  applyBuild(buildArray) {
    this.currentBuild = buildArray;
    // Trigger re-render through event
    document.dispatchEvent(new CustomEvent('buildChanged', { 
      detail: { build: buildArray } 
    }));
  }

  // Apply a predefined build by name
  applyNamedBuild(className, buildName) {
    if (this.builds[className] && this.builds[className][buildName]) {
      this.applyBuild(this.builds[className][buildName]);
      return true;
    }
    return false;
  }

  // Clear current build
  clearBuild() {
    this.currentBuild = null;
    document.dispatchEvent(new CustomEvent('buildChanged', { 
      detail: { build: null } 
    }));
  }

  // Get current build
  getCurrentBuild() {
    return this.currentBuild;
  }

  // Get available builds for a class
  getBuildsForClass(className) {
    return this.builds[className] || {};
  }

  // Get all builds
  getAllBuilds() {
    return this.builds;
  }

  // Add a new build
  addBuild(className, buildName, buildArray) {
    if (!this.builds[className]) {
      this.builds[className] = {};
    }
    this.builds[className][buildName] = buildArray;
  }

  // Remove a build
  removeBuild(className, buildName) {
    if (this.builds[className] && this.builds[className][buildName]) {
      delete this.builds[className][buildName];
      return true;
    }
    return false;
  }

  // Validate build array (should have 9 elements for gray perks)
  validateBuild(buildArray) {
    if (!Array.isArray(buildArray)) return false;
    const grayColumns = this.getGrayColumns();
    if (buildArray.length !== grayColumns.length) return false;
    return buildArray.every(val => val >= 1 && val <= 4 && Number.isInteger(val));
  }

  // Get gray perks organized by column
  getGrayPerksByColumn(perks) {
    const columns = {};
    perks.filter(perk => perk.type.toLowerCase() === 'gray').forEach(perk => {
      if (!columns[perk.column]) {
        columns[perk.column] = [];
      }
      columns[perk.column].push(perk);
    });
    return columns;
  }

  // Creation mode functions
  startCreationMode() {
    this.isCreationMode = true;
    this.buildInCreation = {};
    this.currentBuild = null;
    document.dispatchEvent(new CustomEvent('creationModeChanged', { 
      detail: { isCreationMode: true } 
    }));
  }

  exitCreationMode() {
    this.isCreationMode = false;
    this.buildInCreation = {};
    document.dispatchEvent(new CustomEvent('creationModeChanged', { 
      detail: { isCreationMode: false } 
    }));
  }

  // Toggle perk selection in creation mode
  togglePerkSelection(perk) {
    if (!this.isCreationMode || perk.type.toLowerCase() !== 'gray') return false;
    
    const column = perk.column;
    const row = perk.row;
    
    // If this perk is already selected, deselect it
    if (this.buildInCreation[column] === row) {
      delete this.buildInCreation[column];
    } else {
      // Select this perk (deselecting any other in the same column)
      this.buildInCreation[column] = row;
    }
    
    document.dispatchEvent(new CustomEvent('buildChanged', { 
      detail: { build: this.getCurrentBuildArray() } 
    }));
    
    return true;
  }

  // Get current build as array format (only for gray perk columns)
  getCurrentBuildArray() {
    if (!this.isCreationMode) return this.currentBuild;
    
    const buildArray = [];
    // Only include columns that have gray perks
    const grayColumns = this.getGrayColumns();
    for (const col of grayColumns) {
      buildArray.push(this.buildInCreation[col] || null);
    }
    return buildArray;
  }

  // Get columns that contain gray perks
  getGrayColumns() {
    // For now, return the known gray perk columns based on the JSON structure
    // This could be made dynamic by analyzing the current class's perks
    return [2, 3, 4, 6, 7, 8, 10, 11, 12]; // These are the columns with gray perks
  }

  // Check if build is complete (all gray perk columns selected)
  isBuildComplete() {
    if (!this.isCreationMode) return false;
    const grayColumns = this.getGrayColumns();
    return grayColumns.every(col => this.buildInCreation[col] !== undefined);
  }

  // Save the current build in creation
  saveBuildInCreation(className, buildName) {
    if (!this.isCreationMode || !this.isBuildComplete()) return false;
    
    const buildArray = this.getCurrentBuildArray();
    this.addBuild(className, buildName, buildArray);
    this.exitCreationMode();
    return true;
  }

  // Get creation mode status
  getCreationModeStatus() {
    const grayColumns = this.getGrayColumns();
    return {
      isCreationMode: this.isCreationMode,
      selectedColumns: Object.keys(this.buildInCreation).length,
      totalColumns: grayColumns.length,
      isComplete: this.isBuildComplete(),
      buildArray: this.getCurrentBuildArray()
    };
  }
}

// Create global instance
window.buildSystem = new BuildSystem();