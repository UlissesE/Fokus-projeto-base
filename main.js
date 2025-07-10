const html = document.querySelector("html");
const btnFoco = document.querySelector(".app__card-button--foco");
const btnDescanso = document.querySelector(".app__card-button--curto");
const btnDescansoLongo = document.querySelector(".app__card-button--longo");
const banner = document.querySelector(".app__image");
const texto = document.querySelector(".app__title");
const botoes = document.querySelectorAll(".app__card-button");
const startPauseBtn = document.querySelector("#start-pause")
const musicaFocoInput = document.querySelector("#alternar-musica");
const musica = new Audio("/sons/luna-rise-part-one.mp3")
const play = new Audio("/sons/play.wav");
const pause = new Audio("/sons/pause.mp3");
const beep = new Audio("/sons/beep.mp3");
musica.loop = true

let tempoDecorridoEmSegundos = 1;
let intervaloId = null;
const tempoNaTela = document.querySelector("#timer");

musicaFocoInput.addEventListener("change", () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

btnFoco.addEventListener("click", () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    btnFoco.classList.add("active")
})
btnDescanso.addEventListener("click", () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    btnDescanso.classList.add("active");
})
btnDescansoLongo.addEventListener("click", () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    btnDescansoLongo.classList.add("active");
})

function alterarContexto(contexto) {
    mostrarTempo()
    botoes.forEach(function (contexto){
        contexto.classList.remove("active")
    })
    html.setAttribute("data-contexto", `${contexto}`);
    banner.src = `/imagens/${contexto}.png`;

    switch (contexto) {
        case "foco":
            texto.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            texto.innerHTML = `
            Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case "descanso-longo":
            texto.innerHTML = `
            Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        alterarBotaoComecar("Começar")
        beep.play();

        const focoAtivo = html.getAttribute("data-contexto") == "foco";
        if (focoAtivo) {
            const evento = new CustomEvent("focoFinalizado");
            document.dispatchEvent(evento)
        }

        zerar()
        alert("Tempo acabou");
        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo()
}

startPauseBtn.addEventListener("click", iniciar)

function iniciar() {
    if (intervaloId) {
        pause.play()
        alterarBotaoComecar("Começar")
        zerar()
        return
    }
    alterarBotaoComecar("Pausar")
    play.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
}

function zerar() {
    clearInterval(intervaloId);
    intervaloId = null
}

function alterarBotaoComecar(mensagem) {
    startPauseBtn.innerHTML = `
    <img class="app__card-primary-butto-icon" src="/imagens/${mensagem}.png" alt="">
    <span>${mensagem}</span>
    `
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()