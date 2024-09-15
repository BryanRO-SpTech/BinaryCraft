function buttonSound() {
    const audio = new Audio("./sounds/buttonSound.mp3");

    audio.play();
}

document.addEventListener("click", (e) => {
    console.log(e.target.id);

    if (e.target.tagName == "BUTTON" || e.target.id == "difficulty") {
        buttonSound();
    }
});
