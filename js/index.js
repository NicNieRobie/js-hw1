init();

function init() {
  for (element of document.getElementsByClassName("back-link")) {
    element.onclick = () => {
      history.back();
    };
  }

  document.getElementById("downloadProjects").onclick = () => {
    downloadProjectData();
  }

  document.getElementById("uploadProjects").onclick = () => {
    uploadProjectData(loadProjects);
  }

  loadProjects();
}

function loadProjects() {
  let projects = getProjects();
  let projectContainer = document.getElementById("projectContainer");
  projectContainer.innerHTML = "";

  for (project of projects) {
    let projectDiv = document.createElement("div");
    projectDiv.className = "project";
    projectContainer.appendChild(projectDiv);

    let projectHeader = document.createElement("div");
    projectHeader.className = "project-header";
    projectDiv.appendChild(projectHeader);

    let projectName = document.createElement("button");
    projectName.className = "project-name";
    projectName.innerText = project.name;
    projectName.id = "btnProject" + project.id;
    projectName.onclick = (e) => {
      let projectId = Number(e.target.id.replace("btnProject", ""));
      setCurrentProjectId(projectId);
      window.location.href = "./html/project.html";
    };
    projectHeader.appendChild(projectName);

    let projectHeaderSidebar = document.createElement("div");
    projectHeaderSidebar.className = "project-header-sidebar";
    projectHeader.appendChild(projectHeaderSidebar);

    let projectMembers = document.createElement("span");
    projectMembers.innerText = `${project.members.length} участников`;
    projectHeaderSidebar.appendChild(projectMembers);

    let projectSettingsBtn = document.createElement("button");
    projectSettingsBtn.innerText = "Настройки";
    projectSettingsBtn.id = "btnSettings" + project.id;
    projectSettingsBtn.onclick = (e) => {
      let projectId = Number(e.target.id.replace("btnSettings", ""));
      setCurrentProjectId(projectId);
      window.location.href = "./html/project-settings.html";
    };
    projectHeaderSidebar.appendChild(projectSettingsBtn);

    let projectRemoveBtn = document.createElement("button");
    projectRemoveBtn.innerText = "Удалить";
    projectRemoveBtn.id = "btnRemove" + project.id;
    projectRemoveBtn.onclick = (e) => {
      if (confirm("Проект будет удалён. Продолжить?")) {
        let projectId = Number(e.target.id.replace("btnRemove", ""));
        removeProjectData(projectId);
        loadProjects();
      }
    };
    projectHeaderSidebar.appendChild(projectRemoveBtn);

    let projectDesc = document.createElement("span");
    projectDesc.className = "project-desc";
    projectDesc.textContent = project.description;
    projectDiv.appendChild(projectDesc);

    let projectBoardsContainer = document.createElement("div");
    projectBoardsContainer.className = "project-boards-container";
    projectDiv.appendChild(projectBoardsContainer);

    for (board of project.boards) {
      let projectBoard = document.createElement("div");
      projectBoard.id = "btnBoard" + board.id + "-" + project.id;
      projectBoard.onclick = (e) => {
        let idStr = e.target.closest('[id^="btnBoard"]').id.replace("btnBoard", "");

        let boardId = Number(idStr.split('-')[0]);
        let projId = Number(idStr.split('-')[1]);

        setCurrentProjectId(projId);
        setCurrentBoardId(boardId);
        window.location.href = "./html/board.html";
      }
      projectBoard.classList.add('project-board', 'interactive-panel');
      projectBoard.innerHTML = `<span class="board-name">${board.name}</span><span class="board-task-count">${board.tasks.length} задач(-а/и)</span>`;
      projectBoardsContainer.appendChild(projectBoard);
    }

    let createProjectBoard = document.createElement("div");
    createProjectBoard.id = "btnCreateBoard" + project.id;
    createProjectBoard.classList.add('project-board', 'interactive-panel');
    createProjectBoard.innerHTML = '<span class="board-name">Создать доску</span>';
    createProjectBoard.onclick = (e) => {
      let projectId = Number(e.target.closest('[id^="btnCreateBoard"]').id.replace("btnCreateBoard", ""));
      setCurrentProjectId(projectId);
      window.location.href = "./html/new-board.html";
    }
    projectBoardsContainer.appendChild(createProjectBoard);
  }
}