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


function generateQuestions(difficulty) {
    if (difficulty === "Fácil") {
        difficulty = 1000;

    }

    else if (difficulty === "Médio") {
        difficulty = 10000;
    }

    else {
        difficulty = 100000;
    }

    const randomNumber = Math.floor(Math.random() * difficulty);
    const bases = [2, 8, 10, 16];

    const randomQuestionBase = bases[Math.floor(Math.random() * bases.length)];

    const generateAnswerBase = () => {
        const base = bases[Math.floor(Math.random() * bases.length)];

        if (base === randomQuestionBase) {
            return generateAnswerBase();
        }

        return base;
    }

    const awnserBase = generateAnswerBase();


    const generateWrongAnwser = () => Math.floor(Math.random() * 1000).toString(awnserBase);

    const formatarBase = (base) => {
        if (base == 10) return "\u{2081}\u{2080}";
        if (base == 2) return "\u{2082}";
        if (base == 8) return "\u{2088}";
        if (base == 16) return "\u{2081}\u{2086}";
    }

    return {
        question: randomNumber.toString(randomQuestionBase),
        correctAnswer: randomNumber.toString(awnserBase),
        wrongAnwser1: generateWrongAnwser(),
        wrongAnwser2: generateWrongAnwser(),
        questionBase: randomQuestionBase,
        awnserBase: awnserBase,
        questionBaseFormated: formatarBase(randomQuestionBase),
        awnserBaseFormated: formatarBase(awnserBase),

    }

}

let difficulty = ""
let life = 10;
let xp = 0;


function startGame() {
    const main = document.querySelector("main");
    const body = document.querySelector("body");

    difficulty = document.getElementById("difficulty").innerHTML;

    body.classList.add("quiz");
    main.classList.add("quiz");


    newQuestion(main);
}

function newQuestion(main) {
    const question = generateQuestions(difficulty);

    const shuffleAwsers = [question.correctAnswer, question.wrongAnwser1, question.wrongAnwser2].sort(() => Math.random() - 0.5);

    main.innerHTML = `
        <div class="quiz">
            <div id="lifeBar"></div>
            <p class="black question">Qual o valor de ${question.question}${question.questionBaseFormated} na base: ${question.awnserBase}?</p>

            <div class="options">
                <button class="option">
                    <img class="xp" src="./images/oneXP.png"/>
                    <p class="awnser">${shuffleAwsers[0]}${question.awnserBaseFormated}</p>
                </button>
                
                <button class="option">
                    <img class="xp" src="./images/twoXP.png"/>
                    <p class="awnser">${shuffleAwsers[1]}${question.awnserBaseFormated}</p>
                </button>
                
                <button class="option">
                    <img class="xp" src="./images/threeXP.png"/>
                    <p class="awnser"> ${shuffleAwsers[2]}${question.awnserBaseFormated}</p>
                </button>
            </div>
            <div id="xpBar" class="dark_green shadow"></div>
        </div>    
    `;

    showXp();
    showLife();

    const options = document.querySelectorAll(".option");

    options.forEach(option => {
        option.addEventListener("click", () => {
            if (option.querySelector(".awnser").innerHTML === question.correctAnswer + question.awnserBaseFormated) {
                giveXp();
                return newQuestion(main);
            }

            else {
                damage()

                if (life <= 0) {

                }

                return newQuestion(main);
            }
        });
    });
}

function showLife() {
    const lifeBar = document.getElementById("lifeBar");
    lifeBar.innerHTML = "";
    for (let i = 0; i < life; i++) {
        lifeBar.innerHTML += "<img class='heart' src='./images/heart.png' />";
    }

    for (let i = 0; i < 10 - life; i++) {
        lifeBar.innerHTML += "<img class='heart' src='./images/emptyHeart.png' />";
    }
}

function damage() {
    const hitAudio = new Audio("./sounds/hit.mp3");
    hitAudio.play();

    life -= 1;
}

function showXp() {
    const xpBar = document.getElementById("xpBar");
    xpBar.innerHTML = xp;
}

function giveXp() {
    const xpAudio = new Audio("./sounds/xp.mp3");
    xp += 100;
    xpAudio.play();
}


const startButton = document.getElementById("startButton");

startButton.addEventListener("click", startGame);