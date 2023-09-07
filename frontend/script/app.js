let flag = true;
let toggleButton = true;
let getId;
let modal = document.getElementById('myModal');

document.getElementById("cancel").onclick = function (event) {
  modal.style.display = "none";
  document.getElementById("cross").innerHTML = `<i class="plus fa-solid fa-plus" style="color:white" onclick="visibility()"></i>`;
}

async function getAllNotes() {
  const response = await fetch("http://localhost:3000/notes/get", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((res) => res.json());
  console.log(response);
  for (let i = 0; i < response.data.length; i++) {
    cards(response.data[i].title, response.data[i].content, response.data[i]._id);
  }
}
getAllNotes();

function visibility() {
  if (flag) {
    document.getElementById("form").innerHTML = `
    <div id="section2" class="col-10 col-md-3 d-flex flex-column p-3 gap-3 mt-5">
      <textarea type="text" id="title" placeholder="Enter Title"></textarea>
      <textarea id="content" placeholder="Enter Content"></textarea>
      <button id="create" class="btn text-white" onclick="create()">CREATE</button>
      <div id="message" class="text-white py-5 fs-4"></div>
    </div>`;
    document.getElementById("cross").innerHTML = `<i class="plus fa-solid fa-xmark" style="color: #ffffff;" onclick="visibility()"></i>`;
    flag = false;
  } else {
    document.getElementById("form").innerHTML = ``;
    document.getElementById("cross").innerHTML = `<i class="plus fa-solid fa-plus" style="color:white" onclick="visibility()"></i>`;
    flag = true;
  }
}

async function fetching(route, method, id, title, content) {
  await fetch(`http://localhost:3000/notes/${route}`, {
    method: `${method}`,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      id: id,
      title: title,
      content: content,
    }),
  }).then((response) => response.json());
}

function cards(title, content, id) {
  document.getElementById("log").innerHTML +=
    `<div id="logs" class="card card-body text-white rounded-3 p-3 my-1">
      <div class="d-flex justify-content-between">
        <div id="subTitle" class="card-title fs-3">${title}</div>
        <div>
          <button id="del" class="del buttonSvg btn p-0" onclick="deleteCard('${id}')"><i class="fa-solid fa-trash"></i></button>
          <button id="edit" class="buttonSvg btn p-0" onclick="edit('${id}')"><i class="fa-solid fa-pen"></i></button>
        </div>
      </div>
      <div id="subContent" class="card-text">${content}</div>
      <div id="ID" class="d-none">${id}</div>
  </div>`;
  let eventCard = document.querySelectorAll('#logs');
  let eventDel = document.querySelectorAll('#del');
  let eventEdit = document.querySelectorAll('#edit');
  if(toggleButton === false) {
    eventCard.forEach((item)=>{
      item.classList.add('darkCard');
    })
    eventDel.forEach((item)=>{
      item.classList.add('darkDelBtn');
    })
    eventEdit.forEach((item)=>{
      item.classList.add('darkEditBtn');
    })
  }
}

function create() {
  let title = document.getElementById("title").value;
  let content = document.getElementById("content").value;
  if (title === "" || content === "") {
    alert("Fill both the inputs");
  } else {
    cards(title, content, "1");
    fetching("create", "POST", "", title, content);
    document.getElementById("message").innerHTML = "*Successfully Created";
    setTimeout(() => {
      if (flag === false) {
        document.getElementById("form").innerHTML = ``;
        flag = true;
        document.getElementById(
          "cross"
        ).innerHTML = `<i class="plus fa-solid fa-plus" style="color:white" onclick="visibility()"></i>`;
        document.getElementById("log").innerHTML = '';
      }
      getAllNotes();
    }, 1000);
  }
}

function deleteCard(id) {
  getId = id;
  modal.style.display = "block";
  document.getElementById('close').onclick = () => {
    fetch(`http://localhost:3000/notes/delete/${getId}`, {
      method: `DELETE`,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => response.json());
    document.getElementById("deleteMsg").innerHTML = `*Successfully Deleted`;
    setTimeout(() => {
      modal.style.display = "none";
      document.getElementById("deleteMsg").innerHTML = ``;
      document.getElementById(
        "cross"
      ).innerHTML = `<i class="plus fa-solid fa-plus" style="color:white" onclick="visibility()"></i>`;
      document.getElementById("log").innerHTML = '';
      getAllNotes();
    }, 1000);
  }
}

async function edit(id) {
  getId = id;
  const response = await fetch(`http://localhost:3000/notes/singleNote/${getId}`, {
    method: `GET`,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((res) => res.json());
  title = response.note.title;
  content = response.note.content;
  id = response.note._id;
  if (flag) {
    document.getElementById("form").innerHTML = `
    <div id="section2" class="col-10 col-md-3 d-flex flex-column p-3 gap-3 mt-5">
      <textarea type="text" id="title" placeholder="Enter Title">${title}</textarea>
      <textarea id="content" placeholder="Enter Content">${content}</textarea>
      <button id="edit2" class="btn text-white" onclick="update('${id}')">UPDATE</button>
      <div id="message" class="text-white py-5 fs-4"></div>
    </div>`;
    document.getElementById(
      "cross"
    ).innerHTML = `<i class="plus fa-solid fa-xmark" style="color: #ffffff;" onclick="visibility()"></i>`;
    flag = false;
  } else {
    document.getElementById("form").innerHTML = ``;
    flag = true;
  }
}

function update(id) {
  let editTitle = document.getElementById("title").value;
  let editContent = document.getElementById("content").value;
  if (editTitle === "" || editContent === "") {
    alert("Fill both the inputs");
  } else {
    fetching("update", "PUT", id, editTitle, editContent);
    if (flag === false) {
      setTimeout(() => {
        document.getElementById("form").innerHTML = ``;
        flag = true;
        document.getElementById(
          "cross"
        ).innerHTML = `<i class="plus fa-solid fa-plus" style="color:white" onclick="visibility()"></i>`;
        document.getElementById("log").innerHTML = '';
        getAllNotes();
      }, 1000);
    }
    document.getElementById("message").innerHTML = "*Successfully Updated";
  }
}

document.getElementById("dark").addEventListener('click', () => {
  theme();
});
function theme() {
  if (toggleButton) {
    darkMode();
    toggleButton = false;
  } else {
    lightMode();
    toggleButton = true;
  }
}

function darkMode() {
  document.querySelector('.back').style.backgroundColor = "#1f2421";
  document.querySelectorAll('.card').forEach((item) => {
    item.style.backgroundColor = "#49a078";
  });
  document.querySelectorAll('#del').forEach((item) => {
    item.style.backgroundColor = "#9cc5a1";
  });
  document.querySelectorAll('#edit').forEach((item) => {
    item.style.backgroundColor = "#dce1de";
  });
  document.querySelector("#dark").innerHTML = `<i class="dark fa-solid fa-sun" style="color:white"></i>`;
}
function lightMode() {
  document.querySelector('.back').style.backgroundColor = "#006d77";
  document.querySelectorAll('.card').forEach((item) => {
    item.style.backgroundColor = "#e29578";
  });
  document.querySelectorAll('#del').forEach((item) => {
    item.style.backgroundColor = "#ffddd2";
  });
  document.querySelectorAll('#edit').forEach((item) => {
    item.style.backgroundColor = "#edf6f9";
  });
  document.querySelector("#dark").innerHTML = `<i class="dark fa-solid fa-moon" style="color:white"></i>`;
}