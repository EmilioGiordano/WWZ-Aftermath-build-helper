// Redesigned Build UI Module
class BuildUIRedesigned {
  constructor() {
    this.container = null;
    this.currentClass = 'exterminator';
    this.isAnimating = false;
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedTag = 'all';
    this.init();
  }

  init() {
    this.createBuildSystemContainer();
    this.setupEventListeners();
    this.setupResponsiveHandling();
    
    // Initialize search filters after a short delay to ensure elements exist
    setTimeout(() => {
      this.initializeSearchFilters();
    }, 200);
  }

  createBuildSystemContainer() {
    // Remove old build controls if they exist
    const oldControls = document.getElementById('build-controls');
    if (oldControls) {
      oldControls.remove();
    }

    // Create main container
    this.container = document.createElement('div');
    this.container.className = 'build-system-container';
    this.container.innerHTML = this.getContainerHTML();

    // Append to build panel container
    const buildPanelContainer = document.getElementById('build-panel-container');
    if (buildPanelContainer) {
      buildPanelContainer.appendChild(this.container);
    } else {
      // Fallback to body if container not found
      document.body.appendChild(this.container);
    }
  }

  getContainerHTML() {
    return `
      <div class="build-panel">
        <div class="build-panel-header">
          <h3 class="build-panel-title">Build System</h3>
          <p class="build-panel-subtitle">Create and manage your builds</p>
        </div>
        
        <div class="build-panel-content">
          <!-- Build Search Section -->
          <div class="build-section build-stagger-item" id="build-selection-section">
            <h4 class="build-section-title">
              <span class="build-search-icon">🔍</span>
              Build Library
            </h4>
            
            <!-- Search Input -->
            <div class="build-search-container">
              <input 
                id="build-search-input" 
                class="build-search-input" 
                type="text" 
                placeholder="Search builds by name..."
                autocomplete="off"
              >
              <div class="build-search-icon-wrapper">
                <span class="build-search-magnifier">🔎</span>
              </div>
            </div>
            
            <!-- Filters -->
            <div class="build-filters">
              <!-- Category Filter -->
              <div class="build-filter-group">
                <label class="build-filter-label">Category:</label>
                <div class="build-filter-buttons" id="category-filters">
                  <button class="build-filter-btn active" data-category="all">All</button>
                  <button class="build-filter-btn" data-category="horde">Horde</button>
                  <button class="build-filter-btn" data-category="extinction">Extinction</button>
                  <button class="build-filter-btn" data-category="campaign">Campaign</button>
                </div>
              </div>
              
              <!-- Tags Filter -->
              <div class="build-filter-group">
                <label class="build-filter-label">Role:</label>
                <div class="build-filter-buttons" id="tag-filters">
                  <button class="build-filter-btn active" data-tag="all">All</button>
                  <button class="build-filter-btn" data-tag="dps">DPS</button>
                  <button class="build-filter-btn" data-tag="tank">Tank</button>
                  <button class="build-filter-btn" data-tag="support">Support</button>
                  <button class="build-filter-btn" data-tag="crowd-control">CC</button>
                </div>
              </div>
            </div>
            
            <!-- Search Results -->
            <div class="build-search-results" id="build-search-results">
              <div class="build-search-empty">
                <span class="build-empty-icon">📚</span>
                <p>No builds found</p>
                <small>Try adjusting your search or filters</small>
              </div>
            </div>
          </div>

          <!-- Build Creation Section -->
          <div class="build-section build-stagger-item" id="build-creation-section">
            <h4 class="build-section-title">Build Creator</h4>
            <div class="build-control-group vertical">
              <button id="create-build-new" class="build-btn build-btn-create">
                <span>🛠️</span>
                <span>Create New Build</span>
              </button>
              <button id="clear-build-new" class="build-btn build-btn-danger">
                <span>🗑️</span>
                <span>Clear Build</span>
              </button>
            </div>
          </div>

          <!-- Progress Section (Hidden by default) -->
          <div class="build-section build-stagger-item build-hidden" id="build-progress-section">
            <div class="build-progress-container">
              <div class="build-progress-header">
                <h4 class="build-progress-title">Build Progress</h4>
                <span class="build-progress-counter" id="progress-counter">0/9</span>
              </div>
              <div class="build-progress-bar">
                <div class="build-progress-fill" id="progress-fill" style="width: 0%"></div>
              </div>
              <div class="build-progress-grid" id="progress-grid">
                ${Array.from({length: 9}, (_, i) => 
                  `<div class="build-progress-column" data-column="${i}"></div>`
                ).join('')}
              </div>
              <div class="build-progress-status incomplete" id="progress-status">
                Select one perk from each gray column
              </div>
            </div>
          </div>

          <!-- Save Build Section (Hidden by default) -->
          <div class="build-section build-stagger-item build-hidden" id="build-save-section">
            <h4 class="build-section-title">Save Build</h4>
            <div class="build-control-group vertical">
              <input 
                id="build-name-input-new" 
                class="build-input" 
                type="text" 
                placeholder="Enter build name..."
                maxlength="30"
              >
              <div class="build-control-group">
                <button id="save-build-new" class="build-btn build-btn-primary">
                  <span>💾</span>
                  <span>Save</span>
                </button>
                <button id="cancel-build-new" class="build-btn build-btn-secondary">
                  <span>❌</span>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Custom Build Section -->
          <div class="build-section build-stagger-item" id="build-custom-section">
            <h4 class="build-section-title">Custom Build</h4>
            <div class="build-control-group vertical">
              <input 
                id="custom-build-input-new" 
                class="build-input" 
                type="text" 
                placeholder="[1,2,4,3,3,1,4,2,4]"
                title="Enter build as array: [1,2,4,3,3,1,4,2,4]"
              >
              <button id="apply-custom-build-new" class="build-btn build-btn-primary">
                <span>⚡</span>
                <span>Apply Custom</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Build search input
    document.getElementById('build-search-input').addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    // Category filters
    document.getElementById('category-filters').addEventListener('click', (e) => {
      if (e.target.classList.contains('build-filter-btn')) {
        this.handleCategoryFilter(e.target.dataset.category);
        this.updateFilterButtons('category-filters', e.target);
      }
    });

    // Tag filters
    document.getElementById('tag-filters').addEventListener('click', (e) => {
      if (e.target.classList.contains('build-filter-btn')) {
        this.handleTagFilter(e.target.dataset.tag);
        this.updateFilterButtons('tag-filters', e.target);
      }
    });

    // Search results clicks
    document.getElementById('build-search-results').addEventListener('click', (e) => {
      const buildItem = e.target.closest('.build-result-item');
      if (buildItem) {
        this.handleBuildSelection(buildItem.dataset.value);
      }
    });

    // Create build button
    document.getElementById('create-build-new').addEventListener('click', () => {
      this.toggleCreationMode();
    });

    // Clear build button
    document.getElementById('clear-build-new').addEventListener('click', () => {
      this.clearBuild();
    });

    // Save build button
    document.getElementById('save-build-new').addEventListener('click', () => {
      this.saveBuild();
    });

    // Cancel build button
    document.getElementById('cancel-build-new').addEventListener('click', () => {
      this.cancelCreation();
    });

    // Apply custom build button
    document.getElementById('apply-custom-build-new').addEventListener('click', () => {
      this.applyCustomBuild();
    });

    // Build name input enter key
    document.getElementById('build-name-input-new').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveBuild();
      }
    });

    // System event listeners
    document.addEventListener('creationModeChanged', (e) => {
      this.updateCreationModeUI(e.detail.isCreationMode);
    });

    document.addEventListener('buildChanged', () => {
      this.updateProgress();
    });

    document.addEventListener('classChanged', (e) => {
      this.currentClass = e.detail.className;
      this.updateBuildOptions(e.detail.className);
      this.initializeSearchFilters();
    });
  }

  setupResponsiveHandling() {
    // Handle responsive behavior
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addListener((e) => {
      this.handleResponsiveChange(e.matches);
    });
    this.handleResponsiveChange(mediaQuery.matches);
  }

  handleResponsiveChange(isMobile) {
    // El contenedor ahora siempre está en build-panel-container
    // Los estilos CSS se encargan del responsive behavior
    const buildPanelContainer = document.getElementById('build-panel-container');
    if (buildPanelContainer && this.container.parentNode !== buildPanelContainer) {
      buildPanelContainer.appendChild(this.container);
    }
  }

  handleBuildSelection(value) {
    if (!value) return;
    
    const [className, buildName] = value.split('|');
    if (className && buildName) {
      window.buildSystem.applyNamedBuild(className, buildName);
      this.addButtonAnimation('build-selector-new', 'build-glow');
    }
  }

  toggleCreationMode() {
    if (window.buildSystem.isCreationMode) {
      window.buildSystem.exitCreationMode();
    } else {
      window.buildSystem.startCreationMode();
      this.addButtonAnimation('create-build-new', 'build-pulse');
    }
  }

  clearBuild() {
    window.buildSystem.clearBuild();
    document.getElementById('build-selector-new').value = '';
    document.getElementById('custom-build-input-new').value = '';
    this.addButtonAnimation('clear-build-new', 'build-shake');
  }

  saveBuild() {
    const buildName = document.getElementById('build-name-input-new').value.trim();
    if (!buildName) {
      this.showError('Please enter a build name');
      this.addButtonAnimation('build-name-input-new', 'build-shake');
      return;
    }

    if (window.buildSystem.saveBuildInCreation(this.currentClass, buildName)) {
      this.showSuccess('Build saved successfully!');
      this.updateBuildOptions(this.currentClass);
      document.getElementById('build-name-input-new').value = '';
      this.addButtonAnimation('save-build-new', 'build-glow');
    } else {
      this.showError('Please complete the build first (select one perk from each column)');
      this.addButtonAnimation('save-build-new', 'build-shake');
    }
  }

  cancelCreation() {
    window.buildSystem.exitCreationMode();
    document.getElementById('build-name-input-new').value = '';
  }

  applyCustomBuild() {
    const input = document.getElementById('custom-build-input-new');
    try {
      const buildArray = JSON.parse(input.value);
      if (window.buildSystem.validateBuild(buildArray)) {
        window.buildSystem.applyBuild(buildArray);
        document.getElementById('build-selector-new').value = '';
        this.addButtonAnimation('apply-custom-build-new', 'build-glow');
        this.showSuccess('Custom build applied!');
      } else {
        this.showError('Invalid build format. Use array of 9 integers between 1-4');
        this.addButtonAnimation('custom-build-input-new', 'build-shake');
      }
    } catch (e) {
      this.showError('Invalid JSON format. Use: [1,2,4,3,3,1,4,2,4]');
      this.addButtonAnimation('custom-build-input-new', 'build-shake');
    }
  }

  updateCreationModeUI(isCreationMode) {
    const createButton = document.getElementById('create-build-new');
    const progressSection = document.getElementById('build-progress-section');
    const saveSection = document.getElementById('build-save-section');
    const buildSelector = document.getElementById('build-selector-new');
    const customSection = document.getElementById('build-custom-section');

    if (isCreationMode) {
      createButton.innerHTML = '<span>🚫</span><span>Exit Creation</span>';
      createButton.classList.add('active');
      this.showSection(progressSection);
      this.showSection(saveSection);
      buildSelector.disabled = true;
      this.hideSection(customSection);
      this.updateProgress();
    } else {
      createButton.innerHTML = '<span>🛠️</span><span>Create New Build</span>';
      createButton.classList.remove('active');
      this.hideSection(progressSection);
      this.hideSection(saveSection);
      buildSelector.disabled = false;
      this.showSection(customSection);
    }
  }

  updateProgress() {
    if (!window.buildSystem.isCreationMode) return;

    const status = window.buildSystem.getCreationModeStatus();
    const progressFill = document.getElementById('progress-fill');
    const progressCounter = document.getElementById('progress-counter');
    const progressStatus = document.getElementById('progress-status');
    const progressGrid = document.getElementById('progress-grid');

    // Update counter
    progressCounter.textContent = `${status.selectedColumns}/${status.totalColumns}`;

    // Update progress bar
    const percentage = (status.selectedColumns / status.totalColumns) * 100;
    progressFill.style.width = `${percentage}%`;

    // Update status
    if (status.isComplete) {
      progressStatus.textContent = '✅ Build Complete! Ready to save.';
      progressStatus.className = 'build-progress-status complete';
    } else {
      progressStatus.textContent = `Select ${status.totalColumns - status.selectedColumns} more columns`;
      progressStatus.className = 'build-progress-status incomplete';
    }

    // Update grid visualization
    const grayColumns = window.buildSystem.getGrayColumns();
    const columns = progressGrid.querySelectorAll('.build-progress-column');
    columns.forEach((column, index) => {
      const columnNumber = grayColumns[index];
      if (window.buildSystem.buildInCreation[columnNumber]) {
        column.classList.add('selected');
      } else {
        column.classList.remove('selected');
      }
    });
  }

  updateBuildOptions(className) {
    const selector = document.getElementById('build-selector-new');
    
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

  showSection(section) {
    section.classList.remove('build-hidden');
    section.classList.add('show');
  }

  hideSection(section) {
    section.classList.add('hide');
    setTimeout(() => {
      section.classList.add('build-hidden');
      section.classList.remove('hide', 'show');
    }, 200);
  }

  addButtonAnimation(elementId, animationClass) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add(animationClass);
      setTimeout(() => {
        element.classList.remove(animationClass);
      }, 1500);
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `build-notification build-notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      fontSize: '14px',
      zIndex: '1000',
      animation: 'slideInRight 0.3s ease-out',
      background: type === 'success' 
        ? 'linear-gradient(135deg, #10b981, #059669)' 
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      boxShadow: type === 'success'
        ? '0 4px 12px rgba(16, 185, 129, 0.3)'
        : '0 4px 12px rgba(239, 68, 68, 0.3)'
    });

    document.body.appendChild(notification);

    // Remove after delay
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Search and Filter Methods
  handleSearch(query) {
    this.searchQuery = query.toLowerCase();
    this.updateSearchResults();
  }

  handleCategoryFilter(category) {
    this.selectedCategory = category;
    this.updateSearchResults();
  }

  handleTagFilter(tag) {
    this.selectedTag = tag;
    this.updateSearchResults();
  }

  updateFilterButtons(containerId, activeButton) {
    const container = document.getElementById(containerId);
    container.querySelectorAll('.build-filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    activeButton.classList.add('active');
  }

  updateSearchResults() {
    const resultsContainer = document.getElementById('build-search-results');
    const builds = this.getFilteredBuilds();
    
    if (builds.length === 0) {
      resultsContainer.innerHTML = `
        <div class="build-search-empty">
          <span class="build-empty-icon">🔍</span>
          <p>No builds found</p>
          <small>Try adjusting your search or filters</small>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = builds.map(build => `
      <div class="build-result-item" data-value="${build.className}|${build.name}">
        <div class="build-result-name">${build.name}</div>
        <div class="build-result-meta">
          <span class="build-result-category">${build.category || 'General'}</span>
          <div class="build-result-tags">
            ${(build.tags || []).map(tag => `<span class="build-result-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  getFilteredBuilds() {
    // Obtener builds del sistema actual
    const builds = [];
    const currentBuilds = window.buildSystem?.getBuildsForClass(this.currentClass) || {};
    
    Object.keys(currentBuilds).forEach(buildName => {
      const buildData = currentBuilds[buildName];
      builds.push({
        name: buildName,
        className: this.currentClass,
        build: buildData,
        category: buildData.category || 'general',
        tags: buildData.tags || []
      });
    });

    // Aplicar filtros
    return builds.filter(build => {
      // Filtro de búsqueda
      if (this.searchQuery && !build.name.toLowerCase().includes(this.searchQuery)) {
        return false;
      }

      // Filtro de categoría
      if (this.selectedCategory && this.selectedCategory !== 'all' && 
          build.category !== this.selectedCategory) {
        return false;
      }

      // Filtro de tags
      if (this.selectedTag && this.selectedTag !== 'all' && 
          !build.tags.includes(this.selectedTag)) {
        return false;
      }

      return true;
    });
  }

  initializeSearchFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedTag = 'all';
    this.updateSearchResults();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to ensure other systems are loaded
  setTimeout(() => {
    window.buildUIRedesigned = new BuildUIRedesigned();
  }, 100);
});