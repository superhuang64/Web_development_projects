
var numberOfDrums = document.querySelectorAll(".drum").length;

//create makesound function--detect button presses---switch statement

function makeSound(content) {

    switch (content) {
        case "w":
            var crash = new Audio("sounds/crash.mp3");
            crash.play();
            break;
        case "a":
            var kickBass = new Audio("sounds/kick-bass.mp3");
            kickBass.play();
            break;
        case "s":
            var snare = new Audio("sounds/snare.mp3");
            snare.play();
            break;
        case "d":
            var tom1 = new Audio("sounds/tom-1.mp3");
            tom1.play();
            break;
        case "j":
            var tom2 = new Audio("sounds/tom-2.mp3");
            tom2.play();
            break;
        case "k":
            var tom3 = new Audio("sounds/tom-3.mp3");
            tom3.play();
            break;
        case "l":
            var tom4 = new Audio("sounds/tom-4.mp3");
            tom4.play();
            break;

        default: console.log("no action");
    }

}

function buttonAnimation(currentKey) {

    var activeButton = document.querySelector("." + currentKey);

    activeButton.classList.add("pressed");

    setTimeout(function () {
        activeButton.classList.remove("pressed");
    }, 100);

}


// click each button and then make sound
// for loop

for (var i = 0; i < numberOfDrums; i++) {

    document.querySelectorAll(".drum")[i].addEventListener("click", function () {

        this.classList.add("pressed");
        var drumHtml = this.innerHTML;

        makeSound(drumHtml);
        buttonAnimation(drumHtml);

    });

}

document.addEventListener("keypress", function (event) {

    makeSound(event.key);//console.log(event);
    buttonAnimation(event.key);

});





