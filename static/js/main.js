// Main JavaScript file for Academic Progress Hub

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Initialize popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    // Flash messages auto-dismiss
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(alert => {
        setTimeout(() => {
            const closeBtn = alert.querySelector('.btn-close');
            if (closeBtn) {
                closeBtn.click();
            }
        }, 5000);
    });

    // Handle confirmed actions (like delete)
    const confirmActions = document.querySelectorAll('[data-confirm]');
    confirmActions.forEach(button => {
        button.addEventListener('click', function(event) {
            if (!confirm(this.getAttribute('data-confirm') || 'Are you sure?')) {
                event.preventDefault();
            }
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIconDark = document.querySelector('.theme-icon-dark');
    const themeIconLight = document.querySelector('.theme-icon-light');
    
    // Check if theme preference exists in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeIconDark && themeIconLight) {
            if (theme === 'dark') {
                themeIconDark.classList.add('d-none');
                themeIconLight.classList.remove('d-none');
            } else {
                themeIconDark.classList.remove('d-none');
                themeIconLight.classList.add('d-none');
            }
        }
    }

    // Performance chart rendering with loading state
    const performanceChart = document.getElementById('performanceChart');
    if (performanceChart) {
        showLoadingOverlay(performanceChart);
        setTimeout(() => {
            renderPerformanceChart(performanceChart);
            hideLoadingOverlay(performanceChart);
        }, 500); // Simulate loading time
    }

    // Attendance chart rendering with loading state
    const attendanceChart = document.getElementById('attendanceChart');
    if (attendanceChart) {
        showLoadingOverlay(attendanceChart);
        setTimeout(() => {
            renderAttendanceChart(attendanceChart);
            hideLoadingOverlay(attendanceChart);
        }, 700); // Simulate loading time
    }
    
    // Initialize Chart.js with proper theme
    Chart.defaults.color = htmlElement.getAttribute('data-bs-theme') === 'dark' ? '#f8f9fa' : '#212529';
    Chart.defaults.borderColor = htmlElement.getAttribute('data-bs-theme') === 'dark' ? '#495057' : '#dee2e6';
});

// Loading overlay functions
function showLoadingOverlay(element) {
    const parent = element.parentElement;
    if (parent) {
        parent.style.position = 'relative';
        
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="spinner-border text-primary spinner" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        
        parent.appendChild(overlay);
    }
}

function hideLoadingOverlay(element) {
    const parent = element.parentElement;
    if (parent) {
        const overlay = parent.querySelector('.loading-overlay');
        if (overlay) {
            parent.removeChild(overlay);
        }
    }
}

// Performance chart function
function renderPerformanceChart(canvas) {
    // Get data from data attributes
    const subjects = JSON.parse(canvas.getAttribute('data-subjects') || '[]');
    const scores = JSON.parse(canvas.getAttribute('data-scores') || '[]');
    
    if (subjects.length === 0 || scores.length === 0) {
        displayNoDataMessage(canvas, 'No performance data available');
        return;
    }
    
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: subjects,
            datasets: [{
                label: 'Performance (%)',
                data: scores,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.formattedValue}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Attendance chart function
function renderAttendanceChart(canvas) {
    // Get data from data attributes
    const subjects = JSON.parse(canvas.getAttribute('data-subjects') || '[]');
    const attendance = JSON.parse(canvas.getAttribute('data-attendance') || '[]');
    
    if (subjects.length === 0 || attendance.length === 0) {
        displayNoDataMessage(canvas, 'No attendance data available');
        return;
    }
    
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: subjects,
            datasets: [{
                label: 'Attendance (%)',
                data: attendance,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.formattedValue}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Display no data message
function displayNoDataMessage(canvas, message) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.height = 100; // Set a minimum height
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#f8f9fa' : '#212529';
    ctx.font = '14px Arial';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

// Timetable filter functionality
const timetableFilter = document.getElementById('timetableFilter');
if (timetableFilter) {
    timetableFilter.addEventListener('change', function() {
        const day = this.value;
        const rows = document.querySelectorAll('.timetable-row');
        
        if (day === 'all') {
            rows.forEach(row => row.style.display = '');
        } else {
            rows.forEach(row => {
                const rowDay = row.getAttribute('data-day');
                row.style.display = (rowDay === day) ? '' : 'none';
            });
        }
    });
}

// Make notification items interactive
document.addEventListener('DOMContentLoaded', function() {
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        // Add animation and interaction effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});
