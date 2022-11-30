let currentBoard = getCurrentBoard();

init();

function init() {
  document.getElementById("topBackLink").style.display = 'none';
  document.getElementById("addBoardLabelSection").style.display = 'none';
  document.getElementById("addBoardStatusSection").style.display = 'none';

  for (element of document.querySelectorAll('[id^="error"][id$="Div"]')) {
    element.style.display = 'none';
  }

  for (element of document.getElementsByClassName("back-link")) {
    element.onclick = () => {
      history.back();
    };
  }

  if (!currentBoard) {
    document.getElementById("errorBoardLoadDiv").style.display = 'block';
    document.getElementById("topBackLink").style.display = 'block';
    document.getElementsByClassName("form-container")[0].style.display = 'none';
    return;
  }

  document.getElementById("boardSettingsDesc").textContent = `Настройки доски задач ${currentBoard.name}.`;

  document.getElementById("boardName").value = currentBoard.name;

  if (currentBoard.labels.length > 0) {
    document.getElementById("noLabelsHeader").style.display = 'none';
  }

  if (currentBoard.status.length > 0) {
    document.getElementById("noStatusLabel").style.display = 'none';
  }

  document.getElementById("showBoardLabelSection").onclick = () => showBoardLabelSection();

  document.getElementById("addBoardLabel").onclick = () => addBoardLabel();

  document.getElementById("showBoardStatusSection").onclick = () => showBoardStatusSection();

  document.getElementById("addBoardStatus").onclick = () => addBoardStatus();

  document.getElementById("saveBoard").onclick = () => saveBoardHandle();

  displayLabels();
  displayStatus();
}

function showBoardLabelSection() {
  document.getElementById("addBoardLabelSection").style.display = 'block';
  document.getElementById("showBoardLabelSection").style.display = 'none';
  document.getElementById("noLabelsHeader").style.display = 'none';
}

function showBoardStatusSection() {
  document.getElementById("addBoardStatusSection").style.display = 'block';
  document.getElementById("showBoardStatusSection").style.display = 'none';
  document.getElementById("noStatusLabel").style.display = 'none';
}

function addBoardLabel() {
  document.getElementById("errorBoardLabelDiv").style.display = 'none';

  let labelName = document.getElementById("boardLabelName").value;

  if (currentBoard.labels.includes(labelName) || !labelName) {
    document.getElementById("errorBoardLabelDiv").style.display = 'block';
    return;
  }

  currentBoard.labels.push(labelName);

  displayLabels();
}

function addBoardStatus() {
  document.getElementById("errorBoardStatusDiv").style.display = 'none';

  let statusName = document.getElementById("boardStatusName").value;

  if (currentBoard.status.includes(statusName) || !statusName) {
    document.getElementById("errorBoardStatusDiv").style.display = 'block';
    return;
  }

  currentBoard.status.push(statusName);

  displayStatus();
}

function saveBoardHandle() {
  document.getElementById("errorBoardParamsDiv").style.display = 'none';

  let boardName = document.getElementById("boardName").value;

  if (!boardName) {
    document.getElementById("errorBoardParamsDiv").style.display = 'block';
    return;
  }

  currentBoard.name = boardName;

  for (task of currentBoard.tasks) {
    task.labels = task.labels.filter(label => currentBoard.labels.includes(label));
    task.status = currentBoard.status.includes(task.status) ? task.status : null;
  }

  saveBoard();
}

function displayLabels() {
  let boardLabelsSection = document.getElementById("boardLabelsSection");
  boardLabelsSection.innerHTML = '';

  for ([index, label] of currentBoard.labels.entries()) {
    let div = document.createElement("div");
    div.className = "listMember";
    boardLabelsSection.appendChild(div);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = label;
    div.appendChild(nameSpan);

    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnLabelRemove" + index;
    button.onclick = (e) => {
      let index = Number(e.target.id.replace("btnLabelRemove", ""));

      currentBoard.labels.splice(index, 1);

      if (currentBoard.labels.length === 0) {
        document.getElementById("noLabelsHeader").style.display = 'block';
      }

      displayLabels();
    };
    div.appendChild(button);
  }
}

function displayStatus() {
  let boardStatusSection = document.getElementById("boardStatusSection");
  boardStatusSection.innerHTML = '';

  for ([index, statusStr] of currentBoard.status.entries()) {
    let div = document.createElement("div");
    div.className = "listMember";
    boardStatusSection.appendChild(div);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = statusStr;
    div.appendChild(nameSpan);

    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnStatusRemove" + index;
    button.onclick = (e) => {
      let index = Number(e.target.id.replace("btnStatusRemove", ""));

      currentBoard.status.splice(index, 1);

      if (currentBoard.status.length === 0) {
        document.getElementById("noLabelsHeader").style.display = 'block';
      }

      displayStatus();
    };
    div.appendChild(button);
  }
}

function saveBoard() {
  saveCurrentBoard(currentBoard);
  history.back();
}