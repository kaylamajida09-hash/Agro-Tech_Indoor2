document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Data Sensor
    const sensorData = {
        ph: { element: document.querySelector('.card:nth-child(1) h3'), label: document.querySelector('.card:nth-child(1) span'), value: 7.0 },
        suhu: { element: document.querySelector('.card:nth-child(2) h3'), label: document.querySelector('.card:nth-child(2) span'), value: 25.0 },
        gas: { element: document.querySelector('.card:nth-child(3) h3'), label: document.querySelector('.card:nth-child(3) span'), value: 0 }
    };

    function updateSensors() {
        const newPh = (Math.random() * (8.5 - 5.5) + 5.5).toFixed(1);
        sensorData.ph.element.innerText = newPh;

        if (newPh > 7.5) {
            sensorData.ph.label.innerText = "pH Tinggi (Basa)";
            sensorData.ph.label.style.color = "#e74c3c";
        } else if (newPh < 6.5) {
            sensorData.ph.label.innerText = "pH Rendah (Asam)";
            sensorData.ph.label.style.color = "#f39c12";
        } else {
            sensorData.ph.label.innerText = "Kondisi Normal";
            sensorData.ph.label.style.color = "#27ae60";
        }

        const newSuhu = (Math.random() * (32 - 24) + 24).toFixed(1);
        sensorData.suhu.element.innerText = `${newSuhu}°C`;
        sensorData.suhu.label.innerText = newSuhu > 30 ? "Suhu Terlalu Panas" : "Suhu Optimal";

        const newGas = Math.floor(Math.random() * 200);
        sensorData.gas.element.innerText = `${newGas} PPM`;
        sensorData.gas.label.innerText = newGas > 150 ? "Bahaya: Gas Tinggi!" : "Udara Bersih";
    }

    function animateGraph() {
        const path = document.querySelector('.graph-area svg path');
        const p1 = Math.floor(Math.random() * 80) + 10;
        const p2 = Math.floor(Math.random() * 80) + 10;
        const p3 = Math.floor(Math.random() * 80) + 10;

        const newD = `M0,${p1} Q25,${p2} 50,${p3} T100,${p2}`;
        path.setAttribute('d', newD);
    }

    function checkConnection() {
        const indicator = document.querySelector('.status-indicator');
        const label = document.querySelector('.status-label');

        if (Math.random() > 0.95) {
            indicator.style.backgroundColor = "#e74c3c";
            indicator.style.boxShadow = "0 0 8px #e74c3c";
            label.innerText = "Terputus";
        } else {
            indicator.style.backgroundColor = "#2ecc71";
            indicator.style.boxShadow = "0 0 8px #2ecc71";
            label.innerText = "Tersambung";
        }
    }

    setInterval(updateSensors, 3000);
    setInterval(animateGraph, 3000);
    setInterval(checkConnection, 5000);

    updateSensors();

    // ================= FIX SERVO TOGGLE =================
    const servoToggle = document.getElementById('servoToggle');
    const servoNote = document.getElementById('servoNote');

    if (servoToggle && servoNote) {
        servoToggle.addEventListener('change', function () {
            if (this.checked) {
                servoNote.innerText = "OPEN (Manual)";
                servoNote.style.color = "#2ecc71";
            } else {
                servoNote.innerText = "CLOSED";
                servoNote.style.color = "#666";
            }
        });
    }

    // ================= SCROLL MENU =================
    document.querySelectorAll('.menu-container a').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId.startsWith('#')) {
                e.preventDefault();

                const targetElement = document.querySelector(targetId);
                const container = document.querySelector('.main-content');

                if (targetElement && container) {
                    const topPos = targetElement.offsetTop;

                    container.scrollTo({
                        top: topPos - 20,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

});


// ================= MINI STARS =================
(function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.style.cssText = `
        position: fixed; top: 0; left: 0;
        pointer-events: none; z-index: -1;
        opacity: 0.4;
    `;

    const stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2,
            alpha: Math.random()
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';

        stars.forEach(s => {
            s.y += 0.3;
            if (s.y > canvas.height) s.y = 0;

            ctx.save();
            ctx.globalAlpha = s.alpha * (1 + Math.sin(Date.now() * 0.005));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    draw();
})();


// ================= MQTT (FIXED) =================
const client = mqtt.connect('wss://seedbrow.cloud.shiftr.io:443', {
    username: 'seedbrow',
    password: 'OBAfk4pkJaTN26OR'
});

client.on('connect', () => {
    console.log("MQTT CONNECTED");
});

// SATUKAN SEMUA EVENT DI SINI
document.addEventListener('DOMContentLoaded', () => {

    // ===== FAN =====
    const fanToggle = document.getElementById('fanToggle');
    if (fanToggle) {
        fanToggle.addEventListener('change', function () {
            const status = this.checked ? "ON" : "OFF";
            client.publish("fan/angin", status);
            console.log("FAN:", status);
        });
    }

    // ===== LED =====
    const ledToggle = document.getElementById('ledToggle');
    if (ledToggle) {
        ledToggle.addEventListener('change', function () {
            const status = this.checked ? "ON" : "OFF";
            client.publish("lampu/terang", status);
            console.log("LED:", status);
        });
    }

});




