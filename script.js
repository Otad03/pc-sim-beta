// Global State
let selectedParts = {};
let assembledParts = {};
let currentScenario = 1;
let budget = 500; // Starting budget

// PC Parts Database
const parts = [
    { 
        id: 'cpu', 
        name: 'Intel Core i5', 
        cost: 200, 
        description: 'Powerful 6-core processor',
        required: true
    },
    { 
        id: 'ram', 
        name: 'Corsair 16GB DDR4', 
        cost: 100, 
        description: 'High-speed memory',
        required: false
    },
    { 
        id: 'gpu', 
        name: 'NVIDIA RTX 3060', 
        cost: 300, 
        description: 'Graphics card for gaming',
        required: false
    },
    { 
        id: 'storage', 
        name: 'Samsung 500GB SSD', 
        cost: 120, 
        description: 'Fast solid state drive',
        required: false
    },
    { 
        id: 'psu', 
        name: 'EVGA 650W PSU', 
        cost: 80, 
        description: 'Reliable power supply',
        required: true
    },
];

// Troubleshooting scenarios database - expanded for AI generation
const scenarioDatabase = [
    {
        id: 1,
        title: 'PC Won\'t Boot',
        emoji: '🔴',
        description: 'Your PC doesn\'t power on when you press the power button.',
        options: [
            { action: 'check-power', text: 'Check Power Supply', icon: '🔌' },
            { action: 'reseat-ram', text: 'Reseat RAM', icon: '💾' },
            { action: 'check-monitor', text: 'Check Monitor', icon: '🖥️' }
        ],
        correct: 'check-power',
        explanation: 'Always check the power supply connection first when a PC won\'t boot! Ensure the PSU is plugged in and the power switch is on.'
    },
    {
        id: 2,
        title: 'No Display',
        emoji: '🟡',
        description: 'PC powers on but monitor shows no signal.',
        options: [
            { action: 'check-gpu', text: 'Check GPU Connection', icon: '🎮' },
            { action: 'reset-cpu', text: 'Reseat CPU', icon: '🔲' },
            { action: 'check-cable', text: 'Check Display Cable', icon: '🔗' }
        ],
        correct: 'check-gpu',
        explanation: 'When there\'s no display, checking the GPU connection is usually the solution! Make sure it\'s properly seated and power cables are connected.'
    },
    {
        id: 3,
        title: 'Overheating Issues',
        emoji: '🟠',
        description: 'PC shuts down after a few minutes of use.',
        options: [
            { action: 'add-cooler', text: 'Install CPU Cooler', icon: '❄️' },
            { action: 'check-psu', text: 'Replace PSU', icon: '⚡' },
            { action: 'check-fan', text: 'Check Case Fans', icon: '🌀' }
        ],
        correct: 'add-cooler',
        explanation: 'Overheating issues are often caused by inadequate cooling. Installing a CPU cooler is essential to prevent thermal shutdowns!'
    },
    {
        id: 4,
        title: 'Random Crashes',
        emoji: '🔵',
        description: 'PC works fine but crashes randomly during use, especially when gaming.',
        options: [
            { action: 'faulty-ram', text: 'Test/Replace RAM', icon: '💾' },
            { action: 'update-drivers', text: 'Update Drivers', icon: '💿' },
            { action: 'check-storage', text: 'Check Storage', icon: '💽' }
        ],
        correct: 'faulty-ram',
        explanation: 'Random crashes, especially during intensive tasks, are often caused by faulty or incompatible RAM. Run a memory test to diagnose!'
    },
    {
        id: 5,
        title: 'Slow Performance',
        emoji: '🟢',
        description: 'Your PC is very slow and takes forever to load programs.',
        options: [
            { action: 'upgrade-ssd', text: 'Upgrade to SSD', icon: '💽' },
            { action: 'upgrade-gpu', text: 'Upgrade GPU', icon: '🎮' },
            { action: 'upgrade-psu', text: 'Upgrade PSU', icon: '⚡' }
        ],
        correct: 'upgrade-ssd',
        explanation: 'Slow loading times are dramatically improved by upgrading from HDD to SSD! SSDs are much faster for loading programs and booting.'
    },
    {
        id: 6,
        title: 'Strange Beeping Sounds',
        emoji: '🟣',
        description: 'PC beeps continuously when you turn it on and won\'t boot.',
        options: [
            { action: 'ram-not-detected', text: 'RAM Not Detected', icon: '💾' },
            { action: 'psu-failure', text: 'PSU Failure', icon: '⚡' },
            { action: 'keyboard-error', text: 'Keyboard Error', icon: '⌨️' }
        ],
        correct: 'ram-not-detected',
        explanation: 'Beeping sounds usually indicate POST errors. Continuous beeps often mean RAM is not properly seated or detected by the motherboard!'
    },
    {
        id: 7,
        title: 'Blue Screen of Death (BSOD)',
        emoji: '🟤',
        description: 'Your PC shows a blue error screen and restarts frequently.',
        options: [
            { action: 'driver-conflict', text: 'Driver Conflicts', icon: '⚠️' },
            { action: 'gpu-issue', text: 'GPU Problem', icon: '🎮' },
            { action: 'monitor-issue', text: 'Monitor Issue', icon: '🖥️' }
        ],
        correct: 'driver-conflict',
        explanation: 'Blue screens are commonly caused by driver conflicts or corrupted drivers. Update or rollback problematic drivers to fix this!'
    },
    {
        id: 8,
        title: 'No Internet Connection',
        emoji: '⚫',
        description: 'Everything works but you can\'t connect to the internet.',
        options: [
            { action: 'check-ethernet', text: 'Check Ethernet Cable', icon: '🔌' },
            { action: 'replace-cpu', text: 'Replace CPU', icon: '🔲' },
            { action: 'add-more-ram', text: 'Add More RAM', icon: '💾' }
        ],
        correct: 'check-ethernet',
        explanation: 'Internet connectivity issues are often as simple as a loose ethernet cable or router problem. Check physical connections first!'
    },
    {
        id: 9,
        title: 'USB Ports Not Working',
        emoji: '🟦',
        description: 'None of your USB devices are being recognized.',
        options: [
            { action: 'check-motherboard', text: 'Check Motherboard Drivers', icon: '🔲' },
            { action: 'replace-gpu', text: 'Replace GPU', icon: '🎮' },
            { action: 'install-cooler', text: 'Install Cooler', icon: '❄️' }
        ],
        correct: 'check-motherboard',
        explanation: 'USB port issues are often caused by outdated or missing chipset/motherboard drivers. Update your motherboard drivers first!'
    },
    {
        id: 10,
        title: 'PC Makes Grinding Noise',
        emoji: '🟨',
        description: 'You hear a loud grinding or clicking sound from your PC.',
        options: [
            { action: 'failing-hdd', text: 'Failing Hard Drive', icon: '💽' },
            { action: 'update-bios', text: 'Update BIOS', icon: '⚙️' },
            { action: 'reinstall-windows', text: 'Reinstall Windows', icon: '🪟' }
        ],
        correct: 'failing-hdd',
        explanation: 'Grinding or clicking noises usually indicate a failing mechanical hard drive. Back up your data immediately and replace the drive!'
    },
    {
        id: 11,
        title: 'PC Won\'t Sleep',
        emoji: '🟧',
        description: 'Your PC refuses to go into sleep mode and stays awake.',
        options: [
            { action: 'power-settings', text: 'Check Power Settings', icon: '⚡' },
            { action: 'replace-psu', text: 'Replace PSU', icon: '🔌' },
            { action: 'add-ram', text: 'Add More RAM', icon: '💾' }
        ],
        correct: 'power-settings',
        explanation: 'Sleep issues are usually caused by power settings, USB devices keeping the PC awake, or background programs. Check your power plan settings first!'
    },
    {
        id: 12,
        title: 'Games Have Low FPS',
        emoji: '🎮',
        description: 'Games run but with very low frame rates and stuttering.',
        options: [
            { action: 'upgrade-gpu-gaming', text: 'Upgrade GPU', icon: '🎮' },
            { action: 'check-monitor-fps', text: 'Check Monitor', icon: '🖥️' },
            { action: 'replace-keyboard', text: 'Replace Keyboard', icon: '⌨️' }
        ],
        correct: 'upgrade-gpu-gaming',
        explanation: 'Low gaming performance is primarily a GPU issue. Upgrading your graphics card will give you the biggest FPS boost!'
    }
];

// Create shuffled scenario pool for random generation
let shuffledScenarios = [];
let currentScenarioIndex = 0;

function shuffleScenarios() {
    shuffledScenarios = [...scenarioDatabase];
    for (let i = shuffledScenarios.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledScenarios[i], shuffledScenarios[j]] = [shuffledScenarios[j], shuffledScenarios[i]];
    }
    currentScenarioIndex = 0;
}

// Legacy format for backward compatibility
const scenarios = {};
scenarioDatabase.forEach(s => {
    scenarios[s.id] = {
        correct: s.correct,
        explanation: s.explanation
    };
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        initHomePage();
    } else if (path.includes('shop.html')) {
        initShopPage();
    } else if (path.includes('assembly.html')) {
        initAssemblyPage();
    } else if (path.includes('build-summary.html')) {
        initSummaryPage();
    } else if (path.includes('troubleshooting.html')) {
        initTroubleshootingPage();
    }
});

// State Management
function saveState() {
    try {
        localStorage.setItem('selectedParts', JSON.stringify(selectedParts));
        localStorage.setItem('assembledParts', JSON.stringify(assembledParts));
        localStorage.setItem('budget', budget.toString());
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('selectedParts');
        const assembled = localStorage.getItem('assembledParts');
        const savedBudget = localStorage.getItem('budget');
        
        if (saved) selectedParts = JSON.parse(saved);
        if (assembled) assembledParts = JSON.parse(assembled);
        if (savedBudget) budget = parseInt(savedBudget);
    } catch (e) {
        console.error('Error loading state:', e);
        selectedParts = {};
        assembledParts = {};
        budget = 500;
    }
}

function clearState() {
    selectedParts = {};
    assembledParts = {};
    budget = 500;
    saveState();
}

// ===== HOME PAGE =====
function initHomePage() {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
    }
}

// ===== SHOP PAGE =====
function initShopPage() {
    const catalog = document.getElementById('parts-catalog');
    const totalCostEl = document.getElementById('total-cost');
    const budgetFill = document.getElementById('budget-fill');
    const budgetLimitEl = document.getElementById('budget-limit');
    const proceedBtn = document.getElementById('proceed-btn');
    const clearBtn = document.getElementById('clear-btn');
    const addMoneyBtn = document.getElementById('add-money-btn');
    
    if (!catalog) return;
    
    // Update budget display
    if (budgetLimitEl) {
        budgetLimitEl.textContent = budget;
    }
    
    // Render parts
    parts.forEach(part => {
        const partEl = document.createElement('div');
        partEl.className = 'part-item';
        partEl.dataset.id = part.id;
        
        if (selectedParts[part.id]) {
            partEl.classList.add('selected');
        }
        
        partEl.innerHTML = `
            <div class="component-visual ${part.id}-visual">${part.name.split(' ')[0]}</div>
            <h3>${part.name}</h3>
            <p>${part.description}</p>
            <p class="price">${part.cost}</p>
        `;
        
        partEl.addEventListener('click', () => togglePart(part, partEl));
        catalog.appendChild(partEl);
    });
    
    // Toggle part selection
    function togglePart(part, element) {
        if (selectedParts[part.id]) {
            delete selectedParts[part.id];
            element.classList.remove('selected');
        } else {
            selectedParts[part.id] = part;
            element.classList.add('selected');
        }
        updateBudget();
    }
    
    // Update budget display
    function updateBudget() {
        const total = Object.values(selectedParts).reduce((sum, p) => sum + p.cost, 0);
        const percentage = (total / budget) * 100;
        
        totalCostEl.textContent = total;
        budgetFill.style.width = `${Math.min(percentage, 100)}%`;
        
        const hasRequiredParts = selectedParts['cpu'] && selectedParts['psu'];
        const withinBudget = total <= budget;
        
        proceedBtn.disabled = !(hasRequiredParts && withinBudget && Object.keys(selectedParts).length > 0);
        
        if (total > budget) {
            budgetFill.style.background = 'linear-gradient(90deg, #f44336 0%, #e53935 100%)';
        } else {
            budgetFill.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
        }
        
        saveState();
    }
    
    // Add money button
    if (addMoneyBtn) {
        addMoneyBtn.addEventListener('click', () => {
            budget += 100;
            budgetLimitEl.textContent = budget;
            updateBudget();
            saveState();
            
            // Visual feedback
            addMoneyBtn.textContent = '✅ Added!';
            setTimeout(() => {
                addMoneyBtn.textContent = '💰 Add $100';
            }, 1000);
        });
    }
    
    // Clear selection
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            selectedParts = {};
            document.querySelectorAll('.part-item').forEach(el => {
                el.classList.remove('selected');
            });
            updateBudget();
        });
    }
    
    // Proceed to assembly
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            assembledParts = {};
            saveState();
            window.location.href = 'assembly.html';
        });
    }
    
    updateBudget();
}

// ===== ASSEMBLY PAGE =====
function initAssemblyPage() {
    const partsList = document.getElementById('parts-list');
    const finishBtn = document.getElementById('finish-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if (!partsList) return;
    
    // Check if parts were selected
    if (Object.keys(selectedParts).length === 0) {
        alert('Please select parts from the shop first!');
        window.location.href = 'shop.html';
        return;
    }
    
    // Render available parts
    renderAvailableParts();
    
    // Setup drop zones
    setupDropZones();
    
    // Load previously assembled parts
    loadAssembledParts();
    
    // Update progress
    updateProgress();
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset assembly? This will clear all placed parts.')) {
                assembledParts = {};
                saveState();
                location.reload();
            }
        });
    }
    
    // Finish button
    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            if (!assembledParts['cpu'] || !assembledParts['psu']) {
                alert('You must install at least a CPU and PSU before finishing!');
                return;
            }
            saveState();
            window.location.href = 'build-summary.html';
        });
    }
    
    function renderAvailableParts() {
        partsList.innerHTML = '';
        
        Object.values(selectedParts).forEach(part => {
            if (!assembledParts[part.id]) {
                const partEl = document.createElement('div');
                partEl.className = 'part';
                partEl.draggable = true;
                partEl.dataset.part = part.id;
                partEl.innerHTML = `
                    <div class="component-visual ${part.id}-visual" style="width: 40px; height: 40px; font-size: 0.8rem;">
                        ${part.name.split(' ')[0]}
                    </div>
                    <span>${part.name}</span>
                `;
                
                partEl.addEventListener('dragstart', handleDragStart);
                partEl.addEventListener('dragend', handleDragEnd);
                
                partsList.appendChild(partEl);
            }
        });
    }
    
    function setupDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('dragleave', handleDragLeave);
            zone.addEventListener('drop', handleDrop);
        });
    }
    
    function handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.part);
    }
    
    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        const zone = e.currentTarget;
        zone.classList.remove('drag-over');
        
        const partId = e.dataTransfer.getData('text/plain');
        const slotType = zone.dataset.part;
        
        // Check if correct part type
        if (partId !== slotType) {
            alert(`This is a ${slotType.toUpperCase()} slot! You're trying to install a ${partId.toUpperCase()}.`);
            return;
        }
        
        // Check if slot already filled
        if (zone.classList.contains('filled')) {
            alert('This slot is already occupied!');
            return;
        }
        
        // Install part
        const part = selectedParts[partId];
        assembledParts[partId] = part;
        
        zone.classList.add('filled');
        zone.innerHTML = `
            <div class="placed-part" data-part="${partId}" style="background: linear-gradient(135deg, ${getPartColor(partId)});">
                ${part.name}
            </div>
        `;
        
        saveState();
        renderAvailableParts();
        updateProgress();
    }
    
    function loadAssembledParts() {
        Object.entries(assembledParts).forEach(([partId, part]) => {
            const zone = document.querySelector(`#${partId}-slot`);
            if (zone) {
                zone.classList.add('filled');
                zone.innerHTML = `
                    <div class="placed-part" data-part="${partId}" style="background: linear-gradient(135deg, ${getPartColor(partId)});">
                        ${part.name}
                    </div>
                `;
            }
        });
    }
    
    function updateProgress() {
        const totalParts = Object.keys(selectedParts).length;
        const installedParts = Object.keys(assembledParts).length;
        const percentage = (installedParts / totalParts) * 100;
        
        const progressFill = document.getElementById('assembly-progress');
        const partsInstalledEl = document.getElementById('parts-installed');
        const totalPartsEl = document.getElementById('total-parts');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
            progressFill.textContent = `${Math.round(percentage)}%`;
        }
        
        if (partsInstalledEl) partsInstalledEl.textContent = installedParts;
        if (totalPartsEl) totalPartsEl.textContent = totalParts;
    }
    
    function getPartColor(partId) {
        const colors = {
            cpu: '#f093fb 0%, #f5576c 100%',
            ram: '#4facfe 0%, #00f2fe 100%',
            gpu: '#43e97b 0%, #38f9d7 100%',
            storage: '#fa709a 0%, #fee140 100%',
            psu: '#30cfd0 0%, #330867 100%'
        };
        return colors[partId] || '#667eea 0%, #764ba2 100%';
    }
}

// ===== BUILD SUMMARY PAGE =====
function initSummaryPage() {
    const buildList = document.getElementById('build-list');
    const compatibilityEl = document.getElementById('compatibility');
    const powerOnBtn = document.getElementById('power-on-btn');
    const powerResult = document.getElementById('power-result');
    const backBtn = document.getElementById('back-btn');
    const troubleshootBtn = document.getElementById('troubleshoot-btn');
    
    if (!buildList) return;
    
    // Check if build exists
    if (Object.keys(assembledParts).length === 0) {
        alert('No build found! Please assemble your PC first.');
        window.location.href = 'assembly.html';
        return;
    }
    
    // Display components
    buildList.innerHTML = '';
    Object.values(assembledParts).forEach(part => {
        const itemEl = document.createElement('div');
        itemEl.className = 'component-item';
        itemEl.innerHTML = `
            <div class="component-icon ${part.id}-visual">${part.name.split(' ')[0]}</div>
            <div class="component-details">
                <h3>${part.name}</h3>
                <p>${part.description}</p>
            </div>
        `;
        buildList.appendChild(itemEl);
    });
    
    // Compatibility check
    const issues = [];
    let compatible = true;
    
    if (!assembledParts['cpu']) {
        compatible = false;
        issues.push('Missing CPU (required)');
    }
    
    if (!assembledParts['psu']) {
        compatible = false;
        issues.push('Missing Power Supply (required)');
    }
    
    if (assembledParts['gpu'] && !assembledParts['psu']) {
        compatible = false;
        issues.push('GPU requires a power supply');
    }
    
    if (!assembledParts['ram']) {
        issues.push('Warning: No RAM installed (recommended)');
    }
    
    if (!assembledParts['storage']) {
        issues.push('Warning: No storage device (recommended)');
    }
    
    // Display compatibility status
    if (compatible && issues.length === 0) {
        compatibilityEl.className = 'compatibility-status success';
        compatibilityEl.innerHTML = `
            <strong>✅ Build is Compatible!</strong>
            <p>All essential components are properly installed. Your PC is ready to boot!</p>
        `;
    } else if (compatible) {
        compatibilityEl.className = 'compatibility-status warning';
        compatibilityEl.innerHTML = `
            <strong>⚠️ Build Will Work, But...</strong>
            <ul>${issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
        `;
    } else {
        compatibilityEl.className = 'compatibility-status error';
        compatibilityEl.innerHTML = `
            <strong>❌ Build Has Issues!</strong>
            <ul>${issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
        `;
    }
    
    // Power on button
    if (powerOnBtn) {
        powerOnBtn.addEventListener('click', () => {
            powerResult.innerHTML = '';
            
            setTimeout(() => {
                if (compatible) {
                    powerResult.className = 'power-result success';
                    powerResult.innerHTML = `
                        <div class="boot-animation">🎉</div>
                        <h2>SUCCESS!</h2>
                        <p>Your PC has booted successfully! All systems are operational.</p>
                        ${issues.length > 0 ? `<p style="margin-top: 1rem; font-size: 0.9rem;">Note: ${issues.join(', ')}</p>` : ''}
                    `;
                } else {
                    powerResult.className = 'power-result error';
                    powerResult.innerHTML = `
                        <div class="boot-animation">❌</div>
                        <h2>BOOT FAILED!</h2>
                        <p>Your PC cannot boot due to missing essential components.</p>
                        <p style="margin-top: 1rem;">Please return to assembly and install: ${issues.join(', ')}</p>
                    `;
                }
            }, 1000);
        });
    }
    
    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'assembly.html';
        });
    }
    
    // Troubleshoot button
    if (troubleshootBtn) {
        troubleshootBtn.addEventListener('click', () => {
            window.location.href = 'troubleshooting.html';
        });
    }
}

// ===== TROUBLESHOOTING PAGE =====
function initTroubleshootingPage() {
    const scenarioDisplay = document.getElementById('scenario-display');
    const feedbackBox = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-scenario-btn');
    const prevBtn = document.getElementById('prev-scenario-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    const progressBar = document.getElementById('question-progress');
    
    if (!scenarioDisplay) return;
    
    // Initialize shuffled scenarios
    shuffleScenarios();
    
    // Set total questions
    if (totalQuestionsEl) {
        totalQuestionsEl.textContent = shuffledScenarios.length;
    }
    
    let answeredCorrectly = new Set();
    
    function renderScenario(index) {
        if (index < 0 || index >= shuffledScenarios.length) return;
        
        const scenario = shuffledScenarios[index];
        currentScenarioIndex = index;
        
        // Update progress
        if (currentQuestionEl) {
            currentQuestionEl.textContent = index + 1;
        }
        if (progressBar) {
            const percentage = ((index + 1) / shuffledScenarios.length) * 100;
            progressBar.style.width = `${percentage}%`;
        }
        
        // Generate options HTML
        const optionsHTML = scenario.options.map(option => `
            <button class="option-btn" data-action="${option.action}">
                <span class="option-icon">${option.icon}</span>
                <span>${option.text}</span>
            </button>
        `).join('');
        
        // Render scenario
        scenarioDisplay.innerHTML = `
            <div class="scenario-header">
                <h2>${scenario.emoji} ${scenario.title}</h2>
                <p>${scenario.description}</p>
            </div>
            <div class="scenario-content">
                <h3>What should you do?</h3>
                <div class="options-grid">
                    ${optionsHTML}
                </div>
            </div>
        `;
        
        // Add event listeners to option buttons
        const optionButtons = scenarioDisplay.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                handleAnswer(btn.dataset.action, scenario, btn);
            });
        });
        
        // Update navigation buttons
        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = index === shuffledScenarios.length - 1;
        }
        
        // Clear feedback
        feedbackBox.innerHTML = '';
        feedbackBox.style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function handleAnswer(action, scenario, button) {
        const isCorrect = action === scenario.correct;
        
        // Reset all buttons
        const allButtons = scenarioDisplay.querySelectorAll('.option-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = true; // Disable after answering
        });
        
        // Mark selected button
        if (isCorrect) {
            button.classList.add('correct');
            answeredCorrectly.add(scenario.id);
            feedbackBox.className = 'feedback-box success';
            feedbackBox.innerHTML = `
                <h3>✅ Correct!</h3>
                <p>${scenario.explanation}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">
                    <strong>Progress:</strong> ${answeredCorrectly.size} / ${shuffledScenarios.length} questions answered correctly
                </p>
            `;
        } else {
            button.classList.add('incorrect');
            feedbackBox.className = 'feedback-box error';
            feedbackBox.innerHTML = `
                <h3>❌ Not Quite!</h3>
                <p>Try again! Think about what would cause this specific issue.</p>
                <p style="margin-top: 0.5rem; font-style: italic;">Hint: ${scenario.explanation.split('.')[0]}...</p>
            `;
            
            // Re-enable buttons for retry
            setTimeout(() => {
                allButtons.forEach(btn => {
                    btn.disabled = false;
                    btn.classList.remove('incorrect');
                });
            }, 2000);
        }
        
        feedbackBox.style.display = 'block';
    }
    
    // Navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentScenarioIndex < shuffledScenarios.length - 1) {
                renderScenario(currentScenarioIndex + 1);
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentScenarioIndex > 0) {
                renderScenario(currentScenarioIndex - 1);
            }
        });
    }
    
    // Shuffle button
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            if (confirm('Shuffle all questions and start over?')) {
                shuffleScenarios();
                answeredCorrectly.clear();
                renderScenario(0);
                
                // Visual feedback
                shuffleBtn.textContent = '✅ Shuffled!';
                setTimeout(() => {
                    shuffleBtn.textContent = '🔀 Shuffle Questions';
                }, 1500);
            }
        });
    }
    
    // Initialize first scenario
    renderScenario(0);
}

// Utility Functions
function getPartColor(partId) {
    const colors = {
        cpu: '#f093fb 0%, #f5576c 100%',
        ram: '#4facfe 0%, #00f2fe 100%',
        gpu: '#43e97b 0%, #38f9d7 100%',
        storage: '#fa709a 0%, #fee140 100%',
        psu: '#30cfd0 0%, #330867 100%'
    };
    return colors[partId] || '#667eea 0%, #764ba2 100%';
}

// Export for debugging (optional)
if (typeof window !== 'undefined') {
    window.PCSimulator = {
        selectedParts,
        assembledParts,
        parts,
        clearState,
        saveState,
        loadState
    };
}