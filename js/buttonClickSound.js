function buttonSound() {
    const audio = new Audio("./sounds/buttonSound.mp3");

    audio.play();
}

document.addEventListener("click", (e) => {
    if (
        e.target.tagName == "BUTTON" ||
        e.target.id == "difficulty" ||
        e.target.classList.contains("xp") ||
        e.target.classList.contains("awnser") ||
        e.target.classList.contains("operando") ||
        e.target.id("result")
    ) {
        buttonSound();
    }
});
