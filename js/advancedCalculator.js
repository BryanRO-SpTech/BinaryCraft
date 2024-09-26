const teclado = document.getElementById("keyboard");
let input = document.getElementById("input");
const output = document.getElementById("output");
const buttonCalcular = document.getElementById("calcular");

let calculo = [];
let historico = [];

function mostrarCalculo() {
    input.innerHTML = "";

    input.innerHTML = calculo.map((numero, index) => {
        if ("operador" in numero) {
            return `<div class="operador" data-index="${index}">${numero.operador}</div>`
        } else if ("abrirParentese" in numero) {
            return `<div class="abrirParentese" data-index="${index}">(</div>`
        } else if ("fecharParentese" in numero) {
            return `<div class="fecharParentese" data-index="${index}">)</div>`
        }

        return `<div class="operando" data-index="${index}">${numero.numero}<span class="base">${numero.base}</span></div>`
    }).join("");
}

function ultimoItemArray(array) {
    return {
        ultimoItem: array[array.length - 1],
        ultimoIndice: array.length - 1,
        tamanho: array.length
    };
}


function continuarOperacaoNumeros(numero) {
    const { tamanho } = ultimoItemArray(calculo);

    if (tamanho > 0 && "fecharParentese" in calculo[tamanho - 1]) return;


    if (tamanho == 0 || "operador" in calculo[tamanho - 1] || "abrirParentese" in calculo[tamanho - 1]) {
        criarNovaOperacao();
    }

    if ("numero" in calculo[calculo.length - 1]) {
        calculo[calculo.length - 1].numero += numero;
    }

    trocarBaseAutomatico();
    mostrarCalculo();
}

function addOperador(operador) {
    const { ultimoItem, tamanho } = ultimoItemArray(calculo);

    if (tamanho > 0 && ("numero" in ultimoItem || "fecharParentese" in ultimoItem)) {
        criarNovaOperacao();
        calculo[calculo.length - 1].operador = operador;

        mostrarCalculo();
    }
}

function abrirParentese() {
    const { ultimoItem, tamanho } = ultimoItemArray(calculo);

    if (tamanho === 0 || "operador" in ultimoItem || "abrirParentese" in ultimoItem) {
        calculo.push({ abrirParentese: "(" });
    } else {
        return;
    }

    mostrarCalculo();
}

function fecharParentese() {
    const { ultimoItem, tamanho } = ultimoItemArray(calculo);

    if (tamanho === 0 || "operador" in ultimoItem) {
        return;
    } else {
        calculo.push({ fecharParentese: ")" });
    }

    mostrarCalculo();
}

function criarNovaOperacao() {
    const { ultimoItem, tamanho } = ultimoItemArray(calculo);

    const operacao = new Object();

    if (tamanho === 0 || "operador" in ultimoItem || "abrirParentese" in ultimoItem) {
        operacao.numero = "";
        operacao.base = 2;
    } else {
        operacao.operador = "";
    }

    calculo.push(operacao);
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
    const { ultimoItem } = ultimoItemArray(calculo);
    const bases = [2, 8, 10, 16];

    let baseAtualIndex = bases.findIndex((base) => base == ultimoItem.base);

    if (!verificarBaseValida(ultimoItem.numero, ultimoItem.base)) {
        if (baseAtualIndex === 3) {
            baseAtualIndex = 0;
        } else {
            baseAtualIndex += 1;
        }
    }

    ultimoItem.base = bases[baseAtualIndex];

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
        } else if ("operador" in operacao) {
            return operacao.operador.replace("÷", "/");
        } else if ("abrirParentese" in operacao) {
            return "(";
        } else if ("fecharParentese" in operacao) {
            return ")";
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
    output.style.justifyContent = "center";


    const { ultimoItem, ultimoIndice } = ultimoItemArray(calculo);

    if ("operador" in ultimoItem || "abrirParentese" in ultimoItem) {
        return output.innerHTML = `<p id=result>Adicione mais um número.</p>`;
    }

    if ("fecharParentese" in ultimoItem && "abrirParentese" in calculo[ultimoIndice - 1]) {
        return output.innerHTML = `<p id=result>Os parendeses não podem ser vazios</p>`;
    }

    const parentesesAbertos = calculo.map((abrirParentese) => {
        if ("abrirParentese" in abrirParentese) {
            return abrirParentese.abrirParentese;
        }
    }).filter((abrirParentese) => abrirParentese === "(");

    const parentesesFechados = calculo.map((fecharParentese) => {
        if ("fecharParentese" in fecharParentese) {

            return fecharParentese.fecharParentese;
        }
    }).filter((fecharParentese) => fecharParentese === ")");


    if (parentesesAbertos.length !== parentesesFechados.length) {
        return output.innerHTML = `<p id=result>Feche os parenteses corretamente.</p>`;
    }

    const resultados = calcular();
    let indiceBaseResultado = 0;

    if (isNaN(resultados[0].resultado) || !isFinite(resultados[0].resultado)) {
        return output.innerHTML = `<p id=result>Resultado Indefinido (Não divida 0 por 0)</p>`;
    }

    const furnaceAudio = new Audio("./sounds/furnace.mp3");
    furnaceAudio.play();

    const arrowProgress = document.getElementById("arrowProgress");
    const fireProgress = document.getElementById("fireProgress");

    arrowProgress.style.animation = `linear progressAnimation 1s`;
    fireProgress.style.animation = `linear fireAnimation 1s`;

    const formattedResult = `<p id="result">${resultados[indiceBaseResultado].resultado}<span class="base">${resultados[indiceBaseResultado].base}</span></p>`

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


            if (output.scrollWidth > 634) {
                output.style.justifyContent = "flex-start";
                output.scrollLeft = output.scrollWidth;
            } else {
                output.style.justifyContent = "center";
            }
        });

    }, 1000);

    input = document.getElementById("input");

    addHistorico(input.innerHTML, resultados);
}


teclado.addEventListener("click", (e) => {
    if (e.target.className.includes("number")) {
        continuarOperacaoNumeros(e.target.innerHTML);
    }

    else if (e.target.className.includes("operador")) {
        addOperador(e.target.innerHTML);
    }

    else if (e.target.id === "delete") {
        deletarOperacao();
    }

    else if (e.target.id === "abrirParentese") {
        abrirParentese();
    }

    else if (e.target.id === "fecharParentese") {
        fecharParentese();
    }

    if (input.scrollWidth > 634) {
        input.style.justifyContent = "flex-start";
        input.scrollLeft = input.scrollWidth;
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
        exibirResultado();
    }
});




/**
 * ======================================
 * 
 *        HISTÓRICO
 * 
 * =====================================
 */

function addHistorico(valoresCalculados, resultados) {
    historico.push({
        valoresCalculados,
        resultados
    });

    exibirHistorico();
}

function exibirHistorico(page = 0) {
    const bookSound = new Audio("./sounds/book.mp3");
    bookSound.play();

    const divHistorico = document.getElementById("bookContent");

    divHistorico.innerHTML = "";

    const historicoReversed = historico.slice().reverse();

    const quantPaginas = Math.ceil(historicoReversed.length / 6) - 1;
    if (page > quantPaginas) page = quantPaginas;
    else if (page < 0) page = 0;

    const skip = 6 * page;
    const limit = skip + 6;


    divHistorico.innerHTML = historicoReversed.map((calculo, index) => {
        if (index >= skip && index < limit) {
            return `
                    <div class="calculoHistorico">
                        <div class="valorCalculado">${calculo.valoresCalculados}</div>
                        <p class="result">${calculo.resultados[0].resultado}<span class="base">${calculo.resultados[0].base}</span></p>
                    </div>
                `;
        }
    }).join("");


    const divPage = document.getElementById("page");

    divPage.innerHTML = `Pagina ${page + 1} de ${quantPaginas + 1}`;


    const resultados = document.querySelectorAll(".result");
    const resultadosArray = Array.from(resultados);
    const resultadosArrayReversed = resultadosArray.reverse();

    const bases = [10, 2, 8, 16];

    resultadosArrayReversed.forEach((resultado, index) => {
        resultado.addEventListener("click", () => {
            let baseAtual = bases.findIndex((base) => base === Number(resultado.querySelector(".base").innerHTML));

            if (baseAtual < 3) {
                baseAtual++
            } else {
                baseAtual = 0;
            }

            resultado.innerHTML = `${historico[index].resultados[baseAtual].resultado}<span class="base">${historico[index].resultados[baseAtual].base}</span>`;
        });
    });

    return page;

}

const historyButton = document.getElementById("historyButton");
const historyContainer = document.querySelector(".historyContainer");

historyButton.addEventListener("click", () => historyContainer.style.display = "flex");




let paginaHistorico = 0;

const nextPageButton = document.getElementById("nextPage");
const prevPageButton = document.getElementById("prevPage");

nextPageButton.addEventListener("click", () => {
    paginaHistorico = exibirHistorico(++paginaHistorico);
});

prevPageButton.addEventListener("click", () => {
    paginaHistorico = exibirHistorico(--paginaHistorico);
});


const closeHistoryButton = document.getElementById("closeHistory");

closeHistoryButton.addEventListener("click", () => historyContainer.style.display = "none");


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

        numberButtons.forEach(numberButton => {
            numberButton.classList.remove("tutorial");
            numberButton.removeEventListener("click", step2);
        });

        operadores.forEach(operador => {
            operador.classList.add("tutorial");
            operador.addEventListener("click", step3);
        });

        speak.innerHTML = 'Aperte em um operador para realizar a operação.';
    }

    function step3() {
        villageSound.currentTime = 0;
        villageSound.play();

        operadores.forEach(operador => {
            operador.classList.remove("tutorial");
            operador.removeEventListener("click", step3);
        });

        speak.innerHTML = "Aperte em mais um número para adicionar ao cálculo.";

        numberButtons.forEach(numero => {
            numero.classList.add("tutorial");
            numero.addEventListener("click", step4);
        });
    }

    function step4() {
        villageSound.currentTime = 0;
        villageSound.play();

        numberButtons.forEach(numero => {
            numero.removeEventListener("click", step4);
            numero.classList.remove("tutorial");
        });

        setTimeout(() => {
            operandos = document.querySelectorAll(".operando");

            operandos.forEach(operando => {
                operando.addEventListener("click", step5);
            });
        }, 1);

        speak.innerHTML = "Clique em um operando para alterar a base dele. Caso não existam outras bases que comportem o numero digitado, nada acontecerá.";
    }


    function step5() {
        villageSound.currentTime = 0;
        villageSound.play();

        operandos.forEach(operando => {
            operando.removeEventListener("click", step5);
        });

        input.classList.remove("tutorial");

        buttonCalcular.classList.add("tutorial");
        output.classList.add("tutorial");

        speakDiv.classList.add("step6");


        speak.innerHTML = "Pronto, agora vamos ligar a fornalha!!!";

        buttonCalcular.addEventListener("click", step6);
    }

    function step6() {
        villageSound.currentTime = 0;
        villageSound.play();

        buttonCalcular.removeEventListener("click", step6);
        buttonCalcular.classList.remove("tutorial");

        setTimeout(() => {
            resultado = document.getElementById("result");

            resultado.addEventListener("click", step7);
        }, 1000);

        speak.innerHTML = "Clique no resultado para alterar a base.";
    }

    function step7() {
        villageSound.currentTime = 0;
        villageSound.play();

        resultado.removeEventListener("click", step7);

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