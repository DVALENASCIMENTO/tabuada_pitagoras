//Variáveis Iniciais

let operation = "multiplicacao"; // Define a operação inicial como multiplicação
let selected = [];               // Lista para guardar os itens selecionados (linhas, colunas ou células)
let tutorialSteps = [];          // Lista de etapas do tutorial
let step = 0;                    // Etapa atual do tutorial


//Sons para cada operação

const sounds = {
  multiplicacao: new Audio('https://...7035.mp3'), // Som para multiplicação
  adicao: new Audio('https://...7035.mp3'),        // Som para adição
  subtracao: new Audio('https://...9ef44.mp3'),    // Som para subtração
  divisao: new Audio('https://...9ef44.mp3')       // Som para divisão
};


//Criando a Tabela da Tabuada

function createTable() {
  const container = document.getElementById("table-container"); // Pega o elemento onde a tabela será inserida
  let html = "<table><tr><th></th>"; // Começa a montar o HTML da tabela com a primeira linha vazia


//Cria as Colunas

  for (let c = 1; c <= 10; c++) { // Cria os títulos das colunas (1 a 10)
    html += `<th data-col="${c}">${c}</th>`;
  }

  html += "</tr>"; // Fecha a primeira linha


//Cria as Colunas

  for (let r = 1; r <= 10; r++) { // Para cada linha (1 a 10)
    html += `<tr><th data-row="${r}">${r}</th>`; // Cria o título da linha
    for (let c = 1; c <= 10; c++) {
      // Define o valor da célula conforme a operação
      const value = (operation === "adicao") ? r + c : r * c;
      html += `<td data-cell="${r}-${c}" data-value="${value}">${value}</td>`; // Adiciona a célula com valor
    }
    html += "</tr>"; // Fecha a linha
  }

  html += "</table>"; // Fecha a tabela
  container.innerHTML = html; // Insere a tabela no HTML
  setListeners(); // Ativa os eventos de clique
}


//Adicionando Eventos de Clique

function setListeners() {
  document.querySelectorAll("th[data-row], th[data-col]").forEach(el =>
    el.addEventListener("click", handleEdgeClick) // Clique nas bordas (linha/coluna)
  );
  document.querySelectorAll("td[data-cell]").forEach(el =>
    el.addEventListener("click", handleCellClick) // Clique nas células internas
  );
}



//Lógica ao clicar em linha ou coluna

function handleEdgeClick(e) {
  const el = e.target;                    // Elemento clicado
  const value = parseInt(el.innerText);   // Número clicado
  const isRow = el.hasAttribute("data-row"); // Verifica se é linha

  clearHighlights(); // Limpa destaques anteriores

  if (operation === "multiplicacao" || operation === "adicao") {
    // Se for multiplicação ou adição

    if (isRow) {
      document.querySelector(`th[data-row="${value}"]`).classList.add("selected-row"); // Destaca a linha
    } else {
      document.querySelector(`th[data-col="${value}"]`).classList.add("selected-col"); // Destaca a coluna
    }

    selected.push({ type: isRow ? "row" : "col", value }); // Adiciona à lista de selecionados

    if (selected.length === 2) {
      // Se já escolheu linha e coluna
      const row = selected.find(s => s.type === "row")?.value; // Busca a linha
      const col = selected.find(s => s.type === "col")?.value; // Busca a coluna
      if (row && col) {
        const result = operate(row, col); // Faz a operação
        const cell = document.querySelector(`td[data-cell="${row}-${col}"]`);
        cell.classList.add("highlighted"); // Destaca o resultado
        addHistory(`${row} ${symbol()} ${col} = ${result}`); // Adiciona ao histórico
        playSound(); // Toca o som
        selected = []; // Limpa seleção
      }
    }

  } else {
    // Se for subtração ou divisão
    const cellObj = selected.find(s => s.type === "cell"); // Verifica se já selecionou uma célula
    if (cellObj) {
      const result = operate(cellObj.value, value); // Executa a operação com o valor clicado
      addHistory(`${cellObj.value} ${symbol()} ${value} = ${result}`);
      playSound();
      selected = [];
      clearSelection(); // Limpa seleção
    }
  }
}

