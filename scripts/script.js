const buttonMenu = document.querySelector(".button-menu");
const buttonSendMessage = document.querySelector(".box ion-icon");
const menu = document.querySelector(".menu");
const users = document.querySelectorAll("li");
const visibilitys = document.querySelectorAll(".lock");
const back = document.querySelector(".back");
let warning = document.querySelector(".warning");
let userOption = {firstTime: true, lastOption: undefined};
let visibilityOption = {firstTime: true, lastOption: undefined};
let username = prompt("Qual seu nome?");

const sendUsername = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: username});
sendUsername.catch(newName);

setInterval(function(){
    sendUsername.then(getMessages)
}, 5000); 

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
    promise.then(loadMessages)
};

function loadMessages(response) {
    let messagesServer = response.data;
    let messages = document.querySelector("main ul");
    messages.innerHTML = ""

    for(let i = 0; i < messagesServer.length; i++) {
        if(messagesServer[i].type === "status") {
            messages.innerHTML += 
            `<li class="leave">
                <span class="time">${messagesServer[i].time}</span>  <span class="name">${messagesServer[i].from}</span> ${messagesServer[i].text}
            </li>`
        } else if(messagesServer[i].type === "message") {
            messages.innerHTML += 
            `<li class="public">
                <span class="time">${messagesServer[i].time}</span>  <span class="name">${messagesServer[i].from}
                </span> para <span class="name">${messagesServer[i].to}:</span>  ${messagesServer[i].text}
            </li>`
        } else {
            messages.innerHTML += 
            `<li class="private">
                <span class="time">${messagesServer[i].time}</span>  <span class="name">${messagesServer[i].from}
                </span> para <span class="name">${messagesServer[i].to}:</span>  ${messagesServer[i].text}
            </li>`
        };
    }
};


buttonMenu.addEventListener("click", function() {
    show(menu);
});

back.addEventListener("click", function(){
    dontShow(menu);
})

users.forEach(user => {
    let userCheck = user.children[1];
    user.addEventListener("click", function () {
        checkOption(userOption, userCheck);
    });
});

visibilitys.forEach(option => {
    let optionCheck = option.children[1];

    option.addEventListener("click", function () {
        checkOption(visibilityOption, optionCheck);
    });
});

buttonSendMessage.addEventListener("click", sendMessage);

function sendMessage() {
    let message = document.querySelector(".input input");
    let messageView = 'public';
    const messageTo = "Todos"
    const isPublic = false;
    if(!isPublic) {
        messageView = 'message';
    }
    
    let messageObject =         
    {
        from: "ph",
        to: "Todos",
        text: message.value,
        type: "message"
    };

    if(messageTo === undefined) {
        messageObject.to = "Todos";
    }

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", messageObject);
    promise.then(loadMessages);
}

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

