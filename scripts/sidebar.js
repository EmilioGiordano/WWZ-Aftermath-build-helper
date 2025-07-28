// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = document.getElementById('main-content');
    
    // Toggle sidebar on button click
    sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('expanded');
        document.body.classList.toggle('sidebar-expanded');
        if (mainContent) {
            mainContent.classList.toggle('sidebar-expanded');
        }
        
        // Add/remove overlay for mobile
        if (window.innerWidth <= 768) {
            toggleMobileOverlay();
        }
    });
    
    // Dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const dropdown = document.getElementById(targetId);
            
            // Close other dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    otherToggle.classList.remove('active');
                    const otherTargetId = otherToggle.getAttribute('data-target');
                    const otherDropdown = document.getElementById(otherTargetId);
                    if (otherDropdown) {
                        otherDropdown.classList.remove('active');
                    }
                }
            });
            
            // Toggle current dropdown
            toggle.classList.toggle('active');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Class selection from sidebar
    const classDropdownItems = document.querySelectorAll('.dropdown-item[data-class]');
    classDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const className = this.getAttribute('data-class');
            
            // Remove selected class from all items
            classDropdownItems.forEach(dropdownItem => {
                dropdownItem.classList.remove('selected');
            });
            
            // Add selected class to clicked item
            this.classList.add('selected');
            
            // Trigger class change in main script
            const classButton = document.querySelector(`.class-btn[data-class="${className}"]`);
            if (classButton) {
                classButton.click();
            }
            
            // Close dropdown on mobile after selection
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
    
    // Layout selection from sidebar
    const layoutDropdownItems = document.querySelectorAll('.layout-option');
    layoutDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const layout = this.getAttribute('data-layout');
            
            // Remove selected class from all layout items
            layoutDropdownItems.forEach(layoutItem => {
                layoutItem.classList.remove('selected');
            });
            
            // Add selected class to clicked item
            this.classList.add('selected');
            
            // Trigger layout change
            const layoutButton = document.querySelector(`.layout-btn[data-layout="${layout}"]`);
            if (layoutButton) {
                layoutButton.click();
            }
            
            // Close dropdown on mobile after selection
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
    
    // Mobile overlay functionality
    function toggleMobileOverlay() {
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', closeSidebar);
        }
        
        if (sidebar.classList.contains('expanded')) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
    
    function closeSidebar() {
        sidebar.classList.remove('expanded');
        document.body.classList.remove('sidebar-expanded');
        if (mainContent) {
            mainContent.classList.remove('sidebar-expanded');
        }
        
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Close all dropdowns
        dropdownToggles.forEach(toggle => {
            toggle.classList.remove('active');
            const targetId = toggle.getAttribute('data-target');
            const dropdown = document.getElementById(targetId);
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // Handle ESC key to close sidebar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('expanded')) {
            closeSidebar();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                overlay.classList.remove('active');
            }
        }
    });
    
    // Initialize selected items based on current state
    function initializeSelectedItems() {
        // Set selected class item
        const currentClass = document.querySelector('.class-btn.selected');
        if (currentClass) {
            const className = currentClass.getAttribute('data-class');
            const classDropdownItem = document.querySelector(`.dropdown-item[data-class="${className}"]`);
            if (classDropdownItem) {
                classDropdownItem.classList.add('selected');
            }
        }
        
        // Set selected layout item
        const currentLayout = document.querySelector('.layout-btn.active');
        if (currentLayout) {
            const layout = currentLayout.getAttribute('data-layout');
            const layoutDropdownItem = document.querySelector(`.layout-option[data-layout="${layout}"]`);
            if (layoutDropdownItem) {
                layoutDropdownItem.classList.add('selected');
            }
        }
    }
    
    // Initialize after a short delay to ensure other scripts have loaded
    setTimeout(initializeSelectedItems, 100);
}); 