const body = document.querySelector('body');
const button = body.querySelector('.button');
    const menu = body.querySelector('nav');

    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });