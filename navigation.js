// Enhanced Navigation System for Medical Portal
class MedicalNavigation {
    constructor() {
        this.currentPath = window.location.pathname;
        this.breadcrumbs = [];
        this.favorites = JSON.parse(localStorage.getItem('medicalFavorites') || '[]');
        this.recentVisits = JSON.parse(localStorage.getItem('medicalRecent') || '[]');
        this.globalProgress = JSON.parse(localStorage.getItem('globalProgress') || '{}');
        
        this.specialties = {
            'index.html': { name: 'Dashboard', icon: 'fas fa-home', category: 'main' },
            'cardiologia_algoritmo_completo1.html': { name: 'Cardiología', icon: 'fas fa-heartbeat', category: 'critical' },
            'pneumology_exam.html': { name: 'Neumología', icon: 'fas fa-lungs', category: 'critical' },
            'neurology_exam.html': { name: 'Neurología', icon: 'fas fa-brain', category: 'critical' },
            'gastro.html': { name: 'Gastroenterología', icon: 'fas fa-stomach', category: 'common' },
            'Oftalmo.html': { name: 'Oftalmología', icon: 'fas fa-eye', category: 'sensory' },
            'derma.html': { name: 'Dermatología', icon: 'fas fa-hand-paper', category: 'visual' },
            'trama.html': { name: 'Traumatología', icon: 'fas fa-running', category: 'locomotor' },
            'rheumatology_exam.html': { name: 'Reumatología', icon: 'fas fa-bone', category: 'articular' },
            'endocrinology_exam.html': { name: 'Endocrinología', icon: 'fas fa-dna', category: 'hormonal' },
            'hematology_exam.html': { name: 'Hematología', icon: 'fas fa-tint', category: 'laboratory' },
            'urology_exam.html': { name: 'Urología', icon: 'fas fa-kidneys', category: 'genitourinary' },
            'otolaryngology_exam_es.html': { name: 'Otorrinolaringología', icon: 'fas fa-ear-listen', category: 'sensory' },
            'psychiatric_exam_system.html': { name: 'Psiquiatría', icon: 'fas fa-head-side-virus', category: 'mental' },
            'infectious_diseases_exam.html': { name: 'Infectología', icon: 'fas fa-virus', category: 'urgent' }
        };

        this.init();
    }

    init() {
        this.createNavigationStructure();
        this.setupBreadcrumbs();
        this.setupMobileNavigation();
        this.setupGlobalSearch();
        this.setupQuickAccess();
        this.trackVisit();
        this.setupKeyboardShortcuts();
    }

    createNavigationStructure() {
        // Create main navigation container
        const navContainer = document.createElement('nav');
        navContainer.className = 'medical-navigation fixed top-0 left-0 right-0 z-50';
        navContainer.innerHTML = `
            <div class="backdrop-blur-md bg-black/40 border-b border-white/10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <!-- Logo y título -->
                        <div class="flex items-center gap-3">
                            <button id="mobile-menu-toggle" class="md:hidden p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20">
                                <i class="fas fa-bars w-5 h-5"></i>
                            </button>
                            <a href="index.html" class="flex items-center gap-3 text-white hover:text-blue-200 transition-colors">
                                <div class="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30">
                                    <i class="fas fa-hospital w-6 h-6 text-indigo-300"></i>
                                </div>
                                <div class="hidden sm:block">
                                    <div class="text-lg font-bold">MedScap</div>
                                    <div class="text-xs text-white/60">Portal Médico</div>
                                </div>
                            </a>
                        </div>

                        <!-- Breadcrumbs -->
                        <div id="breadcrumbs" class="hidden md:flex items-center gap-2 text-sm text-white/70">
                            <!-- Se genera dinámicamente -->
                        </div>

                        <!-- Búsqueda global y acciones -->
                        <div class="flex items-center gap-3">
                            <div class="relative hidden sm:block">
                                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4"></i>
                                <input 
                                    type="text" 
                                    id="global-nav-search" 
                                    placeholder="Buscar especialidad..." 
                                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 w-64"
                                >
                                <div id="search-dropdown" class="absolute top-full left-0 right-0 mt-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-xl hidden max-h-64 overflow-y-auto">
                                    <!-- Resultados de búsqueda -->
                                </div>
                            </div>
                            
                            <button id="favorites-toggle" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 relative">
                                <i class="fas fa-star w-4 h-4"></i>
                                <span id="favorites-count" class="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold hidden">0</span>
                            </button>
                            
                            <button id="progress-toggle" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20">
                                <i class="fas fa-chart-line w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden bg-black/90 backdrop-blur-md border-b border-white/10">
                <div class="px-4 py-3 space-y-2">
                    <div class="relative mb-3">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4"></i>
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            class="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 w-full"
                        >
                    </div>
                    <div id="mobile-specialties" class="space-y-1">
                        <!-- Se genera dinámicamente -->
                    </div>
                </div>
            </div>
        `;

        // Insert navigation at the beginning of body
        document.body.insertBefore(navContainer, document.body.firstChild);
        
        // Add top padding to main content
        const mainContent = document.querySelector('.min-h-screen');
        if (mainContent) {
            mainContent.style.paddingTop = '4rem';
        }
    }

    setupBreadcrumbs() {
        const breadcrumbsContainer = document.getElementById('breadcrumbs');
        if (!breadcrumbsContainer) return;

        const currentFile = this.getCurrentFileName();
        const specialty = this.specialties[currentFile];

        let breadcrumbsHTML = `
            <a href="index.html" class="hover:text-white transition-colors">
                <i class="fas fa-home w-4 h-4"></i>
            </a>
        `;

        if (specialty && currentFile !== 'index.html') {
            breadcrumbsHTML += `
                <i class="fas fa-chevron-right w-3 h-3"></i>
                <span class="text-white font-medium">${specialty.name}</span>
            `;
        }

        breadcrumbsContainer.innerHTML = breadcrumbsHTML;
    }

    setupMobileNavigation() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileSpecialties = document.getElementById('mobile-specialties');

        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileToggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }

        // Populate mobile menu with specialties
        if (mobileSpecialties) {
            Object.entries(this.specialties).forEach(([file, data]) => {
                if (file === 'index.html') return;
                
                const item = document.createElement('a');
                item.href = file;
                item.className = 'flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/10 transition-colors';
                item.innerHTML = `
                    <i class="${data.icon} w-5 h-5 text-blue-300"></i>
                    <span>${data.name}</span>
                `;
                mobileSpecialties.appendChild(item);
            });
        }
    }

    setupGlobalSearch() {
        const searchInput = document.getElementById('global-nav-search');
        const searchDropdown = document.getElementById('search-dropdown');

        if (!searchInput || !searchDropdown) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchDropdown.classList.add('hidden');
                return;
            }

            const results = this.searchSpecialties(query);
            this.displaySearchResults(results, searchDropdown);
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.add('hidden');
            }
        });
    }

    searchSpecialties(query) {
        const results = [];
        
        Object.entries(this.specialties).forEach(([file, data]) => {
            if (file === 'index.html') return;
            
            const nameMatch = data.name.toLowerCase().includes(query);
            const categoryMatch = data.category.toLowerCase().includes(query);
            
            if (nameMatch || categoryMatch) {
                results.push({
                    file,
                    name: data.name,
                    icon: data.icon,
                    category: data.category,
                    relevance: nameMatch ? 2 : 1
                });
            }
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="p-3 text-white/60 text-sm">No se encontraron especialidades</div>';
        } else {
            container.innerHTML = results.map(result => `
                <a href="${result.file}" class="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors text-white">
                    <i class="${result.icon} w-4 h-4 text-blue-300"></i>
                    <div class="flex-1">
                        <div class="font-medium">${result.name}</div>
                        <div class="text-xs text-white/60 capitalize">${result.category}</div>
                    </div>
                    <i class="fas fa-arrow-right w-3 h-3 text-white/40"></i>
                </a>
            `).join('');
        }
        
        container.classList.remove('hidden');
    }

    setupQuickAccess() {
        const favoritesToggle = document.getElementById('favorites-toggle');
        const favoritesCount = document.getElementById('favorites-count');

        if (favoritesToggle) {
            favoritesToggle.addEventListener('click', () => {
                this.showQuickAccessPanel();
            });
        }

        // Update favorites count
        if (favoritesCount && this.favorites.length > 0) {
            favoritesCount.textContent = this.favorites.length;
            favoritesCount.classList.remove('hidden');
        }
    }

    showQuickAccessPanel() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        overlay.innerHTML = `
            <div class="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-white">Acceso Rápido</h3>
                    <button id="close-quick-access" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20">
                        <i class="fas fa-times w-4 h-4"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Favoritos -->
                    <div>
                        <h4 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <i class="fas fa-star text-yellow-400 w-4 h-4"></i>
                            Favoritos
                        </h4>
                        <div id="favorites-list" class="space-y-2">
                            ${this.renderFavoritesList()}
                        </div>
                    </div>

                    <!-- Recientes -->
                    <div>
                        <h4 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <i class="fas fa-clock text-blue-400 w-4 h-4"></i>
                            Recientes
                        </h4>
                        <div id="recent-list" class="space-y-2">
                            ${this.renderRecentsList()}
                        </div>
                    </div>
                </div>

                <!-- Progreso global -->
                <div class="mt-6 pt-6 border-t border-white/20">
                    <h4 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <i class="fas fa-chart-line text-green-400 w-4 h-4"></i>
                        Progreso Global
                    </h4>
                    <div id="global-progress-display">
                        ${this.renderGlobalProgress()}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Setup close functionality
        const closeBtn = overlay.querySelector('#close-quick-access');
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    renderFavoritesList() {
        if (this.favorites.length === 0) {
            return '<div class="text-white/60 text-sm p-3 text-center">No hay favoritos guardados</div>';
        }

        return this.favorites.map(file => {
            const specialty = this.specialties[file];
            if (!specialty) return '';
            
            return `
                <a href="${file}" class="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                    <i class="${specialty.icon} w-4 h-4 text-yellow-300"></i>
                    <span class="flex-1">${specialty.name}</span>
                    <button onclick="event.preventDefault(); window.medicalNav.removeFavorite('${file}')" class="p-1 rounded text-white/60 hover:text-red-400">
                        <i class="fas fa-times w-3 h-3"></i>
                    </button>
                </a>
            `;
        }).join('');
    }

    renderRecentsList() {
        if (this.recentVisits.length === 0) {
            return '<div class="text-white/60 text-sm p-3 text-center">No hay visitas recientes</div>';
        }

        return this.recentVisits.slice(0, 5).map(visit => {
            const specialty = this.specialties[visit.file];
            if (!specialty) return '';
            
            return `
                <a href="${visit.file}" class="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                    <i class="${specialty.icon} w-4 h-4 text-blue-300"></i>
                    <div class="flex-1">
                        <div class="font-medium">${specialty.name}</div>
                        <div class="text-xs text-white/60">${this.formatTime(visit.timestamp)}</div>
                    </div>
                    <button onclick="event.preventDefault(); window.medicalNav.addToFavorites('${visit.file}')" class="p-1 rounded text-white/60 hover:text-yellow-400">
                        <i class="fas fa-star w-3 h-3"></i>
                    </button>
                </a>
            `;
        }).join('');
    }

    renderGlobalProgress() {
        const totalSpecialties = Object.keys(this.specialties).length - 1; // Exclude index.html
        const completedSpecialties = Object.keys(this.globalProgress).length;
        const progressPercentage = totalSpecialties > 0 ? (completedSpecialties / totalSpecialties) * 100 : 0;

        return `
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-white/70 text-sm">Especialidades completadas</span>
                    <span class="text-white font-bold">${completedSpecialties}/${totalSpecialties}</span>
                </div>
                <div class="w-full bg-white/20 rounded-full h-2">
                    <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="text-center text-sm text-white/70">${Math.round(progressPercentage)}% del examen médico integral</div>
            </div>
        `;
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K para búsqueda
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('global-nav-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Escape para cerrar modales
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => modal.remove());
                
                const dropdowns = document.querySelectorAll('#search-dropdown');
                dropdowns.forEach(dropdown => dropdown.classList.add('hidden'));
            }

            // Números 1-9 para acceso rápido a especialidades
            if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
                const index = parseInt(e.key) - 1;
                const specialtyFiles = Object.keys(this.specialties).filter(f => f !== 'index.html');
                if (specialtyFiles[index]) {
                    window.location.href = specialtyFiles[index];
                }
            }
        });
    }

    trackVisit() {
        const currentFile = this.getCurrentFileName();
        if (currentFile === 'index.html') return;

        // Add to recent visits
        const visit = {
            file: currentFile,
            timestamp: Date.now()
        };

        // Remove if already exists
        this.recentVisits = this.recentVisits.filter(v => v.file !== currentFile);
        
        // Add to beginning
        this.recentVisits.unshift(visit);
        
        // Keep only last 10
        this.recentVisits = this.recentVisits.slice(0, 10);
        
        localStorage.setItem('medicalRecent', JSON.stringify(this.recentVisits));
    }

    addToFavorites(file) {
        if (!this.favorites.includes(file)) {
            this.favorites.push(file);
            localStorage.setItem('medicalFavorites', JSON.stringify(this.favorites));
            
            // Update UI
            const favoritesCount = document.getElementById('favorites-count');
            if (favoritesCount) {
                favoritesCount.textContent = this.favorites.length;
                favoritesCount.classList.remove('hidden');
            }
            
            this.showNotification('Agregado a favoritos', 'success');
        }
    }

    removeFavorite(file) {
        this.favorites = this.favorites.filter(f => f !== file);
        localStorage.setItem('medicalFavorites', JSON.stringify(this.favorites));
        
        // Refresh the quick access panel if open
        const quickAccessPanel = document.querySelector('.fixed.inset-0');
        if (quickAccessPanel) {
            quickAccessPanel.remove();
            this.showQuickAccessPanel();
        }
        
        this.showNotification('Eliminado de favoritos', 'info');
    }

    updateGlobalProgress(specialtyFile, progress) {
        this.globalProgress[specialtyFile] = {
            progress: progress,
            timestamp: Date.now()
        };
        localStorage.setItem('globalProgress', JSON.stringify(this.globalProgress));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg backdrop-blur-md border transition-all duration-300 transform translate-x-full`;
        
        let bgClass = 'bg-blue-500/20 border-blue-400/50 text-blue-200';
        if (type === 'success') bgClass = 'bg-green-500/20 border-green-400/50 text-green-200';
        if (type === 'error') bgClass = 'bg-red-500/20 border-red-400/50 text-red-200';
        
        notification.className += ` ${bgClass}`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-info-circle w-4 h-4"></i>
                <span class="text-sm font-medium">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getCurrentFileName() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `Hace ${minutes} min`;
        return 'Ahora';
    }

    // Public methods for external use
    navigateTo(file) {
        window.location.href = file;
    }

    goBack() {
        if (this.recentVisits.length > 1) {
            window.location.href = this.recentVisits[1].file;
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Initialize navigation system
document.addEventListener('DOMContentLoaded', () => {
    window.medicalNav = new MedicalNavigation();
    
    // Add keyboard shortcut hints
    const hints = document.createElement('div');
    hints.className = 'fixed bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-3 text-xs text-white/70 hidden md:block';
    hints.innerHTML = `
        <div class="font-semibold mb-1">Atajos de teclado:</div>
        <div>Ctrl+K: Búsqueda | 1-9: Especialidades | Esc: Cerrar</div>
    `;
    document.body.appendChild(hints);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MedicalNavigation };
}