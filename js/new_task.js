let newTaskData = taskDataTemplate;
let currentProjectData = getCurrentProject();
let currentBoardData = getCurrentBoard();

init();

function init() {
  document.getElementById("topBackLink").style.display = 'none';
  document.getElementById("addNewTaskExecutorSection").style.display = 'none';
  document.getElementById("addNewTaskLabelSection").style.display = 'none';
  document.getElementById("addNewTaskLinkSection").style.display = 'none';

  for (element of document.querySelectorAll('[id^="error"][id$="Div"]')) {
    element.style.display = 'none';
  }

  for (element of document.getElementsByClassName("back-link")) {
    element.onclick = () => {
      history.back();
    };
  }

  if (!currentProjectData) {
    document.getElementById("errorProjectLoadDiv").style.display = 'block';
    document.getElementById("topBackLink").style.display = 'block';
    document.getElementsByClassName("form-container")[0].style.display = 'none';
    return;
  }

  if (!currentBoardData) {
    document.getElementById("errorBoardLoadDiv").style.display = 'block';
    document.getElementById("topBackLink").style.display = 'block';
    document.getElementsByClassName("form-container")[0].style.display = 'none';
    return;
  }

  document.getElementById("newTaskDate").min = new Date().toLocaleDateString('en-ca');

  loadProjectMembersList();
  loadBoardLabelsList();
  loadBoardTasksList();

  document.getElementById("showNewTaskExecutorsSection").onclick = () => {
    document.getElementById("addNewTaskExecutorSection").style.display = 'block';
    document.getElementById("showNewTaskExecutorsSection").style.display = 'none';
  }

  document.getElementById("showNewTaskLabelsSection").onclick = () => {
    document.getElementById("addNewTaskLabelSection").style.display = 'block';
    document.getElementById("showNewTaskLabelsSection").style.display = 'none';
  }

  document.getElementById("showNewTaskLinksSection").onclick = () => {
    document.getElementById("addNewTaskLinkSection").style.display = 'block';
    document.getElementById("showNewTaskLinksSection").style.display = 'none';
  }

  document.getElementById("addNewTaskExecutor").onclick = () => {
    const selectedOptions = document.getElementById("newTaskExecutorsSelector").selectedOptions;

    let optionsForDeletion = [];

    for (option of selectedOptions) {
      let memberId = Number(option.id.replace("optionMember", ""));

      if (!isNaN(memberId)) {
        newTaskData.executors.push({id: memberId, name: option.text});
        optionsForDeletion.push(option);
      }
    }

    for (option of optionsForDeletion) {
      document.getElementById("newTaskExecutorsSelector").removeChild(option);
    }

    document.getElementById("noExecutorsHeader").style.display = 'none';

    displayExecutors();
  }

  document.getElementById("addNewTaskLabel").onclick = () => {
    const selectedOptions = document.getElementById("newTaskLabelsSelector").selectedOptions;

    let optionsForDeletion = [];

    for (option of selectedOptions) {
      newTaskData.labels.push(option.text);
      optionsForDeletion.push(option);
    }

    for (option of optionsForDeletion) {
      document.getElementById("newTaskLabelsSelector").removeChild(option);
    }

    document.getElementById("noLabelsHeader").style.display = 'none';

    displayLabels();
  }

  document.getElementById("addNewTaskLink").onclick = () => {
    const selectedOptions = document.getElementById("newTaskLinksSelector").selectedOptions;

    let optionsForDeletion = [];

    for (option of selectedOptions) {
      let taskId = Number(option.id.replace("optionLink", ""));

      if (!isNaN(taskId)) {
        newTaskData.links.push({id: taskId, name: option.text});
        optionsForDeletion.push(option);
      }
    }

    for (option of optionsForDeletion) {
      document.getElementById("newTaskLinksSelector").removeChild(option);
    }

    document.getElementById("noLinksHeader").style.display = 'none';

    displayLinks();
  }

  document.getElementById("createTask").onclick = () => {
    document.getElementById("errorTaskParamsDiv").style.display = 'none';

    let taskName = document.getElementById("newTaskName").value;
    let taskDesc = document.getElementById("newTaskDesc").value;
    let taskDueDate = document.getElementById("newTaskDate").value;

    if (!taskName) {
      document.getElementById("errorTaskParamsDiv").style.display = 'block';
      return;
    }

    newTaskData.name = taskName;
    newTaskData.description = taskDesc;
    newTaskData.dueDate = taskDueDate;

    saveNewTask();
  }
}

function loadProjectMembersList() {
  let memberSelector = document.getElementById("newTaskExecutorsSelector");
  memberSelector.innerHTML = "";

  for (member of currentProjectData.members) {
    let memberOption = document.createElement("option");
    memberOption.text = member.name;
    memberOption.id = "optionMember" + member.id;
    memberSelector.appendChild(memberOption);
  }
}

function loadBoardLabelsList() {
  let labelSelector = document.getElementById("newTaskLabelsSelector");
  labelSelector.innerHTML = "";

  for (label of currentBoardData.labels) {
    let labelOption = document.createElement("option");
    labelOption.text = label;
    labelSelector.appendChild(labelOption);
  }
}

function loadBoardTasksList() {
  let linkSelector = document.getElementById("newTaskLinksSelector");
  linkSelector.innerHTML = "";

  for (task of currentBoardData.tasks) {
    let linkOption = document.createElement("option");
    linkOption.text = `#${task.id} - ${task.name}`;
    linkOption.id = "optionLink" + task.id;
    linkSelector.appendChild(linkOption);
  }
}

function displayExecutors() {
  let newTaskExecutorsSection = document.getElementById("newTaskExecutorsSection");
  newTaskExecutorsSection.innerHTML = '';

  for ([index, executorStr] of newTaskData.executors.entries()) {
    let div = document.createElement("div");
    div.className = "listMember";
    newTaskExecutorsSection.appendChild(div);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = executorStr.name;
    div.appendChild(nameSpan);

    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnExecutorRemove" + executorStr.id;
    button.onclick = (e) => {
      let executorId = Number(e.target.id.replace("btnExecutorRemove", ""));

      const indexOfExecutor = newTaskData.executors.findIndex(object => {
        return object.id === executorId;
      });

      let memberOption = document.createElement("option");
      memberOption.text = newTaskData.executors[indexOfExecutor].name;
      memberOption.id = "optionMember" + executorId;
      document.getElementById("newTaskExecutorsSelector").appendChild(memberOption);

      newTaskData.executors.splice(indexOfExecutor, 1);

      displayExecutors();
    };
    div.appendChild(button);
  }
}

function displayLabels() {
  let newTaskLabelsSection = document.getElementById("newTaskLabelsSection");
  newTaskLabelsSection.innerHTML = '';

  for ([index, label] of newTaskData.labels.entries()) {
    let div = document.createElement("div");
    div.className = "listMember";
    newTaskLabelsSection.appendChild(div);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = label;
    div.appendChild(nameSpan);

    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnLabelRemove" + index;
    button.onclick = (e) => {
      let labelIdx = Number(e.target.id.replace("btnLabelRemove", ""));

      let labelOption = document.createElement("option");
      labelOption.text = newTaskData.labels[labelIdx];
      document.getElementById("newTaskLabelsSelector").appendChild(labelOption);

      newTaskData.labels.splice(labelIdx, 1);

      displayLabels();
    };
    div.appendChild(button);
  }
}

function displayLinks() {
  let newTaskLinksSection = document.getElementById("newTaskLinksSection");
  newTaskLinksSection.innerHTML = '';

  for ([index, link] of newTaskData.links.entries()) {
    let div = document.createElement("div");
    div.className = "listMember";
    newTaskLinksSection.appendChild(div);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = link.name;
    div.appendChild(nameSpan);

    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnLinkRemove" + link.id;
    button.onclick = (e) => {
      let linkId = Number(e.target.id.replace("btnLinkRemove", ""));

      const indexOfLink = newTaskData.links.findIndex(object => {
        return object.id === linkId;
      });

      let linkOption = document.createElement("option");
      linkOption.text = `#${newTaskData.links[indexOfLink].id} - ${newTaskData.links[indexOfLink].name}`;
      linkOption.id = "optionLink" + newTaskData.links[indexOfLink].id;
      document.getElementById("newTaskLinksSelector").appendChild(linkOption);

      newTaskData.links.splice(indexOfLink, 1);

      displayLinks();
    };
    div.appendChild(button);
  }
}

function saveNewTask() {
  addTaskData(newTaskData);
  history.back();
}
