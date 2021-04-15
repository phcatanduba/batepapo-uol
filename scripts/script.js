const buttonMenu = document.querySelector(".button-menu");
const buttonSendMessage = document.querySelector(".box ion-icon");
const menu = document.querySelector(".menu");
const visibilitys = document.querySelectorAll(".lock");
const back = document.querySelector(".back");
let warning = document.querySelector(".warning");
let userOption = {firstTime: true, lastOption: undefined};
let visibilityOption = {firstTime: true, lastOption: undefined};
let users = document.querySelectorAll(".contact li");
let username = prompt("Qual seu nome?");

visibilityOption.lastOption = visibilitys[0].children[1];
userOption.lastOption       = users[0].children[1];

const sendUsername = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: username});
sendUsername.then(getMessages);
sendUsername.catch(newName);

setInterval(function(){
    getMessages();
}, 3000); 

setInterval(function() {
    const getParticipants = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    getParticipants.then(loadParticipants);
}, 10000);

setInterval(function() {
    const sendStatus = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", {name: username});
}, 5000);

function newName(error) {
    if(error.response.status === 400) {
        username = prompt("Digite outro nome");
    }
};

function getMessages() {
    promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promise.then(loadMessages);
};

function loadMessages(response) {
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
        } else {
            messages.innerHTML += 
            `<li class="private">
                <span class="time">(${messagesServer[i].time})</span>  <span class="name">${messagesServer[i].from}
                </span> para <span class="name">${messagesServer[i].to}:</span>  ${messagesServer[i].text}
            </li>`
        };
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

}


buttonMenu.addEventListener("click", function() {
    show(menu);
});

back.addEventListener("click", function(){
    dontShow(menu);
})

visibilitys.forEach(option => {
    let optionCheck = option.children[1];

    option.addEventListener("click", function () {
        checkOption(visibilityOption, optionCheck);
    });
});

buttonSendMessage.addEventListener("click", sendMessage);

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
}

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
}

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
}

function show(element) {
    element.classList.add("on");
};

function dontShow(element) {
    element.classList.remove("on");
}

