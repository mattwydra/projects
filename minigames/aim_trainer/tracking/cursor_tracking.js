const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balls = [];
let mouseX = 0, mouseY = 0;

class Ball {
    constructor(x, y, speed, direction) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.hp = 2000;
        this.speed = speed;
        this.direction = direction;
        this.active = true;
    }

    update() {
        if (this.direction === "right") this.x += this.speed;
        else this.x -= this.speed;

        if (this.x < -this.radius || this.x > canvas.width + this.radius) {
            this.active = false;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }
}

function spawnBall() {
    let y = Math.random() * (canvas.height - 100) + 50;
    let startLeft = Math.random() < 0.5;
    let x = startLeft ? -30 : canvas.width + 30;
    let direction = startLeft ? "right" : "left";
    let speed = Math.random() * 2 + 3;
    balls.push(new Ball(x, y, speed, direction));
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.update();
        ball.draw();

        let dist = Math.hypot(ball.x - mouseX, ball.y - mouseY);
        if (dist < ball.radius) {
            ball.hp -= 16; // Simulating ~16ms per frame (HP drains in ~2 sec)
        }
        if (ball.hp <= 0) {
            ball.active = false;
        }
    });

    balls = balls.filter(ball => ball.active);
    requestAnimationFrame(updateGame);
}

document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

setInterval(spawnBall, 1000); // Spawn a new ball every second
updateGame();



// export default function AimTrackerGame() {
//     const [balls, setBalls] = useState([]);
//     const ballSize = 50;

//     useEffect(() => {
//         const spawnBall = () => {
//             const startX = Math.random() > 0.5 ? -ballSize : window.innerWidth;
//             const y = Math.random() * (window.innerHeight - ballSize);
//             const speed = Math.random() * 2 + 3; // Speed between 3 and 5
//             const direction = startX < 0 ? 1 : -1;

//             setBalls((prevBalls) => [
//                 ...prevBalls,
//                 { id: Date.now(), x: startX, y, speed, direction, hp: 2000 }
//             ]);
//         };

//         const interval = setInterval(spawnBall, 1000);
//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         const updatePositions = setInterval(() => {
//             setBalls((prevBalls) =>
//                 prevBalls
//                     .map(ball => ({
//                         ...ball,
//                         x: ball.x + ball.speed * ball.direction
//                     }))
//                     .filter(ball => ball.hp > 0 && ball.x > -ballSize && ball.x < window.innerWidth + ballSize) // Remove off-screen balls
//             );
//         }, 16);
//         return () => clearInterval(updatePositions);
//     }, []);

//     const handleMouseMove = (e) => {
//         setBalls((prevBalls) =>
//             prevBalls.map(ball => {
//                 const distX = e.clientX - (ball.x + ballSize / 2);
//                 const distY = e.clientY - (ball.y + ballSize / 2);
//                 const distance = Math.sqrt(distX * distX + distY * distY);

//                 if (distance < ballSize / 2) {
//                     return { ...ball, hp: ball.hp - 10 };
//                 }
//                 return ball;
//             })
//         );
//     };

//     return (
//         <div className="relative w-screen h-screen" onMouseMove={handleMouseMove}>
//             {balls.map((ball) => (
//                 <div
//                     key={ball.id}
//                     className="absolute bg-red-500 rounded-full"
//                     style={{
//                         width: ballSize,
//                         height: ballSize,
//                         left: ball.x,
//                         top: ball.y,
//                         opacity: ball.hp / 2000,
//                         transition: "opacity 0.2s ease-out"
//                     }}
//                 />
//             ))}
//         </div>
//     );
// }
