const buttonMenu = document.querySelector(".button-menu");
const buttonSendMessage = document.querySelector(".box ion-icon");
const menu = document.querySelector(".menu");
const visibilitys = document.querySelectorAll(".lock");
const back = document.querySelector(".back");
const input = document.querySelector(".input input");
let warning = document.querySelector(".warning");
let userOption = {firstTime: true, lastOption: undefined};
let visibilityOption = {firstTime: true, lastOption: undefined};
let users = document.querySelectorAll(".contact li");

visibilityOption.lastOption = visibilitys[0].children[1];
userOption.lastOption       = users[0].children[1];

let enter = document.querySelector(".login button");

let username;
enter.addEventListener("click", function(){
    console.log("teste");
    username = document.querySelector(".login input").value;

    const sendUsername = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: username});
    sendUsername.then(getMessages);
    sendUsername.catch(newName);

    setInterval(function() {
        const getParticipants = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
        getParticipants.then(loadParticipants);
    }, 10000);
    
    setInterval(function() {
        const sendStatus = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", {name: username});
    }, 5000);

    setInterval(getMessages, 3000);

});

function newName(error) {
    if(error.response.status === 400) {
        alert("Digite outro nome");
    }
};

function getMessages() {
    let login = document.querySelector(".login .on");
    login.classList.add("off");
    let loading = document.querySelector(".loading");
    loading.classList.remove("off");
    promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promise.then(loadMessages);

};

function loadMessages(response) {
    let loginScreen = document.querySelector(".login");
    loginScreen.classList.add("off");

    let messages = document.querySelector("main ul");
    messages.innerHTML = "";
    let messagesServer = response.data;
    for(let i = 0; i < messagesServer.length; i++) {
        if(messagesServer[i].type === "status") {
            messages.innerHTML += 
            `<li class="leave">
                <span class="time">(${messagesServer[i].time})</span>  <span class="name">${messagesServer[i].from}</span> ${messagesServer[i].text}
            </li>`
        } else if(messagesServer[i].type === "message") {
            messages.innerHTML += 
            `<li class="public">
                <span class="time">(${messagesServer[i].time})</span>  <span class="name">${messagesServer[i].from}
                </span> para <span class="name">${messagesServer[i].to}:</span>  ${messagesServer[i].text}
            </li>`
        } else if(messagesServer[i].to === username){
            messages.innerHTML += 
            `<li class="private">
                <span class="time">(${messagesServer[i].time})</span>  <span class="name">${messagesServer[i].from}
                </span> para <span class="name">${messagesServer[i].to}:</span>  ${messagesServer[i].text}
            </li>`
        };
    }
    messages = document.querySelector("main ul");
    if(!menu.classList.contains("on")) {
        messages.children[messages.children.length - 1].scrollIntoView();
    }
};

function loadParticipants(response) {
    const usersOnline = response.data;
    const listUsersOnline = document.querySelector(".contact");
    listUsersOnline.innerHTML = 
    `
    <li>
        <div class="user">
            <ion-icon name="people"></ion-icon> <span>Todos</span>
        </div>
        <div class="check">
            <ion-icon name="checkmark-sharp"></ion-icon>
        </div>
    </li>`;

    for(let i = 0; i < usersOnline.length; i++) {
        listUsersOnline.innerHTML += 
        `
        <li>
            <div class="user">
                <ion-icon name="person-circle"></ion-icon> <span>${usersOnline[i].name}</span>
            </div>
            <div class="check">
                <ion-icon name="checkmark-sharp"></ion-icon>
            </div>
        </li>`
    };

    users = document.querySelectorAll(".contact li");
    users.forEach(user => {
        let userCheck = user.children[1];
        user.addEventListener("click", function () {
            checkOption(userOption, userCheck);
        });
    });

};


buttonMenu.addEventListener("click", function() {
    window.scroll(0, 0);
    show(menu);
});

back.addEventListener("click", function(){
    dontShow(menu);
});

visibilitys.forEach(option => {
    let optionCheck = option.children[1];

    option.addEventListener("click", function () {
        checkOption(visibilityOption, optionCheck);
    });
});

buttonSendMessage.addEventListener("click", sendMessage);
input.addEventListener("keypress", function(e){
    
    if(e.key === 'Enter')
        sendMessage();
});

function sendMessage() {
    const isPublic = visibilityOption.lastOption.parentNode.classList.contains("public-visibility");
    const messageTo = userOption.lastOption.parentNode.querySelector("span").innerHTML;

    let message = document.querySelector(".input input");
    let messageView = 'message';
    if(!isPublic || visibilityOption.lastOption === undefined) {
        messageView = 'private_message';
    }

    if(messageTo === undefined) {
        messageObject.to = "Todos";
    }
    
    let messageObject =         
    {
        from: username,
        to:   messageTo,
        text: message.value,
        type: messageView
    };

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", messageObject);
    promise.then(getMessages);
    promise.catch(reloadPage);
    message.value = "";
};

function reloadPage() {
    window.location.reload();
};

function whoWillReceiveTheMessage() {
    const isPublic = visibilityOption.lastOption.parentNode.classList.contains("public-visibility");
    const userName = userOption.lastOption.parentNode.querySelector("span").innerHTML;
    if(isPublic === true) {
        warning.innerHTML = `Enviando para ${userName} (publicamente)`;
    }   else {
        warning.innerHTML = `Enviando para ${userName} (privadamente)`;
    }
};

function checkOption(optionType, option) {
    if(optionType.firstTime === true) {
        show(option);
        optionType.lastOption = option;
        optionType.firstTime = false;
    } else if(option.classList.contains("on")) {
        return;
    } else {
        show(option);
        dontShow(optionType.lastOption);
        optionType.lastOption = option;
    };
    if(!userOption.firstTime && !visibilityOption.firstTime) {
        whoWillReceiveTheMessage();
    }
};

function show(element) {
    element.classList.add("on");
};

function dontShow(element) {
    element.classList.remove("on");
};

