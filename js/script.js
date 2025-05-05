//Variáveis Iniciais
let operation = "multiplicacao";
let selected = [];
let tutorialSteps = [];
let step = 0;

//Sons para cada operação
const sounds = {
    multiplicacao: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_a1ccfb7035.mp3'),
    adicao: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_a1ccfb7035.mp3'),
    subtracao: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_5c94f9ef44.mp3'),
    divisao: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_5c94f9ef44.mp3'),
};

//Criando a Tabela da Tabuada
function createTable(){
    const container = document.getElementById("table-container")
    let html = "<table><tr><th></th>";

    for (let c = 1; c <= 10; c++){
        html += `<th data-col="${c}">${c}</th>`;
    }

    html += "</tr>";

    for (let r = 1; r <= 10; r++){
        html += `<tr><ht data-row="${r}">${r}</th>`;
        for (let c = 1; c <= 10; c++){

            const value = (operation === "adicao") ? r + c : r * c;
            html += `<td data-cell="${r}-${c}" data-value="${value}">${value}</td>`;
        }
        html += "</tr>"
    }

    html += "</table>";
    container.innerHTML = html;
    setListeners();        
}

//Adicionando Eventos de Clique
function setListeners(){
    document.querySelectorAll("th[data-row], th[data-col]").forEach(el =>
        el.addEventListener("click", handleEdgeClick)
    );
    document.querySelectorAll("td[data-cell]").forEach(el =>
        el.addEventListener("click", handCellClick)
    );
}
