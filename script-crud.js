const btnAdicionarTarefa = document.querySelector(".app__button--add-task");
const formAdicionarTarefa = document.querySelector(".app__form-add-task");
const btnCancelarTarefa = document.querySelector(".app__form-footer__button--cancel");
const textArea = document.querySelector(".app__form-textarea");
const listaTarefas = document.querySelector(".app__section-task-list")
const paragrafoTarefaEmAndamento = document.querySelector(".app__section-active-task-description");
const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector("#btn-remover-todas");

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null
let liTarefaSelecionada = null

document.addEventListener("DOMContentLoaded", function () {
    tarefas.forEach(tarefa => {
        const elementoTarefa = criarTarefa(tarefa);
        listaTarefas.appendChild(elementoTarefa);
    });
})

btnAdicionarTarefa.addEventListener("click", () => {
    formAdicionarTarefa.classList.toggle('hidden')
})

btnCancelarTarefa.addEventListener("click", limparFormulario);

function limparFormulario() {
    textArea.value = "";
    formAdicionarTarefa.classList.toggle('hidden')
}

formAdicionarTarefa.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarTarefa(tarefa);
    listaTarefas.appendChild(elementoTarefa);
    atualizarTarefa();
    textArea.value = '';
    formAdicionarTarefa.classList.add("hidden");
})

function criarTarefa(tarefa) {
    const li = document.createElement("li")
    li.classList.add("app__section-task-list-item");

    const svg = document.createElement("svg");
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `

    const paragrafo = document.createElement("p");
    paragrafo.classList.add("app__section-task-list-item-description");
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement("button");
    botao.classList.add("app_button-edit");
    botao.onclick = () => {
        const novaDescricao = prompt("Nova descrição")

        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefa();
        } else {
            alert("Descrição inválida");
            return
        }
    }

    const imagem = document.createElement("img");
    imagem.setAttribute("src", "/imagens/edit.png");
    botao.appendChild(imagem);

    li.append(svg, paragrafo, botao)

    if (tarefa.completa) {
        li.classList.add("app__section-task-list-item-complete");
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            document.querySelectorAll(".app__section-task-list-item-active").forEach(elemento => {
                elemento.classList.remove("app__section-task-list-item-active");
            })

            if (tarefaSelecionada == tarefa) {
                paragrafoTarefaEmAndamento.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }

            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li
            paragrafoTarefaEmAndamento.textContent = tarefa.descricao;
            li.classList.toggle("app__section-task-list-item-active");
        }
    }
    return li;
}

function atualizarTarefa() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

document.addEventListener('focoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
        liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
        liTarefaSelecionada.querySelector("button").setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefa();
    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefa()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)