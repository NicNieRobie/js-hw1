let currentProject = getCurrentProject();

init();

function init() {
  document.getElementById("topBackLink").style.display = 'none';

  for (element of document.querySelectorAll('[id^="error"][id$="Div"]')) {
    element.style.display = 'none';
  }

  if (!currentProject) {
    document.getElementById("errorProjectLoadDiv").style.display = 'block';
    document.getElementById("topBackLink").style.display = 'block';
    document.getElementsByClassName("form-container")[0].style.display = 'none';
    return;
  }

  document.getElementById("btnProjSettings").onclick = () => {
    window.location.href = "./project-settings.html";
  }

  document.getElementById("projectNameLabel").innerText = `Проект ${currentProject.name}`;
  document.getElementById("memberCountLabel").innerText = `${currentProject.members.length} участника`;
  document.getElementById("projectDescription").innerText = currentProject.description;

  let modal = document.getElementById("taskModal");

  document.getElementById("btnTaskModalClose").onclick = () => {
    modal.style.display = 'none';
  }

  document.getElementById("taskModal").onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  }

  loadBoards();
}

function loadBoards() {
  let boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = "";

  for (board of currentProject.boards) {
    let boardDiv = document.createElement("div");
    boardDiv.className = "board";
    boardContainer.appendChild(boardDiv);

    let boardHeader = document.createElement("div");
    boardHeader.className = "board-header";
    boardDiv.appendChild(boardHeader);

    let boardName = document.createElement("button");
    boardName.className = "board-name";
    boardName.id = "btnBoard" + board.id;
    boardName.innerText = board.name;
    boardName.onclick = (e) => {
      let boardId = Number(e.target.id.replace("btnBoard", ""));
      setCurrentBoardId(boardId);
      window.location.href = "./board.html";
    };
    boardHeader.appendChild(boardName);

    let boardHeaderSidebar = document.createElement("div");
    boardHeaderSidebar.className = "board-header-sidebar";
    boardHeader.appendChild(boardHeaderSidebar);

    let boardTaskCountSpan = document.createElement("span");
    boardTaskCountSpan.innerText = `${board.tasks.length} задач`;
    boardHeaderSidebar.appendChild(boardTaskCountSpan);

    let boardSettingsButton = document.createElement("button");
    boardSettingsButton.innerText = "Настройки";
    boardSettingsButton.id = "btnSettings" + board.id;
    boardSettingsButton.onclick = (e) => {
      let boardId = Number(e.target.id.replace("btnSettings", ""));
      setCurrentBoardId(boardId);
      window.location.href = "./board-settings.html";
    }
    boardHeaderSidebar.appendChild(boardSettingsButton);

    let boardRemoveButton = document.createElement("button");
    boardRemoveButton.innerText = "Удалить";
    boardRemoveButton.id = "btnRemove" + board.id;
    boardRemoveButton.onclick = (e) => {
      if (confirm("Доска задач будет удалена. Продолжить?")) {
        let boardId = Number(e.target.id.replace("btnRemove", ""));
        removeBoardData(boardId);

        currentProject = getCurrentProject();
        loadBoards();
      }
    };
    boardHeaderSidebar.appendChild(boardRemoveButton);

    let boardTasksContainer = document.createElement("div");
    boardTasksContainer.className = "board-tasks-container";
    boardDiv.appendChild(boardTasksContainer);

    for (task of board.tasks) {
      let boardTaskDiv = document.createElement("div");
      boardTaskDiv.classList.add('board-task', 'interactive-panel');
      boardTaskDiv.id = "btnTaskModal" + task.id + "-" + board.id;
      boardTaskDiv.onclick = (e) => {
        let idStr = e.target.closest('[id^="btnTaskModal"]').id.replace("btnTaskModal", "");

        let taskId = Number(idStr.split('-')[0]);
        let boardId = Number(idStr.split('-')[1]);

        setCurrentBoardId(boardId);
        setCurrentTaskId(taskId);
        displayModalTask();
      }
      boardTasksContainer.appendChild(boardTaskDiv);

      let boardTaskHeaderDiv = document.createElement("div");
      boardTaskDiv.appendChild(boardTaskHeaderDiv);

      let boardTaskName = document.createElement("span");
      boardTaskName.className = "task-name";
      boardTaskName.innerText = task.name;
      boardTaskHeaderDiv.appendChild(boardTaskName);

      boardTaskHeaderDiv.appendChild(document.createElement("br"));

      let boardTaskStatus = document.createElement("span");
      boardTaskStatus.className = "task-status";
      boardTaskStatus.innerText = `#${task.id} - ${task.status ? 'Статус "' + task.status + '"' : 'Статус не установлен'}`;
      boardTaskHeaderDiv.appendChild(boardTaskStatus);

      let taskExecCount = document.createElement("span");
      taskExecCount.className = "task-exec-count";
      taskExecCount.innerText = `${task.executors.length} исполнителей`;
      boardTaskDiv.appendChild(taskExecCount);
    }

    let boardTaskDiv = document.createElement("div");
    boardTaskDiv.classList.add('board-task', 'interactive-panel');
    boardTaskDiv.id = "btnCreateTask" + board.id;
    boardTaskDiv.onclick = (e) => {
      let boardId = Number(e.target.closest('[id^="btnCreateTask"]').id.replace("btnCreateTask", ""));
      setCurrentBoardId(boardId);
      window.location.href = "./new-task.html";
    }
    boardTasksContainer.appendChild(boardTaskDiv);

    let boardTaskHeaderDiv = document.createElement("div");
    boardTaskDiv.appendChild(boardTaskHeaderDiv);

    let boardTaskName = document.createElement("span");
    boardTaskName.className = "task-name";
    boardTaskName.innerText = "Создать задачу";
    boardTaskHeaderDiv.appendChild(boardTaskName);
  }
}

function displayModalTask() {
  let currentTask = getCurrentTask();

  if (!currentTask) {
    return;
  }

  document.getElementById("taskModalName").textContent = `#${currentTask.id} - ${currentTask.name}`;
  document.getElementById("taskModalStatus").textContent = currentTask.status ? `Статус - ${currentTask.status}` : `Статус - Не установлен`;

  if (currentTask.dueDate) {
    document.getElementById("taskModalDueDate").style.display = 'block';
    document.getElementById("taskModalDueDate").textContent = `Срок выполнения - ${currentTask.dueDate}`;
  } else {
    document.getElementById("taskModalDueDate").style.display = 'none';
  }

  let taskModalLabelsContainer = document.getElementById("taskModalLabelsContainer");

  if (currentTask.labels.length > 0) {
    taskModalLabelsContainer.innerHTML = '';
    taskModalLabelsContainer.style.display = 'flex';

    for (label of currentTask.labels) {
      let taskLabelDiv = document.createElement("div");
      taskLabelDiv.className = "task-label";
      taskModalLabelsContainer.appendChild(taskLabelDiv);

      let taskLabelName = document.createElement("span");
      taskLabelName.className = "label-name";
      taskLabelName.textContent = label;
      taskLabelDiv.appendChild(taskLabelName);
    }
  } else {
    taskModalLabelsContainer.innerHTML = '';
    taskModalLabelsContainer.style.display = 'none';
  }

  document.getElementById("taskModalDescription").textContent = currentTask.description && currentTask.description !== "" ? currentTask.description : "Нет описания.";

  if (currentTask.executors.length > 0) {
    document.getElementById("taskModalExecutors").textContent = currentTask.executors.map(ex => ex.name).join(', ');
  } else {
    document.getElementById("taskModalExecutors").textContent = 'Нет назначенных исполнителей.';
  }

  let taskModalLinksSection = document.getElementById('taskModalLinksSection');
  let taskModalLinksContainer = document.getElementById('taskModalLinksContainer');
  taskModalLinksContainer.innerHTML = '';

  if (currentTask.links.length > 0) {
    taskModalLinksSection.style.display = 'block';

    for (link of currentTask.links) {
      let task = getTask(link.id);

      if (task) {
        let boardTaskDiv = document.createElement("div");
        boardTaskDiv.classList.add('board-task', 'interactive-panel');
        boardTaskDiv.id = "btnLinkedTask" + task.id;
        boardTaskDiv.onclick = (e) => {
          let taskId = Number(e.target.closest('[id^="btnLinkedTask"]').id.replace("btnLinkedTask", ""));

          setCurrentTaskId(taskId);
          displayModalTask();
        }
        taskModalLinksContainer.appendChild(boardTaskDiv);

        let boardTaskHeaderDiv = document.createElement("div");
        boardTaskDiv.appendChild(boardTaskHeaderDiv);

        let boardTaskName = document.createElement("span");
        boardTaskName.className = "task-name";
        boardTaskName.innerText = task.name;
        boardTaskHeaderDiv.appendChild(boardTaskName);

        boardTaskHeaderDiv.appendChild(document.createElement("br"));

        let boardTaskStatus = document.createElement("span");
        boardTaskStatus.className = "task-status";
        boardTaskStatus.innerText = `#${task.id} - ${task.status ? 'Статус "' + task.status + '"' : 'Статус не установлен'}`;
        boardTaskHeaderDiv.appendChild(boardTaskStatus);

        let taskExecCount = document.createElement("span");
        taskExecCount.className = "task-exec-count";
        taskExecCount.innerText = `${task.executors.length} исполнителей`;
        boardTaskDiv.appendChild(taskExecCount);
      }
    }
  } else {
    taskModalLinksSection.style.display = 'none';
  }

  document.getElementById("btnTaskModalSettings").onclick = () => {
    window.location.href = "./task-settings.html";
  };

  document.getElementById("taskModal").style.display = 'block';
}
