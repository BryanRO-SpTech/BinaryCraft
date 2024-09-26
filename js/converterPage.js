function validarEntrada(entrada, caracteresPermitidos) {
    const entradaArray = entrada.split("");

    for (let i = 0; i < entradaArray.length; i++) {
        if (!caracteresPermitidos.includes(entradaArray[i])) {
            return false;
        }
    }

    return true;
}

function converter() {
    const numeroOrigem = document.getElementById("ipt_origem");
    const valorNumeroOrigem = numeroOrigem.value;
    const baseOrigem = Number(document.getElementById("baseSelector").value);

    numeroOrigem.style.border = "1px solid white";


    let decimal = "Número digítado não corresponde a base.";
    let binario = "Número digítado não corresponde a base.";
    let octal = "Número digítado não corresponde a base.";
    let hexadecimal = "Número digítado não corresponde a base.";

    if (baseOrigem == 10 && validarEntrada(valorNumeroOrigem, "0123456789")) {
        decimal = Number(valorNumeroOrigem);
        binario = decimal.toString(2);
        octal = decimal.toString(8);
        hexadecimal = decimal.toString(16);
    }

    else if (baseOrigem == 2 && validarEntrada(valorNumeroOrigem, "01")) {
        binario = valorNumeroOrigem;
        decimal = parseInt(binario, 2);
        octal = decimal.toString(8);
        hexadecimal = decimal.toString(16);
    }

    else if (baseOrigem == 8 && validarEntrada(valorNumeroOrigem, "01234567")) {
        octal = valorNumeroOrigem;
        decimal = parseInt(octal, 8);
        binario = decimal.toString(2);
        hexadecimal = decimal.toString(16);
    }

    else if (baseOrigem == 16) {
        if (validarEntrada(valorNumeroOrigem, "0123456789ABCDEFabcdef"))
            hexadecimal = valorNumeroOrigem;
        decimal = parseInt(hexadecimal, 16);
        binario = decimal.toString(2);
        octal = decimal.toString(8);
    }

    return { decimal, binario, octal, hexadecimal }
}


function showResult() {
    const { decimal, binario, octal, hexadecimal } = converter();

    document.getElementById("resultDecimal").value = decimal;
    document.getElementById("resultBinario").value = binario;
    document.getElementById("resultOctal").value = octal;
    document.getElementById("resultHexadecimal").value = `${typeof decimal === "number" ? `#${hexadecimal.toUpperCase()}` : hexadecimal}`;
}

const convertButton = document.getElementById("converter");

convertButton.addEventListener("click", () => {
    const numeroOrigem = Number(document.getElementById("ipt_origem").value);

    if (numeroOrigem != "") {
        showResult();
    }
});





const showResultButtons = document.querySelectorAll(".showButton");

function toggleShowResult(e) {
    if (e.target.innerHTML == "Sim") {
        e.target.innerHTML = "Não"
    } else {
        e.target.innerHTML = "Sim"
    }
}

showResultButtons.forEach(button => {
    button.addEventListener("click", toggleShowResult)
});


function hiddenResults(e) {
    const parentDiv = e.target.closest(".resultSelectBox");

    const resultInput = parentDiv.querySelector("input");

    resultInput.style.opacity = e.target.innerHTML == "Sim" ? 1 : 0;
}

showResultButtons.forEach(button => {
    button.addEventListener("click", hiddenResults);
});



function goQuiz() {
    const body = document.querySelector("body");

    body.classList.add("portal");
    body.style.transition = "all 2s";
    body.innerHTML = `
        <div class="loading">
            <h1 class="white bold shadow">Loading...</h1>
        </div>
    `;

    const netherAudio = new Audio("./sounds/nether.mp3");

    netherAudio.play();

    setTimeout(() => {
        window.location.href = "./quiz.html";
    }, 4000);

}


document.getElementById("jogar").addEventListener("click", goQuiz);