document.addEventListener('DOMContentLoaded', function () {
    var loaderText = document.getElementById("loader-text");
});

window.addEventListener('load', function () {
    var loader = document.getElementById("loader");
    var dots = "";
    var intervalId = setInterval(function () {
        var loaderText = document.getElementById("loader-text");
        dots += ".";
        loaderText.innerHTML = "Loading" + dots;
    }, 50);
    setTimeout(function () {
        loader.classList.add("fade-out");
        loader.addEventListener('animationend', function () {
            loader.style.display = "none";
            clearInterval(intervalId);
        });
    }, 0);
});