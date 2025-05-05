let operation = "multiplicacao";
let selected = [];
let tutorialSteps = [];
let step = 0;

const sounds = {
  multiplicacao: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_a1ccfb7035.mp3'),
  adicao: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_a1ccfb7035.mp3'),
  subtracao: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_5c94f9ef44.mp3'),
  divisao: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_5c94f9ef44.mp3')
};

function createTable() {
  const container = document.getElementById("table-container");
  let html = "<table><tr><th></th>";

  for (let c = 1; c <= 10; c++) {
    html += `<th data-col="${c}">${c}</th>`;
  }

  html += "</tr>";

  for (let r = 1; r <= 10; r++) {
    html += `<tr><th data-row="${r}">${r}</th>`;
    for (let c = 1; c <= 10; c++) {
      const value = (operation === "adicao") ? r + c : r * c;
      html += `<td data-cell="${r}-${c}" data-value="${value}">${value}</td>`;
    }
    html += "</tr>";
  }

  html += "</table>";
  container.innerHTML = html;
  setListeners();
}

function setListeners() {
  document.querySelectorAll("th[data-row], th[data-col]").forEach(el =>
    el.addEventListener("click", handleEdgeClick)
  );
  document.querySelectorAll("td[data-cell]").forEach(el =>
    el.addEventListener("click", handleCellClick)
  );
}

function handleEdgeClick(e) {
  const el = e.target;
  const value = parseInt(el.innerText);
  const isRow = el.hasAttribute("data-row");

  clearHighlights();

  if (operation === "multiplicacao" || operation === "adicao") {
    // Para multiplicação e adição
    if (isRow) {
      document.querySelector(`th[data-row="${value}"]`).classList.add("selected-row");
    } else {
      document.querySelector(`th[data-col="${value}"]`).classList.add("selected-col");
    }

    selected.push({ type: isRow ? "row" : "col", value });

    if (selected.length === 2) {
      const row = selected.find(s => s.type === "row")?.value;
      const col = selected.find(s => s.type === "col")?.value;
      if (row && col) {
        const result = operate(row, col);
        const cell = document.querySelector(`td[data-cell="${row}-${col}"]`);
        cell.classList.add("highlighted");
        addHistory(`${row} ${symbol()} ${col} = ${result}`);
        playSound();
        selected = [];
      }
    }
  } else {
    // Para subtração e divisão
    const cellObj = selected.find(s => s.type === "cell");
    if (cellObj) {
      const result = operate(cellObj.value, value);
      addHistory(`${cellObj.value} ${symbol()} ${value} = ${result}`);
      playSound();
      selected = [];
      clearSelection();
    }
  }
}

function handleCellClick(e) {
  if (operation === "subtracao" || operation === "divisao") {
    clearSelection();
    const el = e.target;
    const value = parseInt(el.dataset.value);
    el.classList.add("selected-cell");
    selected = [{ type: "cell", value }];
  }
}

function operate(a, b) {
  switch (operation) {
    case "multiplicacao": return a * b;
    case "adicao": return a + b;
    case "subtracao": return a - b;
    case "divisao": return b === 0 ? "∞" : (a / b).toFixed(2);
  }
}

function symbol() {
  return {
    multiplicacao: "×",
    adicao: "+",
    subtracao: "−",
    divisao: "÷"
  }[operation];
}

function clearSelection() {
  selected = [];
  document.querySelectorAll(".selected-row, .selected-col, .selected-cell, .highlighted, .highlight-result")
    .forEach(el => el.classList.remove("selected-row", "selected-col", "selected-cell", "highlighted", "highlight-result"));
}

function clearHighlights() {
  document.querySelectorAll(".highlighted, .highlight-result")
    .forEach(el => el.classList.remove("highlighted", "highlight-result"));
}

function addHistory(text) {
  const li = document.createElement("li");
  li.innerText = text;
  document.getElementById("history").appendChild(li);
}

function clearHistory() {
  document.getElementById("history").innerHTML = "";
}

function playSound() {
  const audio = sounds[operation];
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function changeOperation() {
  operation = document.getElementById("operation").value;
  document.body.className = operation;
  clearSelection();
  createTable();
}

// Tutorial
function startTutorial() {
  step = 0;
  tutorialSteps = getTutorialSteps();
  showStep();
}

function getTutorialSteps() {
  if (operation === "multiplicacao" || operation === "adicao") {
    return [
      { text: "Clique em um número da LINHA para destacar", selector: "th[data-row]" },
      { text: "Agora clique em um número da COLUNA para ver o resultado", selector: "th[data-col]" }
    ];
  } else {
    return [
      { text: "Clique em uma célula da tabuada", selector: "td[data-cell]" },
      { text: "Agora clique em um número da extremidade para completar a operação", selector: "th[data-row], th[data-col]" }
    ];
  }
}

function showStep() {
  const popup = document.getElementById("tutorial-popup");
  const text = document.getElementById("tutorial-text");
  if (step < tutorialSteps.length) {
    const current = tutorialSteps[step];
    text.innerText = current.text;
    popup.classList.remove("hidden");
    document.querySelectorAll(current.selector).forEach(el => el.classList.add("highlighted"));
  } else {
    popup.classList.add("hidden");
    clearSelection();
  }
}

function nextTutorialStep() {
  const current = tutorialSteps[step];
  document.querySelectorAll(current.selector).forEach(el => el.classList.remove("highlighted"));
  step++;
  showStep();
}

window.onload = () => {
  changeOperation();
};
