// --- GLOBAL STATE ---
let currentUserRole = null; 
let monitorInterval = null;

// --- NAVIGATION ---
function navigate(sectionId) {
    // 1. Switch View
    document.querySelectorAll('.section-view').forEach(el => el.classList.remove('active-view'));
    document.getElementById(sectionId).classList.add('active-view');
    
    // 2. Update Navbar
    document.querySelectorAll('nav a').forEach(el => el.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');

    // 3. Trigger Permissions Logic if accessing Service
    if (sectionId === 'service') {
        toggleServiceView();
    }
}

// --- PERMISSIONS LOGIC ---
function toggleServiceView() {
    const lockScreen = document.getElementById('service-lock');
    const contentScreen = document.getElementById('service-content');
    const roleText = document.getElementById('service-user-role');

    if (currentUserRole === null) {
        // GUEST: Show Lock, Hide Content
        lockScreen.style.display = 'block';
        contentScreen.style.display = 'none';
        contentScreen.classList.remove('doctor-mode'); // Clean state
    } else {
        // LOGGED IN: Hide Lock, Show Content
        lockScreen.style.display = 'none';
        contentScreen.style.display = 'block';
        
        if (currentUserRole === 'doctor') {
    // DOCTOR: Enable Admin Features (Inputs & Delete Buttons)
    roleText.innerText = "Viewing as: Admin User"; // Or any name you want
    contentScreen.classList.add('doctor-mode'); 
} else {
            // FAMILY: Read Only
            roleText.innerText = "Viewing as: Family Member (Read Only)";
            contentScreen.classList.remove('doctor-mode');
        }
    }
}

// --- DATA MANIPULATION (ADD / REMOVE) ---
function addItem(listId, inputId, allowDelete) {
    const input = document.getElementById(inputId);
    const text = input.value.trim();
    
    if (text) {
        const list = document.getElementById(listId);
        const li = document.createElement('li');
        
        // Build Content: Text + Optional Delete Button
        let htmlContent = `<span>${text}</span>`;
        if (allowDelete) {
            htmlContent += `<button class="delete-btn" onclick="removeItem(this)">✖</button>`;
        }

        li.innerHTML = htmlContent;
        list.appendChild(li);
        input.value = ''; // Clear input
    } else {
        alert("Please enter details first.");
    }
}

function removeItem(btn) {
    if(confirm("Are you sure you want to remove this item?")) {
        const li = btn.parentElement;
        li.remove();
    }
}

// --- AUTHENTICATION ---
function login(role) {
    currentUserRole = role;
    startSimulation(); // Start generating random vitals
    navigate('service'); // Redirect to dashboard immediately
}

function logout() {
    currentUserRole = null;
    clearInterval(monitorInterval); // Stop simulation
    navigate('login'); // Return to login screen
}

// --- VITAL SIGNS SIMULATION ---
function startSimulation() {
    if(monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
        // Generate Realistic Random Numbers
        const bpm = Math.floor(Math.random() * (100 - 60) + 60);
        const sys = Math.floor(Math.random() * (130 - 110) + 110);
        const dia = Math.floor(Math.random() * (85 - 70) + 70);
        const spo2 = Math.floor(Math.random() * (100 - 95) + 95);
        const temp = (Math.random() * (99.0 - 97.5) + 97.5).toFixed(1);
        const resp = Math.floor(Math.random() * (20 - 12) + 12);

        // Update DOM
        document.getElementById('bpm-val').innerText = bpm;
        document.getElementById('bp-val').innerText = sys + "/" + dia;
        document.getElementById('spo2-val').innerText = spo2;
        document.getElementById('temp-val').innerText = temp;
        document.getElementById('resp-val').innerText = resp;

        // Critical Alert Trigger (Heart Rate > 115)
        if (bpm > 115) { 
            document.getElementById('alert-val').innerText = bpm + " BPM";
            document.getElementById('alert-modal').style.display = 'flex';
        }
    }, 2000); // Update every 2 seconds
}

function closeAlert() {
    document.getElementById('alert-modal').style.display = 'none';
}