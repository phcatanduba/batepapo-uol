const buttonMenu = document.querySelector(".button-menu");
const menu = document.querySelector(".menu");
const users = document.querySelectorAll("li");
const visibility = document.querySelectorAll(".lock")

buttonMenu.addEventListener("click", function() {
    show(menu);
});

users.forEach(user => {
    let userCheck = user.children[1];
    user.addEventListener("click", function () {
        if(userCheck.classList.contains("on")) {
            dontShow(userCheck);
        } else {
            show(userCheck);
        };
    });
});

visibility.forEach(option => {
    let optionCheck = option.children[1];
    option.addEventListener("click", function () {
        if(optionCheck.classList.contains("on")) {
            dontShow(optionCheck);
        } else {
            show(optionCheck);
        };
    });
});

function show(element) {
    element.classList.add("on");
};

function dontShow(element) {
    element.classList.remove("on");
}