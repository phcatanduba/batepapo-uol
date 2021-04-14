const buttonMenu = document.querySelector(".button-menu");
const menu = document.querySelector(".menu");
const users = document.querySelectorAll("li");
const visibilitys = document.querySelectorAll(".lock")
const back = document.querySelector(".back");
let userOption = {firstTime: true, lastOption: undefined};
let visibilityOption = {firstTime: true, lastOption: undefined};

buttonMenu.addEventListener("click", function() {
    show(menu);
});

back.addEventListener("click", function(){
    dontShow(menu);
    user.firstTime = true;
    visibility.firstTime = true;
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
}

function show(element) {
    element.classList.add("on");
};

function dontShow(element) {
    element.classList.remove("on");
}