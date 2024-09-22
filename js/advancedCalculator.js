const teclado = document.getElementById("keyboard");
const input = document.getElementById("input");
const output = document.getElementById("output");
const buttonCalcular = document.getElementById("calcular");

let calculo = [];

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


    if (tamanho > 0 && "numero" in ultimoItem && ultimoItem.numero === "") {
        return;
    }

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
            <button class="key" id="add">Add</button>
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

    const resultadoDecimal = Number(eval(converterNumerosParaDecimal.join("")));
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
    const resultados = calcular();
    let indiceBaseResultado = 0;

    const furnaceAudio = new Audio("./sounds/furnace.mp3");
    furnaceAudio.play();

    const arrowProgress = document.getElementById("arrowProgress");
    const fireProgress = document.getElementById("fireProgress");

    arrowProgress.style.animation = `linear progressAnimation 1s`;
    fireProgress.style.animation = `linear fireAnimation 1s`;

    indiceBaseResultado = 0;

    setTimeout(() => {
        output.innerHTML = `<p id=result>${resultados[indiceBaseResultado].resultado}<span class="base">${resultados[indiceBaseResultado].base}</span></p>`;

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
 * TUTORIAL DE COMO USAR O CALCULADORA
 * 
 * =====================================
 */