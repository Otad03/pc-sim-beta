// ===== GLOBAL STATE =====
let selectedParts = {};
let assembledParts = {};
let connections = {}; // { cableId: { source: {part, port}, target: {part, port}, type, color } }
let currentScenario = 1;
let budget = 500;

// ===== PC PARTS DATABASE =====
const parts = [
    { 
        id: 'cpu', 
        name: 'Intel Core i9 13900k', 
        cost: 600, 
        description: 'Powerful 24-core processor',
        required: true
    },
        { 
        id: 'cpu', 
        name: 'Intel Core i5 13600k', 
        cost: 400, 
        description: 'Powerful 14-core processor',
        required: true
    },
            { 
        id: 'cpu', 
        name: 'AMD Ryzen 9 7950k', 
        cost: 500, 
        description: 'Powerful 16-core processor',
        required: true
    },
                { 
        id: 'cpu', 
        name: 'AMD Ryzen 5 5600x', 
        cost: 200, 
        description: '6-core processor',
        required: true
    },
                { 
        id: 'cpu', 
        name: 'Apple M2 Base', 
        cost: 100, 
        description: '8-core processor',
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
        id: 'gpu', 
        name: 'NVIDIA RTX 4090', 
        cost: 500, 
        description: 'Graphics card for gaming',
        required: false
    },
        { 
        id: 'gpu', 
        name: 'AMD Radeon Rx 7900 Xt', 
        cost: 400, 
        description: 'Graphics card for gaming',
        required: false
    },
        { 
        id: 'gpu', 
        name: 'AMD Radeon Rx 6800 Xt', 
        cost: 300, 
        description: 'Graphics card for gaming',
        required: false
    },
        { 
        id: 'gpu', 
        name: 'NVIDIA GTX 1060', 
        cost: 200, 
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
        id: 'storage', 
        name: 'WD Black 1TB SSD', 
        cost: 240, 
        description: 'Fast solid state drive',
        required: false
    },
        { 
        id: 'storage', 
        name: 'Seagate 2TB HDD', 
        cost: 250, 
        description: 'Fast Hard Disk Drive',
        required: false
    },
    { 
        id: 'psu', 
        name: 'EVGA 650W PSU', 
        cost: 80, 
        description: 'Reliable power supply',
        required: true
    },
        { 
        id: 'psu', 
        name: 'Corsair CX650M PSU', 
        cost: 80, 
        description: 'Reliable power supply',
        required: true
    },
        { 
        id: 'psu', 
        name: 'Seasonic Focus GX 750 PSU', 
        cost: 80, 
        description: 'Reliable power supply',
        required: true
    },
];

// ===== CABLE TYPES =====
const cableTypes = {
    atx24: { 
        id: 'atx24',
        name: '24-pin ATX', 
        color: '#ff9800', 
        icon: '🔌', 
        description: 'Motherboard main power',
        sourcePorts: ['psu_atx24'],
        targetPorts: ['mb_atx24']
    },
    eps8: { 
        id: 'eps8',
        name: '8-pin EPS', 
        color: '#2196F3', 
        icon: '⚡', 
        description: 'CPU power cable',
        sourcePorts: ['psu_cpu8'],
        targetPorts: ['cpu_power']
    },
    pcie8: { 
        id: 'pcie8',
        name: '8-pin PCIe', 
        color: '#4CAF50', 
        icon: '🔌', 
        description: 'GPU power cable',
        sourcePorts: ['psu_pcie8'],
        targetPorts: ['gpu_power']
    },
    sata: { 
        id: 'sata',
        name: 'SATA Power', 
        color: '#9C27B0', 
        icon: '⚡', 
        description: 'Storage power cable',
        sourcePorts: ['psu_sata'],
        targetPorts: ['storage_power']
    }
};

// ===== PORT DEFINITIONS =====
const portDefinitions = {
    // PSU Ports
    psu_atx24: { label: '24-pin', type: 'atx24', part: 'psu', position: 'bottom' },
    psu_cpu8: { label: 'CPU 8-pin', type: 'eps8', part: 'psu', position: 'bottom' },
    psu_pcie8: { label: 'PCIe 8-pin', type: 'pcie8', part: 'psu', position: 'bottom' },
    psu_sata: { label: 'SATA', type: 'sata', part: 'psu', position: 'bottom' },

    // Component Ports
    mb_atx24: { label: 'ATX 24-pin', type: 'atx24', part: 'motherboard', position: 'right' },
    cpu_power: { label: 'CPU Power', type: 'eps8', part: 'cpu', position: 'top' },
    gpu_power: { label: 'GPU Power', type: 'pcie8', part: 'gpu', position: 'top' },
    storage_power: { label: 'SATA Power', type: 'sata', part: 'storage', position: 'left' },
};

// ===== TROUBLESHOOTING DATABASE =====
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

// ===== STATE MANAGEMENT =====
function saveState() {
    try {
        localStorage.setItem('selectedParts', JSON.stringify(selectedParts));
        localStorage.setItem('assembledParts', JSON.stringify(assembledParts));
        localStorage.setItem('connections', JSON.stringify(connections));
        localStorage.setItem('budget', budget.toString());
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('selectedParts');
        const assembled = localStorage.getItem('assembledParts');
        const savedConnections = localStorage.getItem('connections');
        const savedBudget = localStorage.getItem('budget');
        
        if (saved) selectedParts = JSON.parse(saved);
        if (assembled) assembledParts = JSON.parse(assembled);
        if (savedConnections) connections = JSON.parse(savedConnections);
        if (savedBudget) budget = parseInt(savedBudget);
    } catch (e) {
        console.error('Error loading state:', e);
        selectedParts = {};
        assembledParts = {};
        connections = {};
        budget = 500;
    }
}

function clearState() {
    selectedParts = {};
    assembledParts = {};
    connections = {};
    budget = 500;
    saveState();
}

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/') || path === '') {
        initHomePage();
    } else if (path.includes('shop.html')) {
        initShopPage();
    } else if (path.includes('shop.html')) {
        initTeamPage();
    } else if (path.includes('assembly.html')) {
        initAssemblyPage();
    } else if (path.includes('build-summary.html')) {
        initSummaryPage();
    } else if (path.includes('troubleshooting.html')) {
        initTroubleshootingPage();
    }
});

function initTeamPage() {
    console.log("Team page initialized");
    
    // Add any team page specific JavaScript here
    document.addEventListener('DOMContentLoaded', function() {
        // Add social icon interaction
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.querySelector('i').className.split(' ')[1];
                console.log(`Social icon clicked: ${platform}`);
                alert(`This would link to the team member's ${platform.replace('fa-', '')} profile`);
            });
        });
        
        console.log('Team page JavaScript loaded successfully!');
    });
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

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        font-size: 0.95rem;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add the slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== SHOP PAGE =====
function initShopPage() {
    const catalog = document.getElementById('parts-catalog');
    const totalCostEl = document.getElementById('total-cost');
    const budgetFill = document.getElementById('budget-fill');
    const budgetLimitEl = document.getElementById('budget-limit');
    const proceedBtn = document.getElementById('proceed-btn');
    const clearBtn = document.getElementById('clear-btn');
    const addMoneyBtn = document.getElementById('add-money-btn');
    const minMoneyBtn = document.getElementById('min-money-btn');

    if (!catalog) return;
    
    if (budgetLimitEl) budgetLimitEl.textContent = budget;
    
parts.forEach(part => {
    const partEl = document.createElement('div');
    partEl.className = 'part-item';
    partEl.dataset.id = part.id;
    partEl.dataset.name = part.name; // Add name as data attribute
    
    // Check if this exact part is selected
    if (selectedParts[part.id] && selectedParts[part.id].name === part.name) {
        partEl.classList.add('selected');
    }
    
    partEl.innerHTML = `
        <div class="component-visual ${part.id}-visual">${part.name.split(' ')[0]}</div>
        <h3>${part.name}</h3>
        <p>${part.description}</p>
        <p class="price">$${part.cost}</p>
    `;
    
    partEl.addEventListener('click', () => togglePart(part, partEl));
    catalog.appendChild(partEl);
});
    
   function togglePart(part, element) {
    // Check if we already have a part of this type selected
    const partType = part.id; // 'cpu', 'ram', 'gpu', 'storage', 'psu'
    
    if (selectedParts[partType]) {
        // If clicking the same part that's already selected, deselect it
        if (selectedParts[partType].name === part.name) {
            delete selectedParts[partType];
            element.classList.remove('selected');
        } else {
            // If selecting a different part of the same type, replace it
            // First, remove the old selection from the UI
            const oldPartElement = document.querySelector(`.part-item.selected[data-id="${partType}"]`);
            if (oldPartElement) {
                oldPartElement.classList.remove('selected');
            }
            
            // Then select the new part
            selectedParts[partType] = part;
            element.classList.add('selected');
            
            // Show a notification that the part was replaced
            showNotification(`Replaced with: ${part.name}`, 'info');
        }
    } else {
        // If no part of this type is selected yet, select it
        selectedParts[partType] = part;
        element.classList.add('selected');
    }
    
    updateBudget();
}
    
    function updateBudget() {
        const total = Object.values(selectedParts).reduce((sum, p) => sum + p.cost, 0);
        const percentage = (total / budget) * 100;
        
        totalCostEl.textContent = total;
        budgetFill.style.width = `${Math.min(percentage, 100)}%`;
        
        const hasRequiredParts = selectedParts['cpu'] && selectedParts['psu'];
        const withinBudget = total <= budget;
        
        proceedBtn.disabled = !(hasRequiredParts && withinBudget && Object.keys(selectedParts).length > 0);
        
        budgetFill.style.background = total > budget ? 
            'linear-gradient(90deg, #f44336 0%, #e53935 100%)' : 
            'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
        
        saveState();
    }
    
    if (addMoneyBtn) {
        addMoneyBtn.addEventListener('click', () => {
            budget += 100;
            budgetLimitEl.textContent = budget;
            updateBudget();
            saveState();
            
            addMoneyBtn.textContent = '✅ Added!';
            setTimeout(() => {
                addMoneyBtn.textContent = '💰 Add $100';
            }, 1000);
        });
    }

    if (minMoneyBtn) {
        minMoneyBtn.addEventListener('click', () => {
            budget -= 100;
            budgetLimitEl.textContent = budget;
            updateBudget();
            saveState();
            
            minMoneyBtn.textContent = '✅ Removed!';
            setTimeout(() => {
                minMoneyBtn.textContent = '💰 Remove $100';
            }, 1000);
        });
    }
    
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        selectedParts = {};
        document.querySelectorAll('.part-item').forEach(el => el.classList.remove('selected'));
        updateBudget();
        showNotification('All parts cleared!', 'info');
    });
}
    
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            assembledParts = {};
            connections = {};
            saveState();
            window.location.href = 'assembly.html';
        });
    }
    
    updateBudget();
}

// ===== ASSEMBLY PAGE =====
function initAssemblyPage() {
    const finishBtn = document.getElementById('finish-btn');
    const resetBtn = document.getElementById('reset-btn');
    const cablesStatus = document.getElementById('cables-status');
    
    if (!document.querySelector('.motherboard-area')) return;
    
    let selectedCableType = null;
    let isDraggingFromPort = false;
    let dragStartPort = null;
    let tempCable = null;
    let tempCableShadow = null;
    let lastMousePosition = { x: 0, y: 0 };
    
    if (Object.keys(selectedParts).length === 0) {
        alert('Please select parts from the shop first!');
        window.location.href = 'shop.html';
        return;
    }
    
    renderAvailableParts();
    setupDropZones();
    loadAssembledParts();
    updateProgress();
    renderCableTools();
    renderCableLayer();
    loadConnections();
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset assembly? This will clear all placed parts and cables.')) {
                assembledParts = {};
                connections = {};
                saveState();
                location.reload();
            }
        });
    }
    
    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            if (!assembledParts['cpu'] || !assembledParts['psu']) {
                alert('You must install at least a CPU and PSU before finishing!');
                return;
            }
            
            // Check for required connections
            const missingConnections = [];
            
            // Check motherboard power
            const hasMotherboardPower = Object.values(connections).some(conn => 
                conn.target.part === 'motherboard' && conn.target.port === 'mb_atx24'
            );
            if (!hasMotherboardPower) {
                missingConnections.push('24-pin ATX Power (Motherboard)');
            }
            
            // Check CPU power
            const hasCpuPower = Object.values(connections).some(conn => 
                conn.target.part === 'cpu' && conn.target.port === 'cpu_power'
            );
            if (!hasCpuPower) {
                missingConnections.push('CPU Power Cable');
            }
            
            if (missingConnections.length > 0) {
                if (!confirm(`⚠️ Warning: The following cables are not connected:\n\n${missingConnections.join('\n')}\n\nYour PC may not work properly. Continue anyway?`)) {
                    return;
                }
            }
            
            saveState();
            window.location.href = 'build-summary.html';
        });
    }
    
    function renderCableTools() {
        const cableToolsContainer = document.querySelector('.cable-tools');
        if (!cableToolsContainer) return;
        
        cableToolsContainer.innerHTML = '';
        
        // Render cable tools
        Object.values(cableTypes).forEach(cableType => {
            const cableTool = document.createElement('div');
            cableTool.className = 'cable-tool';
            cableTool.dataset.tool = cableType.id;
            cableTool.title = `Click to select ${cableType.name}`;
            
            cableTool.innerHTML = `
                <span class="cable-icon">${cableType.icon}</span>
                <div>
                    <div>${cableType.name}</div>
                    <span class="cable-type">${cableType.description}</span>
                    <div class="cable-instruction">Click to select cable</div>
                </div>
            `;
            
            // Click to select cable
            cableTool.addEventListener('click', (e) => {
                e.stopPropagation();
                selectCableTool(cableType, cableTool);
            });
            
            cableToolsContainer.appendChild(cableTool);
        });
    }
    
    function selectCableTool(cableType, toolElement) {
        // Deselect all cable tools
        document.querySelectorAll('.cable-tool').forEach(tool => {
            tool.classList.remove('selected');
        });
        
        // Select this cable
        toolElement.classList.add('selected');
        selectedCableType = cableType.id;
        
        showNotification(`Selected: ${cableType.name}. Click and drag FROM any PSU port to a component port.`, 'info');
    }
    
    function createSVGFilters() {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        
        // Shadow filter for cables
        const shadowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        shadowFilter.setAttribute('id', 'cable-shadow');
        shadowFilter.setAttribute('x', '-50%');
        shadowFilter.setAttribute('y', '-50%');
        shadowFilter.setAttribute('width', '200%');
        shadowFilter.setAttribute('height', '200%');
        
        const feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
        feOffset.setAttribute('result', 'offOut');
        feOffset.setAttribute('in', 'SourceAlpha');
        feOffset.setAttribute('dx', '1');
        feOffset.setAttribute('dy', '1');
        
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('result', 'blurOut');
        feGaussianBlur.setAttribute('in', 'offOut');
        feGaussianBlur.setAttribute('stdDeviation', '1');
        
        const feBlend = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
        feBlend.setAttribute('in', 'SourceGraphic');
        feBlend.setAttribute('in2', 'blurOut');
        feBlend.setAttribute('mode', 'normal');
        feBlend.setAttribute('opacity', '0.3');
        
        shadowFilter.appendChild(feOffset);
        shadowFilter.appendChild(feGaussianBlur);
        shadowFilter.appendChild(feBlend);
        defs.appendChild(shadowFilter);
        
        // Glow filter for connected cables
        const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        glowFilter.setAttribute('id', 'cable-glow');
        glowFilter.setAttribute('x', '-50%');
        glowFilter.setAttribute('y', '-50%');
        glowFilter.setAttribute('width', '200%');
        glowFilter.setAttribute('height', '200%');
        
        const feGaussianBlur2 = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur2.setAttribute('stdDeviation', '2');
        feGaussianBlur2.setAttribute('result', 'coloredBlur');
        
        const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode1.setAttribute('in', 'coloredBlur');
        const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode2.setAttribute('in', 'SourceGraphic');
        
        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        
        glowFilter.appendChild(feGaussianBlur2);
        glowFilter.appendChild(feMerge);
        defs.appendChild(glowFilter);
        
        return defs;
    }
    
    function setupPortEvents(portElement) {
        portElement.addEventListener('mousedown', handlePortMouseDown);
        portElement.addEventListener('mouseup', handlePortMouseUp);
        portElement.addEventListener('mouseenter', handlePortMouseEnter);
        portElement.addEventListener('mouseleave', handlePortMouseLeave);
    }
    
    function handlePortMouseDown(e) {
        if (!selectedCableType) {
            showNotification('First select a cable type from the tool palette!', 'error');
            return;
        }
        
        const port = e.currentTarget;
        const portId = port.dataset.port;
        const portDef = portDefinitions[portId];
        
        if (!portDef) return;
        
        const cableType = cableTypes[selectedCableType];
        
        // Check if this port can be a source for the selected cable
        if (!cableType.sourcePorts.includes(portId)) {
            showNotification(`This port cannot be a source for ${cableType.name}`, 'error');
            return;
        }
        
        // Check if port is already connected
        if (isPortConnected(portId)) {
            showNotification('This port is already connected!', 'error');
            return;
        }
        
        isDraggingFromPort = true;
        dragStartPort = {
            element: port,
            id: portId,
            def: portDef
        };
        
        // Start drawing temporary cable
        startDrawingTempCable(e, cableType);
        
        // Add mouse move listener
        document.addEventListener('mousemove', handleCableDragging);
        document.addEventListener('mouseup', handleDocumentMouseUp);
        
        e.stopPropagation();
        e.preventDefault();
    }
    
    function startDrawingTempCable(e, cableType) {
        const cableLayer = document.getElementById('cable-svg');
        
        // Create shadow line first (for depth effect)
        tempCableShadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempCableShadow.setAttribute('class', 'cable-line temp cable-shadow');
        tempCableShadow.setAttribute('stroke', 'rgba(0,0,0,0.3)');
        tempCableShadow.setAttribute('stroke-width', '6');
        
        // Create main cable line
        tempCable = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempCable.setAttribute('class', 'cable-line temp');
        tempCable.setAttribute('stroke', cableType.color);
        tempCable.setAttribute('stroke-width', '3');
        
        cableLayer.appendChild(tempCableShadow);
        cableLayer.appendChild(tempCable);
        
        // Store mouse position
        lastMousePosition = { x: e.clientX, y: e.clientY };
        
        // Update cable immediately
        updateTempCable(e);
    }
    
    function handlePortMouseUp(e) {
        // Not used for this implementation
    }
    
    function handleDocumentMouseUp(e) {
        if (!isDraggingFromPort || !dragStartPort) return;
        
        // Find if we're over a valid target port
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const targetPort = elements.find(el => 
            el.classList.contains('port') && 
            el !== dragStartPort.element &&
            !el.classList.contains('connected')
        );
        
        if (targetPort) {
            const portId = targetPort.dataset.port;
            const portDef = portDefinitions[portId];
            const cableType = cableTypes[selectedCableType];
            
            if (portDef && cableType) {
                // Check if this port can be a target for the selected cable
                if (cableType.targetPorts.includes(portId)) {
                    // Create connection
                    createConnection(dragStartPort, { 
                        element: targetPort, 
                        id: portId, 
                        def: portDef 
                    }, cableType);
                } else {
                    showNotification(`Cannot connect ${cableType.name} to this port`, 'error');
                }
            }
        } else {
            showNotification('Connection cancelled - no valid target port', 'info');
        }
        
        cleanupDragging();
    }
    
    function handlePortMouseEnter(e) {
        const port = e.currentTarget;
        if (isDraggingFromPort && dragStartPort && port !== dragStartPort.element) {
            // Slightly enlarge port when dragging over it
            port.style.transform = 'scale(1.3)';
            port.style.boxShadow = '0 0 12px rgba(76, 175, 80, 0.8)';
        }
    }
    
    function handlePortMouseLeave(e) {
        const port = e.currentTarget;
        if (!port.classList.contains('connected')) {
            port.style.transform = '';
            port.style.boxShadow = '';
        }
    }
    
    function handleCableDragging(e) {
        if (!isDraggingFromPort || !tempCable) return;
        
        lastMousePosition = { x: e.clientX, y: e.clientY };
        updateTempCable(e);
    }
    
    function updateTempCable(e) {
        if (!dragStartPort || !tempCable || !tempCableShadow) return;
        
        const startRect = dragStartPort.element.getBoundingClientRect();
        const cableLayer = document.getElementById('cable-svg');
        const layerRect = cableLayer.getBoundingClientRect();
        
        const startX = startRect.left + startRect.width / 2 - layerRect.left;
        const startY = startRect.top + startRect.height / 2 - layerRect.top;
        const endX = e.clientX - layerRect.left;
        const endY = e.clientY - layerRect.top;
        
        // Create a curved cable path
        const dx = endX - startX;
        const dy = endY - startY;
        const controlX1 = startX + dx * 0.5;
        const controlY1 = startY;
        const controlX2 = endX - dx * 0.5;
        const controlY2 = endY;
        
        const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
        
        tempCable.setAttribute('d', pathData);
        tempCableShadow.setAttribute('d', pathData);
    }
    
    function cleanupDragging() {
        isDraggingFromPort = false;
        dragStartPort = null;
        
        if (tempCable) {
            tempCable.remove();
            tempCable = null;
        }
        
        if (tempCableShadow) {
            tempCableShadow.remove();
            tempCableShadow = null;
        }
        
        document.removeEventListener('mousemove', handleCableDragging);
        document.removeEventListener('mouseup', handleDocumentMouseUp);
        
        // Reset any port hover effects
        document.querySelectorAll('.port').forEach(port => {
            if (!port.classList.contains('connected')) {
                port.style.transform = '';
                port.style.boxShadow = '';
            }
        });
    }
    
    function createConnection(source, target, cableType) {
        const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        connections[connectionId] = {
            source: {
                part: source.def.part,
                port: source.id
            },
            target: {
                part: target.def.part,
                port: target.id
            },
            type: cableType.id,
            color: cableType.color
        };
        
        drawPermanentConnection(connectionId, source.element, target.element, cableType);
        
        source.element.classList.add('connected');
        target.element.classList.add('connected');
        
        showNotification(`✓ ${cableType.name} connected successfully!`, 'success');
        updateCableStatus();
        saveState();
        
        // Deselect cable after successful connection
        selectedCableType = null;
        document.querySelectorAll('.cable-tool').forEach(tool => {
            tool.classList.remove('selected');
        });
    }
    
    function drawPermanentConnection(connectionId, sourceElement, targetElement, cableType) {
        const cableLayer = document.getElementById('cable-svg');
        
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const layerRect = cableLayer.getBoundingClientRect();
        
        const startX = sourceRect.left + sourceRect.width / 2 - layerRect.left;
        const startY = sourceRect.top + sourceRect.height / 2 - layerRect.top;
        const endX = targetRect.left + targetRect.width / 2 - layerRect.left;
        const endY = targetRect.top + targetRect.height / 2 - layerRect.top;
        
        // Create shadow first
        const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shadowPath.setAttribute('id', `${connectionId}-shadow`);
        shadowPath.setAttribute('class', 'cable-shadow');
        shadowPath.setAttribute('stroke', 'rgba(0,0,0,0.2)');
        shadowPath.setAttribute('stroke-width', '6');
        shadowPath.setAttribute('fill', 'none');
        
        // Create main cable path
        const cablePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cablePath.setAttribute('id', connectionId);
        cablePath.setAttribute('class', 'cable-line permanent');
        cablePath.setAttribute('stroke', cableType.color);
        cablePath.setAttribute('stroke-width', '4');
        cablePath.setAttribute('fill', 'none');
        
        // Create realistic cable path with subtle curves
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Add slight curvature to make it look like a real cable
        const curvature = distance * 0.1;
        const controlX1 = startX + dx * 0.4;
        const controlY1 = startY + curvature;
        const controlX2 = endX - dx * 0.4;
        const controlY2 = endY - curvature;
        
        const cableData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
        
        shadowPath.setAttribute('d', cableData);
        cablePath.setAttribute('d', cableData);
        
        cableLayer.appendChild(shadowPath);
        cableLayer.appendChild(cablePath);
        
        // Add animation for cable "settling"
        const length = cablePath.getTotalLength();
        cablePath.style.strokeDasharray = length;
        cablePath.style.strokeDashoffset = length;
        shadowPath.style.strokeDasharray = length;
        shadowPath.style.strokeDashoffset = length;
        
        setTimeout(() => {
            cablePath.style.transition = 'stroke-dashoffset 0.8s ease-out';
            shadowPath.style.transition = 'stroke-dashoffset 0.8s ease-out';
            cablePath.style.strokeDashoffset = '0';
            shadowPath.style.strokeDashoffset = '0';
        }, 10);
    }
    
    function isPortConnected(portId) {
        return Object.values(connections).some(conn => 
            conn.source.port === portId || conn.target.port === portId
        );
    }
    
    function renderCableLayer() {
        const motherboardArea = document.querySelector('.motherboard-area');
        if (!motherboardArea) return;
        
        // Remove existing cable layer if any
        const existingLayer = document.getElementById('cable-svg');
        if (existingLayer) {
            existingLayer.remove();
        }
        
        const cableLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cableLayer.id = 'cable-svg';
        cableLayer.className = 'cable-layer';
        cableLayer.setAttribute('width', '100%');
        cableLayer.setAttribute('height', '100%');
        cableLayer.style.position = 'absolute';
        cableLayer.style.top = '0';
        cableLayer.style.left = '0';
        cableLayer.style.pointerEvents = 'none';
        cableLayer.style.zIndex = '2';
        
        // Add SVG filters for effects
        const filters = createSVGFilters();
        cableLayer.appendChild(filters);
        
        motherboardArea.appendChild(cableLayer);
    }
    
    function loadConnections() {
        Object.entries(connections).forEach(([connectionId, connection]) => {
            const sourceElement = document.querySelector(`.port[data-port="${connection.source.port}"]`);
            const targetElement = document.querySelector(`.port[data-port="${connection.target.port}"]`);
            const cableType = cableTypes[connection.type];
            
            if (sourceElement && targetElement && cableType) {
                sourceElement.classList.add('connected');
                targetElement.classList.add('connected');
                drawPermanentConnection(connectionId, sourceElement, targetElement, cableType);
            }
        });
        
        updateCableStatus();
    }
    
    function updateCableStatus() {
        if (!cablesStatus) return;
        
        const totalConnections = Object.keys(connections).length;
        const cableText = totalConnections === 1 ? 'cable' : 'cables';
        cablesStatus.innerHTML = `<span id="cables-connected">${totalConnections}</span> ${cableText} connected`;
        
        if (totalConnections > 0) {
            cablesStatus.style.color = '#4CAF50';
            cablesStatus.style.fontWeight = '600';
        } else {
            cablesStatus.style.color = '#666';
        }
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            font-size: 0.95rem;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    function renderAvailableParts() {
        const partsList = document.getElementById('parts-list');
        if (!partsList) return;
        
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
                
                partEl.addEventListener('dragstart', handlePartDragStart);
                partEl.addEventListener('dragend', handlePartDragEnd);
                
                partsList.appendChild(partEl);
            }
        });
        
        // If no parts available, show message
        if (partsList.children.length === 0) {
            partsList.innerHTML = '<p style="color: #666; font-style: italic; text-align: center; padding: 1rem;">All parts installed on motherboard</p>';
        }
    }
    
function createPortsForPart(partId, zone) {
    // Find ports for this part
    const partPorts = Object.entries(portDefinitions)
        .filter(([portId, def]) => def.part === partId)
        .map(([portId, def]) => ({ id: portId, ...def }));
    
    // Special handling for PSU ports - position on different sides
    if (partId === 'psu') {
        // Create a container for the PSU visual
        const visualContainer = document.createElement('div');
        visualContainer.className = 'psu-visual-container';
        
        // Keep the existing placed-part div
        const placedPart = zone.querySelector('.placed-part');
        if (placedPart) {
            visualContainer.appendChild(placedPart);
        }
        
        // Clear the zone and add the container
        zone.innerHTML = '';
        zone.appendChild(visualContainer);
        
        // Create ports on different sides
        partPorts.forEach((portDef) => {
            const port = document.createElement('div');
            port.className = 'port';
            port.dataset.port = portDef.id;
            port.title = `${portDef.label} (${portDef.type})`;
            
            // Add label
            const label = document.createElement('div');
            label.className = 'port-label';
            label.textContent = portDef.label;
            
            port.appendChild(label);
            visualContainer.appendChild(port);
            
            setupPortEvents(port);
        });
    } else {
        // Original positioning for other parts
        partPorts.forEach(portDef => {
            const port = document.createElement('div');
            port.className = 'port';
            port.dataset.port = portDef.id;
            port.title = `${portDef.label} (${portDef.type})`;
            
            // Position the port based on position type
            const zoneRect = zone.getBoundingClientRect();
            let top, left;
            
            switch(portDef.position) {
                case 'top':
                    top = -20;
                    left = '50%';
                    port.style.top = `${top}px`;
                    port.style.left = left;
                    port.style.transform = 'translateX(-50%)';
                    break;
                case 'bottom':
                    top = zoneRect.height;
                    left = '50%';
                    port.style.top = `${top}px`;
                    port.style.left = left;
                    port.style.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    top = '50%';
                    left = -20;
                    port.style.top = top;
                    port.style.left = `${left}px`;
                    port.style.transform = 'translateY(-50%)';
                    break;
                case 'right':
                    top = '50%';
                    left = zoneRect.width + 5;
                    port.style.top = top;
                    port.style.left = `${left}px`;
                    port.style.transform = 'translateY(-50%)';
                    break;
            }
            
            // Add label
            const label = document.createElement('div');
            label.className = 'port-label';
            label.textContent = portDef.label;
            
            // Position label based on port position
            switch(portDef.position) {
                case 'top':
                    label.style.top = '-35px';
                    label.style.left = '50%';
                    label.style.transform = 'translateX(-50%)';
                    break;
                case 'bottom':
                    label.style.top = '25px';
                    label.style.left = '50%';
                    label.style.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    label.style.top = '50%';
                    label.style.left = '-70px';
                    label.style.transform = 'translateY(-50%)';
                    label.style.textAlign = 'right';
                    break;
                case 'right':
                    label.style.top = '50%';
                    label.style.left = '25px';
                    label.style.transform = 'translateY(-50%)';
                    label.style.textAlign = 'left';
                    break;
            }
            
            port.appendChild(label);
            zone.appendChild(port);
            
            setupPortEvents(port);
        });
    }
}
    
    function setupDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('dragleave', handleDragLeave);
            zone.addEventListener('drop', handleDrop);
        });
    }
    
    function handlePartDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.part);
    }
    
    function handlePartDragEnd(e) {
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
        
        if (partId !== slotType) {
            alert(`This is a ${slotType.toUpperCase()} slot! You're trying to install a ${partId.toUpperCase()}.`);
            return;
        }
        
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
        
        // Create ports for the installed part
        if (partId !== 'ram') { // RAM doesn't have power ports
            createPortsForPart(partId, zone);
        }
        
        // Create motherboard ports if PSU is installed
        if (partId === 'psu') {
            const motherboard = document.querySelector('.motherboard');
            createPortsForPart('motherboard', motherboard);
        }
        
        saveState();
        renderAvailableParts();
        updateProgress();
        
        // Show notification
        showNotification(`${part.name} installed successfully!`, 'success');
    }
    
function loadAssembledParts() {
    Object.entries(assembledParts).forEach(([partId, part]) => {
        const zone = document.querySelector(`#${partId}-slot`);
        if (zone) {
            zone.classList.add('filled');
            
            // For PSU, we'll handle it differently in createPortsForPart
            if (partId === 'psu') {
                zone.innerHTML = `
                    <div class="placed-part" data-part="${partId}" style="background: linear-gradient(135deg, ${getPartColor(partId)});">
                        ${part.name}
                    </div>
                `;
            } else {
                zone.innerHTML = `
                    <div class="placed-part" data-part="${partId}" style="background: linear-gradient(135deg, ${getPartColor(partId)});">
                        ${part.name}
                    </div>
                `;
            }
            
            // Create ports for the installed part
            if (partId !== 'ram') {
                createPortsForPart(partId, zone);
            }
            
            // Create motherboard ports if PSU is installed
            if (partId === 'psu') {
                const motherboard = document.querySelector('.motherboard');
                createPortsForPart('motherboard', motherboard);
            }
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
    
    // Check connections
    const hasMotherboardPower = Object.values(connections).some(conn => 
        conn.target.part === 'motherboard' && conn.target.port === 'mb_atx24'
    );
    if (!hasMotherboardPower) {
        issues.push('Warning: Motherboard not connected to power');
    }
    
    const hasCpuPower = Object.values(connections).some(conn => 
        conn.target.part === 'cpu' && conn.target.port === 'cpu_power'
    );
    if (!hasCpuPower) {
        issues.push('Warning: CPU not connected to power');
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
        connections,
        parts,
        clearState,
        saveState,
        loadState
    };
}