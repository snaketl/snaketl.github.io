document.querySelector('.menu-open').onclick = function() {
    document.documentElement.classList.add('menu-active');
};

document.querySelector('.menu-close').onclick = function() {
    document.documentElement.classList.remove('menu-active');
};

document.documentElement.onclick = function(event) {
    if (event.target === document.documentElement) {
        document.documentElement.classList.remove('menu-active');
    }
};