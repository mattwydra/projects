export function spawnPowerUp(canvasWidth) {
    const chance = Math.random();
    let type = null;
    if (chance < 0.01) type = "bonusLife";
    else if (chance < 0.06) type = "piercing";
    else if (chance < 0.085) type = "birdshot";

    if (type) {
        const isFlying = type !== "bonusLife";
        const yPos = isFlying ? Math.random() * 200 + 100 : 300;
        return {
            x: canvasWidth,
            y: yPos,
            width: 20,
            height: 20,
            color: type === "bonusLife" ? "#32CD32" : type === "piercing" ? "#FFD700" : "#00BFFF",
            isPowerUp: true,
            type: type,
        };
    }
    return null;
}

export function activatePowerUp(type, setActivePowerUp) {
    setActivePowerUp(type);
    setTimeout(() => {
        setActivePowerUp(null);
    }, 10000);
}
