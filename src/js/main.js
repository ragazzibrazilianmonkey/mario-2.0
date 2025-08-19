const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');

const startScreen = document.querySelector('.start');
const gameOverScreen = document.querySelector('.game-over');
const deathCounter = document.querySelector('.death-counter');
const restartButton = document.querySelector('.restart-button');
const startButton = document.querySelector('.button-start');
const distanceCounter = document.querySelector('.distance-counter');

let deaths = 0;
let loopInterval;

let distance = 0;
let maxDistance = localStorage.getItem('maxDistance') ? parseInt(localStorage.getItem('maxDistance')) : 0;
let distanceInterval;

const audioStart = new Audio('./src/audio/audio_theme.mp3');
const audioGameOver = new Audio('./src/audio/audio_gameover.mp3');

const updateDistance = () => {
    distance += 1;
    distanceCounter.textContent = `Distância: ${distance}m | Máxima: ${maxDistance}m`;
};

const startGame = () => {
    pipe.classList.add('pipe-animation');
    startScreen.style.display = 'none'; // Esconde a tela de início

    audioStart.play();
    loopInterval = setInterval(loop, 10);
    
    distance = 0;
    distanceInterval = setInterval(updateDistance, 100);
};

const restartGame = () => {
    gameOverScreen.style.display = 'none'; // Esconde a tela de game over
    startScreen.style.display = 'flex'; // Mostra a tela de início novamente
    
    // Reseta a posição do cano
    pipe.style.left = '';
    pipe.style.right = '0';
    pipe.classList.remove('pipe-animation');
    
    // Reseta o Mario
    mario.src = './src/img/mario.gif';
    mario.style.width = '150px';
    mario.style.bottom = '0';
    mario.style.marginLeft = '0px';

    audioGameOver.pause();
    audioGameOver.currentTime = 0;

    audioStart.pause();
    audioStart.currentTime = 0;

    distance = 0;
    distanceCounter.textContent = `Distância: ${distance}m | Máxima: ${maxDistance}m`;
};

const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 800);
};

const loop = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = parseFloat(window.getComputedStyle(mario).bottom);

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        clearInterval(loopInterval);
        clearInterval(distanceInterval); // Para de contar a distância
        
        pipe.classList.remove('pipe-animation');
        pipe.style.left = `${pipePosition}px`;

        mario.classList.remove('jump');
        mario.style.bottom = `${marioPosition}px`;
        mario.src = './src/img/game-over.png';
        mario.style.width = '80px';
        mario.style.marginLeft = '50px';
        
        audioStart.pause();
        audioGameOver.play();
        
        gameOverScreen.style.display = 'flex';
        
        deaths++;
        deathCounter.textContent = `Mortes: ${deaths}`;
        
        // Verifica e salva a distância máxima
        if (distance > maxDistance) {
            maxDistance = distance;
            localStorage.setItem('maxDistance', maxDistance);
        }
        distanceCounter.textContent = `Distância: ${distance}m | Máxima: ${maxDistance}m`;
    }
};

document.addEventListener('keypress', e => {
    if (e.key === ' ') {
        jump();
    }
});

document.addEventListener('touchstart', e => {
    if (e.touches.length) {
        jump();
    }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Atualiza a distância máxima inicial ao carregar a página
distanceCounter.textContent = `Distância: ${distance}m | Máxima: ${maxDistance}m`;
