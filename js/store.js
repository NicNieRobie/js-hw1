let projectDataTemplate = {
  name: "",
  description: "",
  members: [],
  boards: []
};

let boardDataTemplate = {
  name: "",
  labels: [],
  status: [],
  tasks: []
};

let taskDataTemplate = {
  name: "",
  description: null,
  status: null,
  labels: [],
  executors: [],
  dueDate: null,
  links: []
};

function localRead(key) {
  return localStorage.getItem(key);
}

function localWrite(key, value) {
  localStorage.setItem(key, value);  
}

function addProjectData(projectData) {
  let projectDataArrayStr = localRead("projectData");
  let cumulativeProjectIndex = Number(localRead("cumulativeProjectIndex"));

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  projectDataArray.push({id: cumulativeProjectIndex++, ...projectData});

  localWrite("cumulativeProjectIndex", cumulativeProjectIndex);
  localWrite("projectData", JSON.stringify(projectDataArray));
}

function addBoardData(boardData) {
  let currentProjectId = localRead("currentProjectId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = 0;

  for (i = 0; i < projectDataArray.length; i++) {
    if (Number(projectDataArray[i].id) === currentProjectId) {
      targetProjIndex = i;
      break;
    }
  }

  let maxId = Math.max(...projectDataArray[targetProjIndex].boards.map(b => b.id));

  if (projectDataArray[targetProjIndex].boards.length === 0) {
    projectDataArray[targetProjIndex].boards.push({id: 0, ...boardData});
  } else {
    projectDataArray[targetProjIndex].boards.push({id: maxId + 1, ...boardData});
  }

  localWrite("projectData", JSON.stringify(projectDataArray));
}

function addTaskData(taskData) {
  let currentProjectId = localRead("currentProjectId");
  let currentBoardId = localRead("currentBoardId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = 0;

  for (i = 0; i < projectDataArray.length; i++) {
    if (Number(projectDataArray[i].id) === currentProjectId) {
      targetProjIndex = i;
      break;
    }
  }

  let targetBoardIndex = 0;

  for (i = 0; i < projectDataArray[targetProjIndex].boards.length; i++) {
    if (Number(projectDataArray[targetProjIndex].boards[i].id) === currentBoardId) {
      targetBoardIndex = i;
      break;
    }
  }

  let maxId = Math.max(...projectDataArray[targetProjIndex].boards[targetBoardIndex].tasks.map(t => t.id));

  if (projectDataArray[targetProjIndex].boards[targetBoardIndex].tasks.length === 0) {
    projectDataArray[targetProjIndex].boards[targetBoardIndex].tasks.push({id: 0, ...taskData});
  } else {
    projectDataArray[targetProjIndex].boards[targetBoardIndex].tasks.push({id: maxId + 1, ...taskData});
  }

  localWrite("projectData", JSON.stringify(projectDataArray));
}

function getProjects() {
  let projectDataArrayStr = localRead("projectData");

  return projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];
}

function getCurrentProject() {
  let currentProjectId = localRead("currentProjectId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return null;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  for (projectData of projectDataArray) {
    if (Number(projectData.id) === currentProjectId) {
      return projectData;
    }
  }

  return null;
}

function getCurrentBoard() {
  let currentProjectId = localRead("currentProjectId");
  let currentBoardId = localRead("currentBoardId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return null;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  if (currentBoardId === null) {
    return null;
  } else {
    currentBoardId = Number(currentBoardId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = projectDataArray.findIndex(object => {
    return object.id === currentProjectId;
  });

  const boardIndex = projectDataArray[targetProjIndex].boards.findIndex(object => {
    return object.id === currentBoardId;
  });

  return projectDataArray[targetProjIndex].boards[boardIndex];
}

function getCurrentTask() {
  let currentProjectId = localRead("currentProjectId");
  let currentBoardId = localRead("currentBoardId");
  let currentTaskId = localRead("currentTaskId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return null;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  if (currentBoardId === null) {
    return null;
  } else {
    currentBoardId = Number(currentBoardId);
  }

  if (currentTaskId === null) {
    return null;
  } else {
    currentTaskId = Number(currentTaskId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = projectDataArray.findIndex(object => {
    return object.id === currentProjectId;
  });

  const boardIndex = projectDataArray[targetProjIndex].boards.findIndex(object => {
    return object.id === currentBoardId;
  });

  const taskIndex = projectDataArray[targetProjIndex].boards[boardIndex].tasks.findIndex(object => {
    return object.id === currentTaskId;
  });


  return projectDataArray[targetProjIndex].boards[boardIndex].tasks[taskIndex];
}

function getTask(taskId) {
  let currentProjectId = localRead("currentProjectId");
  let currentBoardId = localRead("currentBoardId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return null;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  if (currentBoardId === null) {
    return null;
  } else {
    currentBoardId = Number(currentBoardId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = projectDataArray.findIndex(object => {
    return object.id === currentProjectId;
  });

  const boardIndex = projectDataArray[targetProjIndex].boards.findIndex(object => {
    return object.id === currentBoardId;
  });

  const taskIndex = projectDataArray[targetProjIndex].boards[boardIndex].tasks.findIndex(object => {
    return object.id === taskId;
  });

  return projectDataArray[targetProjIndex].boards[boardIndex].tasks[taskIndex];
}

function setCurrentProjectId(id) {
  console.log(id);

  if (isNaN(id)) {
    return;
  }

  localWrite("currentProjectId", id);
}

function setCurrentBoardId(id) {
  console.log(id);

  if (isNaN(id)) {
    return;
  }

  localWrite("currentBoardId", id);
}

function setCurrentTaskId(id) {
  console.log(id);

  if (isNaN(id)) {
    return;
  }

  localWrite("currentTaskId", id);
}

function saveCurrentProject(newProjectData) {
  let currentProjectId = localRead("currentProjectId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  for (i = 0; i < projectDataArray.length; i++) {
    if (Number(projectDataArray[i].id) === currentProjectId) {
      projectDataArray[i] = newProjectData;
    }
  }

  localWrite("projectData", JSON.stringify(projectDataArray));
}

function saveCurrentBoard(newBoardData) {
  let currentProjectId = localRead("currentProjectId");
  let currentBoardId = localRead("currentBoardId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return null;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  if (currentBoardId === null) {
    return null;
  } else {
    currentBoardId = Number(currentBoardId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = projectDataArray.findIndex(object => {
    return object.id === currentProjectId;
  });

  const boardIndex = projectDataArray[targetProjIndex].boards.findIndex(object => {
    return object.id === currentBoardId;
  });

  projectDataArray[targetProjIndex].boards[boardIndex] = newBoardData;

  localWrite("projectData", JSON.stringify(projectDataArray));
}

function saveCurrentTask(newTaskData) {
  let currentProjectId = localRead("currentProjectId");
  let currentBoardId = localRead("currentBoardId");
  let currentTaskId = localRead("currentTaskId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return null;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  if (currentBoardId === null) {
    return null;
  } else {
    currentBoardId = Number(currentBoardId);
  }

  if (currentTaskId === null) {
    return null;
  } else {
    currentTaskId = Number(currentTaskId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = projectDataArray.findIndex(object => {
    return object.id === currentProjectId;
  });

  const targetBoardIndex = projectDataArray[targetProjIndex].boards.findIndex(object => {
    return object.id === currentBoardId;
  });

  const taskIndex = projectDataArray[targetProjIndex].boards[targetBoardIndex].tasks.findIndex(object => {
    return object.id === currentTaskId;
  });

  projectDataArray[targetProjIndex].boards[targetBoardIndex].tasks[taskIndex] = newTaskData;

  localWrite("projectData", JSON.stringify(projectDataArray));
}

function removeProjectData(projectId) {
  if (isNaN(projectId)) {
    return;
  }

  let projectDataArrayStr = localRead("projectData");

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  const indexOfProject = projectDataArray.findIndex(object => {
    return object.id === Number(projectId);
  });

  projectDataArray.splice(indexOfProject, 1);

  localWrite("projectData", JSON.stringify(projectDataArray));
}

function removeBoardData(boardId) {
  if (isNaN(boardId)) {
    return;
  }

  let currentProjectId = localRead("currentProjectId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = projectDataArray.findIndex(object => {
    return object.id === currentProjectId;
  });

  const boardIndex = projectDataArray[targetProjIndex].boards.findIndex(object => {
    return object.id === Number(boardId);
  });

  projectDataArray[targetProjIndex].boards.splice(boardIndex, 1);

  localWrite("projectData", JSON.stringify(projectDataArray));
}

function removeTaskData(taskId) {
  if (isNaN(taskId)) {
    return;
  }

  let currentProjectId = localRead("currentProjectId");
  let currentBoardId = localRead("currentBoardId");
  let projectDataArrayStr = localRead("projectData");

  if (currentProjectId === null) {
    return;
  } else {
    currentProjectId = Number(currentProjectId);
  }

  if (currentBoardId === null) {
    return;
  } else {
    currentBoardId = Number(currentBoardId);
  }

  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let targetProjIndex = projectDataArray.findIndex(object => {
    return object.id === currentProjectId;
  });

  const targetBoardIndex = projectDataArray[targetProjIndex].boards.findIndex(object => {
    return object.id === currentBoardId;
  });

  const taskIndex = projectDataArray[targetProjIndex].boards[targetBoardIndex].tasks.findIndex(object => {
    return object.id === Number(taskId);
  });

  projectDataArray[targetProjIndex].boards[targetBoardIndex].tasks.splice(taskIndex, 1);

  localWrite("projectData", JSON.stringify(projectDataArray));
}

function downloadProjectData() {
  let projectDataArrayStr = localRead("projectData");
  let projectDataArray = projectDataArrayStr ? JSON.parse(projectDataArrayStr) : [];

  let jsonStr = JSON.stringify(projectDataArray);
  let file = new Blob([jsonStr], {type: 'application/json'});
  
  let url = URL.createObjectURL(file);

  let date = new Date();
  let suffix = getYMD(date) + "_" + getHMS(date);
  let fileName = "projectData_" + suffix + ".json";

  downloadFile(url, fileName);
}

function downloadFile(url, fileName) {
  let a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

function getYMD(date = (new Date()), sep = "_")
{
  let year, month, day, ymd;

  year = String(date.getFullYear());

  month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + String(month);

  day = date.getDate();
  day = (day < 10 ? "0" : "") + String(day);

  ymd = year + sep + month + sep + day;
  return ymd;
}

function getHMS(date = (new Date()), sep = "_")
{
  let hours, minutes, seconds, hms;

  hours = date.getHours();
  hours = (hours < 10 ? "0" : "") + String(date.getHours());

  minutes = date.getMinutes() + 1;
  minutes = (minutes < 10 ? "0" : "") + String(minutes);

  seconds = date.getSeconds();
  seconds = (seconds < 10 ? "0" : "") + String(seconds);

  hms = hours + sep + minutes + sep + seconds;
  return hms;
}

function uploadProjectData(callback = null) {
  let fileReader = new FileReader();

  let input = document.createElement("input");
  input.setAttribute("type", "file");

  input.addEventListener('change', (event) => {
    let files = event.target.files;

    let file = files[0];
    fileReader.readAsText(file);

    fileReader.addEventListener('load', () => {
      if (confirm("Загрузить данные из файла " + file.name + "?"))
      {  
        let str = fileReader.result;

        if (JSON.parse(str)) {
          localWrite("projectData", str);

          if (typeof callback === "function")
          {
            callback();
          }
        }
      }
    });
  });

  input.click();
}