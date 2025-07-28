// Build UI Module - Controls for build selection
class BuildUI {
  constructor() {
    this.createBuildControls();
    this.setupEventListeners();
  }

  createBuildControls() {
    // Create build controls container
    const buildControls = document.createElement('div');
    buildControls.id = 'build-controls';
    buildControls.className = 'build-controls';
    
    // Create build selector dropdown
    const buildSelector = document.createElement('select');
    buildSelector.id = 'build-selector';
    buildSelector.className = 'build-selector';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Build';
    buildSelector.appendChild(defaultOption);
    
    // Create clear build button
    const clearButton = document.createElement('button');
    clearButton.id = 'clear-build';
    clearButton.className = 'clear-build-btn';
    clearButton.textContent = 'Clear Build';

    // Create creation mode toggle button
    const createButton = document.createElement('button');
    createButton.id = 'create-build';
    createButton.className = 'create-build-btn';
    createButton.textContent = 'Create Build';
    
    // Create custom build input
    const customBuildContainer = document.createElement('div');
    customBuildContainer.className = 'custom-build-container';
    
    const customBuildInput = document.createElement('input');
    customBuildInput.id = 'custom-build-input';
    customBuildInput.type = 'text';
    customBuildInput.placeholder = 'Enter build array: [1,2,4,3,3,1,4,2,4]';
    customBuildInput.className = 'custom-build-input';
    
    const applyCustomButton = document.createElement('button');
    applyCustomButton.id = 'apply-custom-build';
    applyCustomButton.className = 'apply-custom-btn';
    applyCustomButton.textContent = 'Apply Custom Build';
    
    customBuildContainer.appendChild(customBuildInput);
    customBuildContainer.appendChild(applyCustomButton);
    
    // Create save build container (initially hidden)
    const saveBuildContainer = document.createElement('div');
    saveBuildContainer.id = 'save-build-container';
    saveBuildContainer.className = 'save-build-container hidden';
    
    const buildNameInput = document.createElement('input');
    buildNameInput.id = 'build-name-input';
    buildNameInput.type = 'text';
    buildNameInput.placeholder = 'Enter build name';
    buildNameInput.className = 'build-name-input';
    
    const saveBuildButton = document.createElement('button');
    saveBuildButton.id = 'save-build';
    saveBuildButton.className = 'save-build-btn';
    saveBuildButton.textContent = 'Save Build';
    
    const cancelBuildButton = document.createElement('button');
    cancelBuildButton.id = 'cancel-build';
    cancelBuildButton.className = 'cancel-build-btn';
    cancelBuildButton.textContent = 'Cancel';
    
    saveBuildContainer.appendChild(buildNameInput);
    saveBuildContainer.appendChild(saveBuildButton);
    saveBuildContainer.appendChild(cancelBuildButton);

    // Create progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.id = 'build-progress';
    progressIndicator.className = 'build-progress hidden';

    buildControls.appendChild(buildSelector);
    buildControls.appendChild(createButton);
    buildControls.appendChild(clearButton);
    buildControls.appendChild(saveBuildContainer);
    buildControls.appendChild(progressIndicator);
    buildControls.appendChild(customBuildContainer);
    
    // Insert controls after the layout switcher
    const layoutSwitcher = document.querySelector('.layout-switcher');
    if (layoutSwitcher) {
      layoutSwitcher.parentNode.insertBefore(buildControls, layoutSwitcher.nextSibling);
    }
  }

  setupEventListeners() {
    // Build selector change
    document.getElementById('build-selector').addEventListener('change', (e) => {
      const [className, buildName] = e.target.value.split('|');
      if (className && buildName) {
        window.buildSystem.applyNamedBuild(className, buildName);
      }
    });

    // Clear build button
    document.getElementById('clear-build').addEventListener('click', () => {
      window.buildSystem.clearBuild();
      document.getElementById('build-selector').value = '';
      document.getElementById('custom-build-input').value = '';
    });

    // Apply custom build button
    document.getElementById('apply-custom-build').addEventListener('click', () => {
      const input = document.getElementById('custom-build-input');
      try {
        const buildArray = JSON.parse(input.value);
        if (window.buildSystem.validateBuild(buildArray)) {
          window.buildSystem.applyBuild(buildArray);
          document.getElementById('build-selector').value = '';
        } else {
          alert('Invalid build format. Use array of 9 integers between 1-4: [1,2,4,3,3,1,4,2,4]');
        }
      } catch (e) {
        alert('Invalid JSON format. Use: [1,2,4,3,3,1,4,2,4]');
      }
    });

    // Create build button
    document.getElementById('create-build').addEventListener('click', () => {
      if (window.buildSystem.isCreationMode) {
        window.buildSystem.exitCreationMode();
      } else {
        window.buildSystem.startCreationMode();
      }
    });

    // Save build button
    document.getElementById('save-build').addEventListener('click', () => {
      const buildName = document.getElementById('build-name-input').value.trim();
      if (!buildName) {
        alert('Please enter a build name');
        return;
      }
      
      // Get current class name from title
      const classTitle = document.getElementById('class-title');
      const className = classTitle ? classTitle.textContent.toLowerCase() : 'exterminator';
      
      if (window.buildSystem.saveBuildInCreation(className, buildName)) {
        alert('Build saved successfully!');
        this.updateBuildOptions(className);
        document.getElementById('build-name-input').value = '';
      } else {
        alert('Please complete the build first (select one perk from each column)');
      }
    });

    // Cancel build button
    document.getElementById('cancel-build').addEventListener('click', () => {
      window.buildSystem.exitCreationMode();
      document.getElementById('build-name-input').value = '';
    });

    // Listen for creation mode changes
    document.addEventListener('creationModeChanged', (e) => {
      this.updateCreationModeUI(e.detail.isCreationMode);
    });

    // Listen for build changes to update progress
    document.addEventListener('buildChanged', () => {
      this.updateProgressIndicator();
    });

    // Listen for class changes to update build options
    document.addEventListener('classChanged', (e) => {
      this.updateBuildOptions(e.detail.className);
    });
  }

  updateBuildOptions(className) {
    const selector = document.getElementById('build-selector');
    
    // Clear existing options except default
    while (selector.children.length > 1) {
      selector.removeChild(selector.lastChild);
    }
    
    // Add builds for current class
    const builds = window.buildSystem.getBuildsForClass(className);
    Object.keys(builds).forEach(buildName => {
      const option = document.createElement('option');
      option.value = `${className}|${buildName}`;
      option.textContent = buildName;
      selector.appendChild(option);
    });
  }

  // Update creation mode UI
  updateCreationModeUI(isCreationMode) {
    const createButton = document.getElementById('create-build');
    const saveBuildContainer = document.getElementById('save-build-container');
    const progressIndicator = document.getElementById('build-progress');
    const buildSelector = document.getElementById('build-selector');
    const customBuildContainer = document.querySelector('.custom-build-container');

    if (isCreationMode) {
      createButton.textContent = 'Exit Creation';
      createButton.className = 'create-build-btn active';
      saveBuildContainer.classList.remove('hidden');
      progressIndicator.classList.remove('hidden');
      buildSelector.disabled = true;
      customBuildContainer.style.display = 'none';
      
      // Update progress
      this.updateProgressIndicator();
    } else {
      createButton.textContent = 'Create Build';
      createButton.className = 'create-build-btn';
      saveBuildContainer.classList.add('hidden');
      progressIndicator.classList.add('hidden');
      buildSelector.disabled = false;
      customBuildContainer.style.display = 'flex';
    }
  }

  // Update progress indicator
  updateProgressIndicator() {
    if (!window.buildSystem.isCreationMode) return;
    
    const progressIndicator = document.getElementById('build-progress');
    const status = window.buildSystem.getCreationModeStatus();
    
    progressIndicator.innerHTML = `
      <div class="progress-text">
        Build Progress: ${status.selectedColumns}/${status.totalColumns} columns selected
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(status.selectedColumns / status.totalColumns) * 100}%"></div>
      </div>
      ${status.isComplete ? '<div class="progress-complete">✓ Build Complete! Ready to save.</div>' : ''}
    `;
  }

  // Show current build info
  showBuildInfo(buildArray) {
    if (!buildArray) return;
    
    console.log('Current Build:', buildArray);
    
    // You could add a visual indicator here showing the build array
    const buildInfo = document.createElement('div');
    buildInfo.className = 'build-info';
    buildInfo.textContent = `Build: [${buildArray.join(',')}]`;
    
    // Remove any existing build info
    const existing = document.querySelector('.build-info');
    if (existing) existing.remove();
    
    // Add new build info
    const controls = document.getElementById('build-controls');
    if (controls) {
      controls.appendChild(buildInfo);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.buildUI = new BuildUI();
});