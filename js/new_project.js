let newProjectData = projectDataTemplate;

let currentMemberIndex = 0;

init();

function init() {
  document.getElementById("addNewProjectMemberSection").style.display = 'none';

  for (element of document.querySelectorAll('[id^="error"][id$="Div"]')) {
    element.style.display = 'none';
  }

  for (element of document.getElementsByClassName("back-link")) {
    element.onclick = () => {
      history.back();
    };
  }

  document.getElementById("showNewProjectMemberSection").onclick = () => {
    document.getElementById("addNewProjectMemberSection").style.display = 'block';
    document.getElementById("showNewProjectMemberSection").style.display = 'none';
    document.getElementById("noMembersLabel").style.display = 'none';
  }

  document.getElementById("addNewProjectMember").onclick = () => {
    document.getElementById("errorNewProjectMemberNameEmptyDiv").style.display = 'none';

    let newMemberFirstName = document.getElementById("newProjectMemberFirstName").value;
    let newMemberLastName = document.getElementById("newProjectMemberLastName").value;

    if (!newMemberFirstName) {
      document.getElementById("errorNewProjectMemberNameEmptyDiv").style.display = 'block';
      document.getElementById("errorNewProjectMemberNameEmpty").innerText = "Имя участника проекта должно быть непустым!";
      return;
    }

    if (!newMemberLastName) {
      document.getElementById("errorNewProjectMemberNameEmptyDiv").style.display = 'block';
      document.getElementById("errorNewProjectMemberNameEmpty").innerText = "Фамилия участника проекта должна быть непустой!"
      return;
    }

    newProjectData.members.push({
      id: currentMemberIndex++,
      name: newMemberFirstName + " " + newMemberLastName
    });

    displayNewProjectMembers();
  }

  document.getElementById("createProject").onclick = () => {
    document.getElementById("errorProjectParamsDiv").style.display = 'none';

    let projectName = document.getElementById("newProjectName").value;
    let projectDesc = document.getElementById("newProjectDescription").value;

    if (!projectName) {
      document.getElementById("errorProjectParamsDiv").style.display = 'block';
      document.getElementById("errorProjectParams").innerText = "Название проекта должно быть непустым!"
      return;
    }

    newProjectData.name = projectName;
    newProjectData.description = projectDesc;

    saveNewProject();
  }
}

function displayNewProjectMembers() {
  let newProjectMembersDiv = document.getElementById("newProjectMembersSection");
  newProjectMembersDiv.innerHTML = "";

  for (member of newProjectData.members) {
    let div = document.createElement("div");
    div.className = "newProjectMember";
    newProjectMembersDiv.appendChild(div);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = member.name;
    div.appendChild(nameSpan);

    let button = document.createElement("button");
    button.innerText = "Убрать";
    button.id = "btnRemove" + member.id;
    button.onclick = (e) => {
      let memberId = Number(e.target.id.replace("btnRemove", ""));

      const indexOfMember = newProjectData.members.findIndex(object => {
        return object.id === memberId;
      });

      newProjectData.members.splice(indexOfMember, 1);

      displayNewProjectMembers();
    };
    div.appendChild(button);
  }
}

function saveNewProject() {
  addProjectData(newProjectData);
  history.back();
}