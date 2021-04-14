const buttonMenu = document.querySelector(".button-menu");
const buttonSendMessage = document.querySelector(".box ion-icon");
const menu = document.querySelector(".menu");
const users = document.querySelectorAll("li");
const visibilitys = document.querySelectorAll(".lock");
const back = document.querySelector(".back");
let warning = document.querySelector(".warning");
let userOption = {firstTime: true, lastOption: undefined};
let visibilityOption = {firstTime: true, lastOption: undefined};

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
    let messages = document.querySelector("main ul");
    let message = document.querySelector("input");
    let messageView = 'public';
    const userName = userOption.lastOption.parentNode.querySelector("span").innerHTML;
    const isPublic = visibilityOption.lastOption.parentNode.classList.contains("public-visibility");
    if(!isPublic) {
        messageView = 'private';
    }
    if(message.value !== undefined) {
        messages.innerHTML +=  `<li class="${messageView}">
                                    <span class="time">(09:22:28)</span>  
                                    <span class="name">João</span> 
                                    para 
                                    <span class="name">${userName}:</span>  ${message.value}
                                </li>`;
    }
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

