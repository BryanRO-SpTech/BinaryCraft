function fadeOutPortal() {
    const portal = document.querySelector(".portal");
    portal.style.transition = "all 2s";
    portal.classList.remove("in");

    setTimeout(() => {
        portal.style.display = "none";
    }, 1800);
}

document.addEventListener("DOMContentLoaded", fadeOutPortal);

function toggleDifficulty() {
    const difficulty = document.getElementById("difficulty");

    const difficulties = ["Fácil", "Médio", "Difícil"];
    let currentDifficulty = difficulty.innerHTML

    if (currentDifficulty === "Fácil") {
        difficulty.innerHTML = difficulties[1];
    }
    else if (currentDifficulty === "Médio") {
        difficulty.innerHTML = difficulties[2];
    }
    else {
        difficulty.innerHTML = difficulties[0];
    }
}

const difficultyButton = document.getElementById("difficultyButton");

difficultyButton.addEventListener("click", toggleDifficulty);






function toggleMusic() {
    const music = document.getElementById("introMusic");

    const mute = document.getElementById("mute");
    const unmuted = document.getElementById("unmuted");


    mute.classList.toggle("disableMusicIcon");
    unmuted.classList.toggle("disableMusicIcon");

    music.paused ? music.play() : music.pause();
}


const musicButton = document.getElementById("toggleMusic");

musicButton.addEventListener("click", toggleMusic);


function easyQuestions() {
    const randomNumber = Math.floor(Math.random() * 1000);
    const bases = [2, 8, 10, 16];

    const randomQuestionBase = bases[Math.floor(Math.random() * bases.length)];
    const generateAnswerBase = () => {
        const base = bases[Math.floor(Math.random() * bases.length)];

        if (base === randomQuestionBase) {
            return generateAnswerBase();
        }

        return base;
    }

    const generateWrongAnwser = () => Math.floor(Math.random() * 1000).toString(randomAnswerBase);

    const wrongAnwser1 = generateWrongAnwser();
    const wrongAnwser2 = generateWrongAnwser();
    const wrongAnwser3 = generateWrongAnwser();

    return {
        question: randomNumber.toString(randomQuestionBase),
        answer: randomNumber.toString(randomAnswerBase)
    }

}


function startGame() {
    const difficulty = document.getElementById("difficulty").innerHTML;
    const main = document.querySelector("main");

    main.innerHTML = "";
}


const startButton = document.getElementById("startButton");

startButton.addEventListener("click", startGame);