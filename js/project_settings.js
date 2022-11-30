let currentProject = getCurrentProject();
let currentMemberIndex = 0;

init();

function init() {
  document.getElementById("topBackLink").style.display = 'none';
  document.getElementById("addProjectMemberSection").style.display = 'none';

  for (element of document.querySelectorAll('[id^="error"][id$="Div"]')) {
    element.style.display = 'none';
  }

  for (element of document.getElementsByClassName("back-link")) {
    element.onclick = () => {
      history.back();
    };
  }

  if (!currentProject) {
    document.getElementById("errorProjectLoadDiv").style.display = 'block';
    document.getElementById("topBackLink").style.display = 'block';
    document.getElementsByClassName("form-container")[0].style.display = 'none';
    return;
  }

  currentMemberIndex = currentProject.members.length;

  document.getElementById("projectSettingsDesc").textContent = `Настройки проекта ${currentProject.name}.`;

  document.getElementById("projectName").value = currentProject.name;
  document.getElementById("projectDescription").value = currentProject.description;

  if (currentProject.members.length > 0) {
    document.getElementById("noMembersLabel").style.display = 'none';
  }

  document.getElementById("showProjectMemberSection").onclick = () => {
    document.getElementById("addProjectMemberSection").style.display = 'block';
    document.getElementById("showProjectMemberSection").style.display = 'none';
    document.getElementById("noMembersLabel").style.display = 'none';
  }

  document.getElementById("addProjectMember").onclick = () => {
    document.getElementById("errorProjectMemberNameEmptyDiv").style.display = 'none';

    let newMemberFirstName = document.getElementById("projectMemberFirstName").value;
    let newMemberLastName = document.getElementById("projectMemberLastName").value;

    if (!newMemberFirstName) {
      document.getElementById("errorProjectMemberNameEmptyDiv").style.display = 'block';
      document.getElementById("errorProjectMemberNameEmpty").innerText = "Имя участника проекта должно быть непустым!";
      return;
    }

    if (!newMemberLastName) {
      document.getElementById("errorProjectMemberNameEmptyDiv").style.display = 'block';
      document.getElementById("errorProjectMemberNameEmpty").innerText = "Фамилия участника проекта должна быть непустой!"
      return;
    }

    currentProject.members.push({
      id: currentMemberIndex++,
      name: newMemberFirstName + " " + newMemberLastName
    });

    displayProjectMembers();
  }

  document.getElementById("saveProject").onclick = () => {
    document.getElementById("errorProjectParamsDiv").style.display = 'none';

    let projectName = document.getElementById("projectName").value;
    let projectDesc = document.getElementById("projectDescription").value;

    if (!projectName) {
      document.getElementById("errorProjectParamsDiv").style.display = 'block';
      document.getElementById("errorProjectParams").innerText = "Название проекта должно быть непустым!"
      return;
    }

    currentProject.name = projectName;
    currentProject.description = projectDesc;

    for (board of currentProject.boards) {
      for (task of board.tasks) {
        task.executors = task.executors.filter(executor => currentProject.members.filter(m => m.id === executor.id).length > 0);
      }
    }

    saveProject();
  }

  displayProjectMembers();
}

function displayProjectMembers() {
  let projectMembersDiv = document.getElementById("projectMembersSection");
  projectMembersDiv.innerHTML = "";

  for (member of currentProject.members) {
    let div = document.createElement("div");
    div.className = "projectMember";
    let nameSpan = document.createElement("span");
    nameSpan.textContent = member.name;
    div.appendChild(nameSpan);
    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnRemove" + member.id;
    button.onclick = (e) => {
      let memberId = Number(e.target.id.replace("btnRemove", ""));

      const indexOfMember = currentProject.members.findIndex(object => {
        return object.id === memberId;
      });

      currentProject.members.splice(indexOfMember, 1);

      if (currentProject.members.length === 0) {
        document.getElementById("noMembersLabel").style.display = 'block';
      }

      displayProjectMembers();
    };

    div.appendChild(button);
    projectMembersDiv.appendChild(div);
  }
}

function saveProject() {
  saveCurrentProject(currentProject);
  history.back();
}