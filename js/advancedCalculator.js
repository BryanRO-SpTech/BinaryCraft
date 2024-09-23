const teclado = document.getElementById("keyboard");
let input = document.getElementById("input");
const output = document.getElementById("output");
const buttonCalcular = document.getElementById("calcular");

let calculo = [];
let historico = [];

function mostrarCalculo() {
    input.innerHTML = "";

    calculo.forEach((numero, index) => {
        if ("operador" in numero) {
            return input.innerHTML += `<div class="operador" data-index="${index}">${numero.operador}<div>`
        }

        return input.innerHTML += `<div class="operando" data-index="${index}">${numero.numero}<span class="base">${numero.base}</span><div>`
    });
}

function ultimoItemArray(array) {
    return {
        ultimoItem: array[array.length - 1],
        ultimoIndice: array.length - 1,
        tamanho: array.length
    };
}


function continuarOperacao(numero) {
    const { tamanho } = ultimoItemArray(calculo);

    if (tamanho == 0) {
        criarNovaOperacao();
    }

    if ("numero" in calculo[calculo.length - 1]) {
        calculo[calculo.length - 1].numero += numero;
    } else {
        calculo[calculo.length - 1].operador = numero;
    }
}

function criarNovaOperacao() {
    const { ultimoItem, tamanho } = ultimoItemArray(calculo);

    const operacao = new Object();

    if (tamanho === 0 || "operador" in ultimoItem) {
        operacao.numero = "";
        operacao.base = 2;
    } else {
        operacao.operador = "";
    }

    calculo.push(operacao);
}


function trocarTeclado() {
    const { ultimoItem } = ultimoItemArray(calculo);

    let teclas = `
        <div class="line">
            <button value="1" class="key number">1</button>
            <button value="2" class="key number">2</button>
            <button value="3" class="key number">3</button>
            <button value="A" class="key number">A</button>
            <button value="B" class="key number">B</button>
            <button value="C" class="key number">C</button>
        </div>

        <div class="line">
            <button value="4" class="key number">4</button>
            <button value="5" class="key number">5</button>
            <button value="6" class="key number">6</button>
            <button value="D" class="key number">D</button>
            <button value="E" class="key number">E</button>
            <button value="F" class="key number">F</button>
        </div>

        <div class="line">
            <button value="7" class="key number">7</button>
            <button value="8" class="key number">8</button>
            <button value="9" class="key number">9</button>
            <button value="0" class="key number">0</button>
            <button class="key" id="add">
                <div class="operadores">
                    <div>
                        <span>+</span>
                    <span>-</span>
                    </div>
                        <div >
                        <span>&#247;</span>
                        <span>&times;</span>
                    </div>
                </div>
            </button>
            <button class="key" id="delete">&#9003;</button>
        </div>

    `;


    if ("numero" in ultimoItem && ultimoItem.numero !== "") {
        teclas = `
            <div class="line">
                <button value="1" class="key operador">+</button>
                <button value="2" class="key operador">-</button>
                <button value="3" class="key operador">*</button>
                <button value="A" class="key operador">/</button>
            </div>
        `;
    }

    teclado.innerHTML = teclas;
}


function deletarOperacao() {
    calculo.pop();


    const { ultimoItem } = ultimoItemArray(calculo);

    if (ultimoItem && "operador" in ultimoItem) {
        calculo.pop();
    }


    mostrarCalculo();
    output.innerHTML = "";
}


function trocarBase(e) {
    const bases = [2, 8, 10, 16];

    const data = e.target.closest(".operando");
    const dataIndex = data.getAttribute('data-index');


    let baseAtualIndex = bases.findIndex((base) => base == calculo[dataIndex].base);

    if (baseAtualIndex === 3) {
        baseAtualIndex = 0;
    } else {
        baseAtualIndex += 1;
    }

    calculo[dataIndex].base = bases[baseAtualIndex];


    if (!verificarBaseValida(calculo[dataIndex].numero, calculo[dataIndex].base)) {
        trocarBase(e);
    }
}


function trocarBaseAutomatico() {
    const { ultimoItem, ultimoIndice } = ultimoItemArray(calculo);
    const bases = [2, 8, 10, 16];

    let baseAtualIndex = bases.findIndex((base) => base == ultimoItem.base);

    if (!verificarBaseValida(ultimoItem.numero, ultimoItem.base)) {
        if (baseAtualIndex === 3) {
            baseAtualIndex = 0;
        } else {
            baseAtualIndex += 1;
        }
    }

    calculo[ultimoIndice].base = bases[baseAtualIndex];

    if (!verificarBaseValida(ultimoItem.numero, ultimoItem.base)) {
        trocarBaseAutomatico();
    }
}


function verificarBaseValida(numero, base) {
    const numeroArray = numero.split("");

    const validar = (caracteresPermitidos) => {
        for (let i = 0; i < numeroArray.length; i++) {
            if (!caracteresPermitidos.includes(numeroArray[i])) {
                return false;
            }
        }

        return true;
    }


    if (base === 10) {
        return validar("0123456789");
    }

    else if (base === 2) {
        return validar("01");
    }

    else if (base === 8) {
        return validar("01234567");
    }

    else if (base === 16) {
        return validar("0123456789ABCDEFabcdef");
    }
}


function calcular() {
    const converterNumerosParaDecimal = calculo.map((operacao) => {
        if ("numero" in operacao) {
            return parseInt(operacao.numero, operacao.base);
        } else {
            return operacao.operador;
        }
    });

    const expressao = converterNumerosParaDecimal.join("");

    const resultadoDecimal = Number(eval(expressao));
    const resultadoBinario = resultadoDecimal.toString(2);
    const resultadoOctal = resultadoDecimal.toString(8);
    const resultadoHexa = resultadoDecimal.toString(16);

    return [
        {
            resultado: resultadoDecimal,
            base: 10
        },
        {
            resultado: resultadoBinario,
            base: 2
        },
        {
            resultado: resultadoOctal,
            base: 8
        },
        {
            resultado: resultadoHexa.toUpperCase(),
            base: 16
        }
    ];
}


function exibirResultado() {
    const { ultimoItem } = ultimoItemArray(calculo);

    if ("numero" in ultimoItem && !ultimoItem.numero) {
        return output.innerHTML = `<p id=result>Adicione mais um número.</p>`;
    }


    const resultados = calcular();
    let indiceBaseResultado = 0;

    if (isNaN(resultados[0].resultado)) {
        return output.innerHTML = `<p id=result>Resultado Indefinido (Não divida 0 por 0)</p>`;
    }

    const furnaceAudio = new Audio("./sounds/furnace.mp3");
    furnaceAudio.play();

    const arrowProgress = document.getElementById("arrowProgress");
    const fireProgress = document.getElementById("fireProgress");

    arrowProgress.style.animation = `linear progressAnimation 1s`;
    fireProgress.style.animation = `linear fireAnimation 1s`;

    const formattedResult = `<p id=result>${resultados[indiceBaseResultado].resultado}<span class="base">${resultados[indiceBaseResultado].base}</span></p>`

    setTimeout(() => {
        output.innerHTML = formattedResult;

        arrowProgress.style.animation = `none`;
        fireProgress.style.animation = `none`;

        const resultado = document.getElementById("result");

        resultado.addEventListener("click", () => {
            indiceBaseResultado++;


            if (indiceBaseResultado === resultados.length) {
                indiceBaseResultado = 0;
            }

            resultado.innerHTML = `${resultados[indiceBaseResultado].resultado}<span class="base">${resultados[indiceBaseResultado].base}</span>`;
        });

    }, 1000);

    input = document.getElementById("input");

    addHistorico(input.innerHTML, {
        decimal: resultados[0].resultado,
        binario: resultados[1].resultado,
        octal: resultados[2].resultado,
        hexa: resultados[3].resultado
    });
}


teclado.addEventListener("click", (e) => {
    if (e.target.className.includes("number") || e.target.className.includes("operador")) {
        continuarOperacao(e.target.innerHTML);
    }

    if (e.target.className.includes("number")) {
        trocarBaseAutomatico();
    }

    if (e.target.className.includes("key")) {
        mostrarCalculo();
    }

    if (e.target.id === "add") {
        trocarTeclado();
        criarNovaOperacao();
    }

    if (e.target.className.includes("operador")) {
        trocarTeclado();
        criarNovaOperacao();
    }

    if (e.target.id === "delete") {
        deletarOperacao();
    }
});

input.addEventListener("click", (e) => {
    if (e.target.className === "operando" || e.target.className === "base") {
        trocarBase(e);
        mostrarCalculo();
    }
});

buttonCalcular.addEventListener("click", () => {
    if (calculo.length > 0) {
        exibirResultado()
    }
});




/**
 * ======================================
 * 
 *        HISTÓRICO
 * 
 * =====================================
 */

function addHistorico(valoresCalculados, { decimal, binario, octal, hexa }) {
    historico.push({
        valoresCalculados,
        decimal,
        binario,
        octal,
        hexa
    });

    exibirHistorico();
}

function exibirHistorico() {
    const divHistorico = document.getElementById("bookContent");

    console.log(historico);

    divHistorico.innerHTML = `<div class="calculoHistorico"></div>`;

    const calculoHistorico = document.querySelectorAll(".calculoHistorico");

    historico.forEach((calculo) => {
        calculoHistorico[calculoHistorico.length - 1].innerHTML += `${calculo.valoresCalculados}`;
    });
}

const historyButton = document.getElementById("historyButton");

historyButton.addEventListener("click", () => {
    const historyContainer = document.querySelector(".historyContainer");

    historyContainer.style.display = "flex";
});




/**
 * ======================================
 * 
 * TUTORIAL DE COMO USAR O CALCULADORA
 * 
 * =====================================
 */

const tutorialButton = document.getElementById("tutorialButton");

tutorialButton.addEventListener("click", () => {
    const tutorialContainer = document.querySelector(".tutorialContainer");


    // Adicionando os itens na div de tutorial;
    tutorialContainer.innerHTML = `
        <div class="speakDiv">
                <img id="ballon" src="./images/speechBubble.png">
                <img id="villager" src="./images/villager.png">
                <h3 id="speak">Bem vindo a Binary furnace!!! Siga o passo a passo para utiliza-lá!</h3>
                <button id="start">Iniciar Tutorial</button>
        </div>
   `;

    tutorialContainer.style.display = "block";


    const speakDiv = document.querySelector(".speakDiv");
    const speak = document.getElementById("speak");
    const nextButton = document.getElementById("start");
    const addButton = document.getElementById("add");

    let numberButtons = document.querySelectorAll(".number");
    let operadores = document.querySelectorAll(".operador");
    let operandos = document.querySelectorAll(".operando");
    let resultado = document.getElementById("result");

    function adicionarERemoverClasseEmMuitosElementos(elementos, classe) {
        elementos.forEach(elemento => {
            elemento.classList.toggle(classe);
        })
    }






    const villageSound = new Audio("./sounds/villagerSound.mp3");
    villageSound.play();

    function step1() {
        villageSound.currentTime = 0;
        villageSound.play();

        nextButton.style.display = "none";

        speak.innerHTML = "Utilize o teclado para inserir valores a serem calculados.";

        adicionarERemoverClasseEmMuitosElementos(numberButtons, "tutorial");

        input.classList.add("tutorial");


        numberButtons.forEach(numberButton => {
            numberButton.addEventListener("click", step2);
        });

        nextButton.removeEventListener("click", step1);
    }

    function step2() {
        villageSound.currentTime = 0;
        villageSound.play();

        teclado.removeEventListener("click", step2);

        adicionarERemoverClasseEmMuitosElementos(numberButtons, "tutorial");

        addButton.classList.add("tutorial");
        speak.innerHTML = 'Aperte o botão "+/-/x/\u{000F7}" para adicionar o operando e mudar para o teclado de operadores.';


        addButton.addEventListener("click", step3);
    }

    function step3() {
        villageSound.currentTime = 0;
        villageSound.play();

        addButton.removeEventListener("click", step3);

        teclado.classList.add("tutorial");
        speak.innerHTML = "Aperte em um operador para adicionar ao cálculo.";

        setTimeout(() => {
            operadores = document.querySelectorAll(".operador");

            operadores.forEach(operador => {
                operador.addEventListener("click", step4);
            });

        }, 1);
    }

    function step4() {
        villageSound.currentTime = 0;
        villageSound.play();

        operadores.forEach(operador => {
            operador.removeEventListener("click", step4);
        });

        teclado.classList.remove("tutorial");

        setTimeout(() => {
            numberButtons = document.querySelectorAll(".number");
            adicionarERemoverClasseEmMuitosElementos(numberButtons, "tutorial");
            numberButtons.forEach(numero => {
                numero.addEventListener("click", step5);
            });
        }, 1);

        speak.innerHTML = "Adicione mais um operando."
    }


    function step5() {
        villageSound.currentTime = 0;
        villageSound.play();

        numberButtons.forEach(numero => {
            numero.removeEventListener("click", step5);
        });
        adicionarERemoverClasseEmMuitosElementos(numberButtons, "tutorial");

        setTimeout(() => {
            operandos = document.querySelectorAll(".operando");

            operandos.forEach(operando => {
                operando.addEventListener("click", step6);
            });
        }, 1);

        speak.innerHTML = "Clique em um operando para alterar a base dele. Caso não existam outras bases que comportem o numero digitado, nada acontecerá.";
    }


    function step6() {
        villageSound.currentTime = 0;
        villageSound.play();

        operandos.forEach(operando => {
            operando.removeEventListener("click", step6);
        });

        input.classList.remove("tutorial")

        buttonCalcular.classList.add("tutorial");
        output.classList.add("tutorial");

        speakDiv.classList.add("step6");


        speak.innerHTML = "Pronto, agora vamos ligar a fornalha!!!";

        buttonCalcular.addEventListener("click", step7);
    }

    function step7() {
        villageSound.currentTime = 0;
        villageSound.play();

        buttonCalcular.removeEventListener("click", step7);
        buttonCalcular.classList.remove("tutorial");

        setTimeout(() => {
            resultado = document.getElementById("result");

            resultado.addEventListener("click", step8);
        }, 1000);

        speak.innerHTML = "Clique no resultado para alterar a base.";
    }

    function step8() {
        villageSound.currentTime = 0;
        villageSound.play();

        resultado.removeEventListener("click", step8);

        nextButton.style.display = "block";
        nextButton.innerHTML = "Encerrar Tutorial";
        nextButton.addEventListener("click", encerrar);

        speak.innerHTML = "Isso é tudo, aproveite!";
    }

    function encerrar() {
        nextButton.removeEventListener("click", encerrar);

        output.classList.remove("tutorial");

        tutorialContainer.innerHTML = "";
        tutorialContainer.style.display = "none";
    }

    nextButton.addEventListener("click", step1);
});