// Sistema unificado de funcionalidades médicas - Actualizado para nuevo diseño
class MedicalInterface {
    constructor() {
        this.searchInput = null;
        this.filterSelects = [];
        this.progressBar = null;
        this.progressText = null;
        this.alertsContainer = null;
        this.currentProgress = 0;
        this.totalSections = 0;
        
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupFilters();
        this.setupProgress();
        this.setupAlerts();
        this.setupFormTracking();
        this.setupCardInteractions();
        this.calculateTotalSections();
    }

    setupSearch() {
        // Actualizado para el nuevo diseño
        this.searchInput = document.querySelector('input[placeholder*="Buscar"]') || document.getElementById('global-search');
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
    }

    performSearch(query) {
        // Actualizado para buscar en las nuevas secciones
        const sections = document.querySelectorAll('.bg-white\\/10.backdrop-blur-md, .exam-section, [class*="space-y-6"] > div');
        const lowerQuery = query.toLowerCase();

        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const isVisible = text.includes(lowerQuery);
            section.style.display = isVisible ? 'block' : 'none';
        });

        this.updateSearchAlert(query);
    }

    updateSearchAlert(query) {
        if (!query) {
            this.removeAlert('search-results');
            return;
        }

        const visibleSections = document.querySelectorAll('.bg-white\\/10:not([style*="display: none"]), .exam-section:not([style*="display: none"])').length;
        this.showAlert('search-results', 'info', `Mostrando ${visibleSections} secciones para "${query}"`);
    }

    setupFilters() {
        // Actualizado para los nuevos botones de filtro
        this.filterButtons = document.querySelectorAll('.filter-button, .filter-select');
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('filter-button')) {
                    this.handleFilterButton(button);
                }
            });
            if (button.tagName === 'SELECT') {
                button.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });
    }

    handleFilterButton(button) {
        // Remover clase active de otros botones del mismo grupo
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        // Aplicar filtro
        const filter = button.dataset.filter || button.textContent.toLowerCase();
        this.applyFilterByType(filter);
    }

    applyFilterByType(filterType) {
        const sections = document.querySelectorAll('.bg-white\\/10.backdrop-blur-md, .exam-section');
        let visibleCount = 0;

        sections.forEach(section => {
            let isVisible = true;

            switch(filterType) {
                case 'todos':
                case 'all':
                    isVisible = true;
                    break;
                case 'críticas':
                case 'critical':
                    // Mostrar solo secciones con alertas críticas
                    const hasWarning = section.querySelector('[class*="text-red"], [class*="text-orange"], .alert-warning, .alert-error');
                    isVisible = !!hasWarning;
                    break;
                case 'completados':
                case 'completed':
                    const inputs = section.querySelectorAll('input:checked, input[value]:not([value=""]), select option:checked:not([value=""])');
                    isVisible = inputs.length > 0;
                    break;
                case 'pendientes':
                case 'pending':
                    const completedInputs = section.querySelectorAll('input:checked, input[value]:not([value=""]), select option:checked:not([value=""])');
                    isVisible = completedInputs.length === 0;
                    break;
            }

            section.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        this.showAlert('filter-results', 'info', `${visibleCount} secciones visibles con filtro "${filterType}"`);
    }

    applyFilters() {
        const filters = {};
        this.filterSelects.forEach(select => {
            if (select.value) {
                filters[select.dataset.filter] = select.value;
            }
        });

        this.filterContent(filters);
    }

    filterContent(filters) {
        const sections = document.querySelectorAll('.bg-white\\/10.backdrop-blur-md, .exam-section');
        let visibleCount = 0;

        sections.forEach(section => {
            let isVisible = true;

            Object.keys(filters).forEach(filterType => {
                const filterValue = filters[filterType];
                
                switch(filterType) {
                    case 'severity':
                        break;
                    case 'category':
                        break;
                    case 'completed':
                        const inputs = section.querySelectorAll('input:checked, input[value]:not([value=""]), select option:checked:not([value=""])');
                        const hasInputs = inputs.length > 0;
                        if (filterValue === 'completed' && !hasInputs) isVisible = false;
                        if (filterValue === 'pending' && hasInputs) isVisible = false;
                        break;
                }
            });

            section.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        this.showAlert('filter-results', 'info', `${visibleCount} secciones visibles con filtros aplicados`);
    }

    setupProgress() {
        // Actualizado para el nuevo diseño de progreso
        this.progressBar = document.querySelector('[style*="width:"], .progress-fill, [class*="bg-gradient-to-r"][class*="from-indigo-400"]');
        this.progressText = document.querySelector('.text-white.text-sm.font-bold') || document.querySelector('.progress-text');
        this.progressBadge = document.querySelector('.bg-blue-500\\/30, .header-badge');
        this.updateProgress();
    }

    calculateTotalSections() {
        // Contar secciones expandibles y formularios
        const expandableSections = document.querySelectorAll('.bg-white\\/10.backdrop-blur-md');
        const examSections = document.querySelectorAll('.exam-section');
        const formSections = document.querySelectorAll('[class*="space-y-6"] > div');
        
        this.totalSections = Math.max(expandableSections.length, examSections.length, formSections.length, 1);
    }

    updateProgress() {
        const completedSections = this.getCompletedSections();
        this.currentProgress = this.totalSections > 0 ? (completedSections / this.totalSections) * 100 : 0;

        // Actualizar barra de progreso principal
        if (this.progressBar) {
            if (this.progressBar.style !== undefined) {
                this.progressBar.style.width = `${this.currentProgress}%`;
            }
            // Para barras de progreso con transform
            const progressBars = document.querySelectorAll('[style*="transform: translateX"]');
            progressBars.forEach(bar => {
                bar.style.transform = `translateX(-${100 - this.currentProgress}%)`;
            });
        }

        // Actualizar texto de progreso
        if (this.progressText) {
            this.progressText.textContent = `${Math.round(this.currentProgress)}%`;
        }

        // Actualizar badge de progreso
        if (this.progressBadge) {
            this.progressBadge.textContent = `${Math.round(this.currentProgress)}% Completado`;
        }

        // Actualizar badges adicionales
        const additionalBadges = document.querySelectorAll('.header-badge, .bg-blue-500\\/30');
        additionalBadges.forEach(badge => {
            if (badge.textContent.includes('%') || badge.textContent.includes('Completado')) {
                badge.textContent = `${Math.round(this.currentProgress)}% Completado`;
            }
        });

        // Actualizar estadísticas en sidebar
        const sectionsStat = document.querySelector('.text-lg.font-bold.text-white');
        if (sectionsStat) {
            sectionsStat.textContent = completedSections.toString();
        }

        // Mostrar alertas de progreso
        if (this.currentProgress === 100) {
            this.showAlert('progress-complete', 'success', '¡Examen completado al 100%!');
        } else if (this.currentProgress >= 75) {
            this.showAlert('progress-high', 'info', 'Examen casi completado');
        }
    }

    getCompletedSections() {
        let completed = 0;
        
        // Buscar en secciones expandibles del nuevo diseño
        const sections = document.querySelectorAll('.bg-white\\/10.backdrop-blur-md, .exam-section, [class*="space-y-6"] > div');
        
        sections.forEach(section => {
            const inputs = section.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked, input[type="text"], input[type="number"], select');
            let hasValue = false;

            inputs.forEach(input => {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    if (input.checked) hasValue = true;
                } else if (input.value && input.value.trim() !== '') {
                    hasValue = true;
                }
            });

            if (hasValue) completed++;
        });

        return completed;
    }

    setupAlerts() {
        // Buscar contenedor de alertas en el nuevo diseño
        this.alertsContainer = document.querySelector('.space-y-3') || document.getElementById('alerts-container');
        
        if (!this.alertsContainer) {
            // Crear contenedor si no existe
            const alertsSection = document.querySelector('.text-card-foreground');
            if (alertsSection) {
                const alertsContent = alertsSection.querySelector('.p-6.pt-0.space-y-3');
                if (alertsContent) {
                    this.alertsContainer = alertsContent;
                }
            }
        }
    }

    showAlert(id, type, message) {
        this.removeAlert(id);

        if (!this.alertsContainer) return;

        const alert = document.createElement('div');
        alert.id = `alert-${id}`;
        
        // Usar clases del nuevo diseño
        let alertClasses = 'relative w-full border p-4 rounded-xl backdrop-blur-sm';
        let textClasses = 'text-xs';
        let icon = '';

        switch(type) {
            case 'info':
                alertClasses += ' border-blue-400/50 bg-blue-500/20';
                textClasses += ' text-blue-200';
                icon = 'ℹ️';
                break;
            case 'warning':
                alertClasses += ' border-orange-400/50 bg-orange-500/20';
                textClasses += ' text-orange-200';
                icon = '⚠️';
                break;
            case 'success':
                alertClasses += ' border-green-400/50 bg-green-500/20';
                textClasses += ' text-green-200';
                icon = '✅';
                break;
            case 'error':
                alertClasses += ' border-red-400/50 bg-red-500/20';
                textClasses += ' text-red-200';
                icon = '❌';
                break;
        }

        alert.className = alertClasses;
        alert.innerHTML = `<div class="${textClasses}">${icon} ${message}</div>`;

        this.alertsContainer.appendChild(alert);

        // Auto-remove después de 5 segundos para alertas informativas
        if (type === 'info') {
            setTimeout(() => {
                this.removeAlert(id);
            }, 5000);
        }
    }

    removeAlert(id) {
        const existingAlert = document.getElementById(`alert-${id}`);
        if (existingAlert) {
            existingAlert.remove();
        }
    }

    setupFormTracking() {
        // Rastrear cambios en formularios para actualizar progreso
        document.addEventListener('change', (e) => {
            if (e.target.matches('input, select, textarea')) {
                // Actualizar selección visual para checkboxes y radios
                if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                    this.updateCardSelection(e.target);
                }
                
                setTimeout(() => {
                    this.updateProgress();
                }, 100);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="text"], input[type="number"], textarea')) {
                setTimeout(() => {
                    this.updateProgress();
                }, 300);
            }
        });
    }

    setupCardInteractions() {
        // Manejar clicks en las nuevas tarjetas de síntomas
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.flex.items-center.space-x-2, .symptom-card');
            if (card) {
                const input = card.querySelector('input[type="radio"], input[type="checkbox"]');
                if (input && input.type === 'radio') {
                    input.checked = true;
                    this.updateCardSelection(input);
                    this.updateProgress();
                } else if (input && input.type === 'checkbox') {
                    input.checked = !input.checked;
                    this.updateCardSelection(input);
                    this.updateProgress();
                }
            }
        });
    }

    updateCardSelection(input) {
        if (input.type === 'radio') {
            // Remover selección de otros cards del mismo grupo
            const name = input.name;
            const allInputs = document.querySelectorAll(`input[name="${name}"]`);
            
            allInputs.forEach(otherInput => {
                const card = otherInput.closest('.flex.items-center.space-x-2, .symptom-card');
                if (card) {
                    // Remover clases de selección
                    card.classList.remove('bg-blue-500/20', 'border-blue-500', 'selected');
                    card.classList.add('hover:bg-white/5');
                }
            });

            // Agregar selección al card actual
            const selectedCard = input.closest('.flex.items-center.space-x-2, .symptom-card');
            if (selectedCard && input.checked) {
                selectedCard.classList.add('bg-blue-500/20', 'border-blue-500', 'selected');
                selectedCard.classList.remove('hover:bg-white/5');
            }
        } else if (input.type === 'checkbox') {
            const card = input.closest('.flex.items-center.space-x-2, .symptom-card');
            if (card) {
                if (input.checked) {
                    card.classList.add('bg-green-500/20', 'border-green-500', 'selected');
                    card.classList.remove('hover:bg-white/5');
                } else {
                    card.classList.remove('bg-green-500/20', 'border-green-500', 'selected');
                    card.classList.add('hover:bg-white/5');
                }
            }
        }
    }

    // Métodos de utilidad para cálculos médicos (sin cambios)
    calculateBMI(weight, height) {
        if (!weight || !height) return null;
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    calculateAge(birthDate) {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    preserveExistingFunctions() {
        console.log('Funciones médicas específicas preservadas para nuevo diseño');
    }
}

// Funciones globales de utilidad (sin cambios)
function showMedicalAlert(type, message) {
    if (window.medicalInterface) {
        window.medicalInterface.showAlert('manual', type, message);
    }
}

function updateMedicalProgress() {
    if (window.medicalInterface) {
        window.medicalInterface.updateProgress();
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    window.medicalInterface = new MedicalInterface();
    
    setTimeout(() => {
        window.medicalInterface.preserveExistingFunctions();
    }, 100);
});

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MedicalInterface };
}