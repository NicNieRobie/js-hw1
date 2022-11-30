let newBoardData = boardDataTemplate;

init();

function init() {
  document.getElementById("addNewBoardLabelSection").style.display = 'none';
  document.getElementById("addNewBoardStatusSection").style.display = 'none';

  for (element of document.querySelectorAll('[id^="error"][id$="Div"]')) {
    element.style.display = 'none';
  }

  for (element of document.getElementsByClassName("back-link")) {
    element.onclick = () => {
      history.back();
    };
  }

  document.getElementById("showNewBoardLabelSection").onclick = () => {
    document.getElementById("addNewBoardLabelSection").style.display = 'block';
    document.getElementById("showNewBoardLabelSection").style.display = 'none';
    document.getElementById("noLabelsHeader").style.display = 'none';
  }

  document.getElementById("addNewBoardLabel").onclick = () => {
    document.getElementById("errorNewBoardLabelDiv").style.display = 'none';

    let labelName = document.getElementById("newBoardLabelName").value;

    if (newBoardData.labels.includes(labelName) || !labelName) {
      document.getElementById("errorNewBoardLabelDiv").style.display = 'block';
      return;
    }

    newBoardData.labels.push(labelName);

    displayLabels();
  }

  document.getElementById("showNewBoardStatusSection").onclick = () => {
    document.getElementById("addNewBoardStatusSection").style.display = 'block';
    document.getElementById("showNewBoardStatusSection").style.display = 'none';
    document.getElementById("noStatusLabel").style.display = 'none';
  }

  document.getElementById("addNewBoardStatus").onclick = () => {
    document.getElementById("errorNewBoardStatusDiv").style.display = 'none';

    let statusName = document.getElementById("newBoardStatusName").value;

    if (newBoardData.status.includes(statusName) || !statusName) {
      document.getElementById("errorNewBoardStatusDiv").style.display = 'block';
      return;
    }

    newBoardData.status.push(statusName);

    displayStatus();
  }

  document.getElementById("createBoard").onclick = () => {
    document.getElementById("errorBoardParamsDiv").style.display = 'none';

    let boardName = document.getElementById("newBoardName").value;

    if (!boardName) {
      document.getElementById("errorBoardParamsDiv").style.display = 'block';
      return;
    }

    newBoardData.name = boardName;

    saveNewBoard();
  }
}

function displayLabels() {
  let newBoardLabelsSection = document.getElementById("newBoardLabelsSection");
  newBoardLabelsSection.innerHTML = '';

  for ([index, label] of newBoardData.labels.entries()) {
    let div = document.createElement("div");
    div.className = "listMember";
    newBoardLabelsSection.appendChild(div);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = label;
    div.appendChild(nameSpan);

    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnLabelRemove" + index;
    button.onclick = (e) => {
      let index = Number(e.target.id.replace("btnLabelRemove", ""));

      newBoardData.labels.splice(index, 1);

      displayLabels();
    };
    div.appendChild(button);
  }
}

function displayStatus() {
  let newBoardStatusSection = document.getElementById("newBoardStatusSection");
  newBoardStatusSection.innerHTML = '';

  for ([index, statusStr] of newBoardData.status.entries()) {
    let div = document.createElement("div");
    div.className = "listMember";
    newBoardStatusSection.appendChild(div);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = statusStr;
    div.appendChild(nameSpan);

    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnStatusRemove" + index;
    button.onclick = (e) => {
      let index = Number(e.target.id.replace("btnStatusRemove", ""));

      newBoardData.status.splice(index, 1);

      displayStatus();
    };
    div.appendChild(button);
  }
}

function saveNewBoard() {
  addBoardData(newBoardData);
  history.back();
}