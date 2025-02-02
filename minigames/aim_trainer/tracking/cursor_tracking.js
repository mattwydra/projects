const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let tracking = false;
let lastTime = null;
let totalDistance = 0;
let totalDeviation = 0;
let pointsTracked = 0;

// Draw the target tracking line
function drawLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(700, 200);
    ctx.strokeStyle = "lavender";
    ctx.lineWidth = 4;
    ctx.stroke();
}

drawLine();

// Track cursor movement
canvas.addEventListener("mousemove", (event) => {
    if (!tracking) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (lastTime) {
        const timeElapsed = (performance.now() - lastTime) / 1000;
        totalDistance += Math.abs(x - (pointsTracked > 0 ? lastX : x)) / timeElapsed;
    }

    // Calculate deviation from the ideal line
    const deviation = Math.abs(y - 200);
    totalDeviation += deviation;
    pointsTracked++;
    lastX = x;
    lastTime = performance.now();
});

// Start tracking when mouse enters
canvas.addEventListener("mouseenter", () => {
    tracking = true;
    lastTime = performance.now();
    totalDistance = 0;
    totalDeviation = 0;
    pointsTracked = 0;
});

// Stop tracking when mouse leaves
canvas.addEventListener("mouseleave", () => {
    tracking = false;
    const avgDeviation = pointsTracked > 0 ? totalDeviation / pointsTracked : 0;
    const accuracy = Math.max(0, 100 - avgDeviation);
    const speed = pointsTracked > 0 ? totalDistance / pointsTracked : 0;
    document.getElementById("stats").innerText = `Accuracy: ${accuracy.toFixed(2)}% | Speed: ${speed.toFixed(2)} px/sec`;
});