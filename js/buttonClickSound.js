function buttonSound() {
    const audio = new Audio("./sounds/buttonSound.mp3");

    audio.play();
}

document.addEventListener("click", (e) => {
    if (e.target.tagName == "BUTTON" || e.target.tagName == "A") {
        buttonSound();
    }
});
