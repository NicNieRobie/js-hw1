let currentBoard = getCurrentBoard();

init();

function init() {
  document.getElementById("topBackLink").style.display = 'none';

  for (element of document.querySelectorAll('[id^="error"][id$="Div"]')) {
    element.style.display = 'none';
  }

  if (!currentBoard) {
    document.getElementById("errorBoardLoadDiv").style.display = 'block';
    document.getElementById("topBackLink").style.display = 'block';
    document.getElementsByClassName("form-container")[0].style.display = 'none';
    return;
  }

  document.getElementById("boardNameLabel").textContent = `Доска задач ${currentBoard.name}`;
  document.getElementById("taskCountLabel").textContent = `${currentBoard.tasks.length} задач`;

  document.getElementById("btnBoardSettings").onclick = () => {
    window.location.href = "./board-settings.html";
  };

  let modal = document.getElementById("taskModal");

  document.getElementById("btnTaskModalClose").onclick = () => {
    modal.style.display = 'none';
  }

  document.getElementById("taskModal").onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  }

  loadTasks();
}

function loadTasks() {
  let boardTasksContainer = document.getElementById("boardTasksContainer");
  boardTasksContainer.innerHTML = '';

  const statusSet = [...new Set(currentBoard.tasks.map(task => task.status ?? "Статус не установлен"))];

  for (statusStr of statusSet) {
    let sectionHeaderSpan = document.createElement("span");
    sectionHeaderSpan.className = "section-header";
    sectionHeaderSpan.textContent = String(statusStr);
    boardTasksContainer.appendChild(sectionHeaderSpan);

    for (task of currentBoard.tasks.filter(task => task.status ? task.status === statusStr : statusStr === "Статус не установлен")) {
      let taskDiv = document.createElement("div");
      taskDiv.className = "task";
      boardTasksContainer.appendChild(taskDiv);

      let taskHeader = document.createElement("div");
      taskHeader.className = "task-header";
      taskDiv.appendChild(taskHeader);

      let taskNameSpan = document.createElement("button");
      taskNameSpan.className = "task-name";
      taskNameSpan.id = `btnTask${task.id}`;
      taskNameSpan.onclick = (e) => {
        let taskId = Number(e.target.id.replace("btnTask", ""));
        setCurrentTaskId(taskId);
        displayModalTask();
      }
      taskNameSpan.textContent = `#${task.id} - ${task.name}`;
      taskHeader.appendChild(taskNameSpan);

      let taskHeaderSidebar = document.createElement("div");
      taskHeaderSidebar.className = "task-header-sidebar";
      taskHeader.appendChild(taskHeaderSidebar);

      let taskExecutorCount = document.createElement("span");
      taskExecutorCount.textContent = `${task.executors.length} исполнителей`;
      taskHeaderSidebar.appendChild(taskExecutorCount);

      let taskSettings = document.createElement("button");
      taskSettings.textContent = "Настройки";
      taskSettings.id = `btnSettings${task.id}`;
      taskSettings.onclick = (e) => {
        let taskId = Number(e.target.id.replace("btnSettings", ""));
        setCurrentTaskId(taskId);
        window.location.href = "./task-settings.html";
      }
      taskHeaderSidebar.appendChild(taskSettings);

      let taskRemove = document.createElement("button");
      taskRemove.textContent = "Удалить";
      taskRemove.id = `btnRemove${task.id}`;
      taskRemove.onclick = (e) => {
        if (confirm("Задача будет удалена. Продолжить?")) {
          let taskId = Number(e.target.id.replace("btnRemove", ""));
          removeTaskData(taskId);
  
          currentBoard = getCurrentBoard();
          loadTasks();
        }
      }
      taskHeaderSidebar.appendChild(taskRemove);

      if (task.labels.length > 0) {
        let taskLabelsContainer = document.createElement("div");
        taskLabelsContainer.className = "task-labels-container";
        taskDiv.appendChild(taskLabelsContainer);
        
        for (label of task.labels) {
          let taskLabelDiv = document.createElement("div");
          taskLabelDiv.className = "task-label";
          taskLabelsContainer.appendChild(taskLabelDiv);
  
          let taskLabelName = document.createElement("span");
          taskLabelName.className = "label-name";
          taskLabelName.textContent = label;
          taskLabelDiv.appendChild(taskLabelName);
        }
      }
    }

    let delimiter = document.createElement("hr");
    boardTasksContainer.appendChild(delimiter);
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
          let taskId = Number(e.target.id.replace("btnLinkedTask", ""));

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
