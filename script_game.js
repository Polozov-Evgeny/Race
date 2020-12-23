"use strict";

//создание пеменных
let life = document.querySelector('#life'),
    score = document.querySelector('#score'),
    time = document.querySelector('#time'),
    level = document.querySelector('#level'),
    player = document.createElement('div');

const MUSFON = new Audio ('sound/music.mp3'),
    SOUNDBONUS = new Audio ('sound/bonus.mp3'),
    SOUNDCRUSH = new Audio ('sound/crush.mp3'),
    SOUNDGAS = new Audio ('sound/gas.mp3'),
    SOUNDBRAKE = new Audio ('sound/brake.mp3'),
    SOUNDWINGAME = new Audio ('sound/winGame.mp3'),
    SOUNDGAMEOVER = new Audio ('sound/gameOver.mp3');


//добавление события на клавиши
document.addEventListener('keydown', playerRun);

const KEY = {
    arrowLeft: 37,
    arrowUp: 38,
    arrowRight: 39,
    arrowDown: 40,
    space: 32,  //включить музыку
    keyB: 66 ,  //выключить музыку
};

//глобальные параметры игры
let setting = {
    levelSet: 1,   //стартовый уровень
    lifeSet: 3,   //стартовые жизни
    scoreSet: 0,   //стартовые очки
    // scoreWin: 100,    //победные очки
    timeSet: 99,   //стартовое время
    timeWin: 99,   //победное время
    speedPlayerSet: 15,   //скорость перемещения игрока
    trafficBonusSet: 10,   //скорость перемещения бонусов
    timeBonusSet: 20,   //время перемещения бонусов (1 шаг)
    trafficEnemySet: 8,   //скорость перемещения оппонентов
    timeEnemySet: 20,   //время перемещения оппонентов (1 шаг)
    timeObjectSet: 2000,   //интервал появления бонусов и оппонентов
    trafficRoadSet: 10,   //скорость перемещения дорожной разметки
    timeRoadSet: 20,   //интервал перемещения дорожной разметки (1 шаг)
    createRoadSet: 500,   //интервал создания 1 линии разметки (1 шаг)
    bonusStone: 20,   //очки за камень
    bonusBarrel: 10,   //очки за бочку
    bonusCone: -5,   //вычет за конус
    bonusEnemy: -50,   //вычет за оппонента
    randomSet: function (min, max) {
        let randomValue = min + Math.random () * (max-min);
        return Math.floor(randomValue);
    },
};


//управление с клавиатуры с ограничениями по зоне действия
function playerRun (event) {
    if ((event.keyCode === KEY.arrowLeft) && (player.offsetLeft > 0)) {
        player.style.left = player.offsetLeft - setting.speedPlayerSet + "px";
        SOUNDBRAKE.play();
        SOUNDBRAKE.volume = 0.05;
    }
    if ((event.keyCode === KEY.arrowUp) && (player.offsetTop > 0)) {
        player.style.top = player.offsetTop - setting.speedPlayerSet + "px";
    }
    if ((event.keyCode === KEY.arrowRight) && (player.offsetLeft < document.body.offsetWidth - player.offsetWidth)) {
        player.style.left = player.offsetLeft + setting.speedPlayerSet + "px";
        SOUNDGAS.play();
        SOUNDGAS.volume = 0.05;
    }
    if ((event.keyCode === KEY.arrowDown) && (player.offsetTop < document.body.offsetHeight - player.offsetHeight)) {
        player.style.top = player.offsetTop + setting.speedPlayerSet + "px";
    }
    if (event.keyCode === KEY.space) {
        MUSFON.play();
        MUSFON.volume = 0.1;
    }
    if (event.keyCode === KEY.keyB) {
        MUSFON.pause();
    }
}


//главная функция
function masterGame() {
    playerSelect ();
    objectRun();
    moveRoad();
    startTimer();
    level.textContent = 'LEVEL: ' + setting.levelSet;
    life.textContent = 'LIFE: ' + setting.lifeSet;
    score.textContent = 'SCORE: ' + setting.scoreSet;
    time.textContent = 'TIME: ' + setting.timeSet;
}
masterGame();


//выбор игрока
function playerSelect (){
    if (localStorage.getItem('player') == 'player1'){
        player.classList.add('player_select1');
        document.body.appendChild(player);
    }
    if (localStorage.getItem('player') == 'player2'){
        player.classList.add('player_select2');
        document.body.appendChild(player);
    } else {
        player.classList.add('player_select1');
        document.body.appendChild(player);
    }
}

//таймер с проверками и уровни
function startTimer() {
    let timeID = setInterval(function() {
        setting.timeSet--;
        time.textContent = 'TIME: ' + setting.timeSet;
        if (setting.lifeSet === 0 && setting.timeSet !== 0) {
            SOUNDGAMEOVER.play();
            SOUNDGAMEOVER.volume = 0.2;
            clearInterval(timeID);
            gameOver.classEndGo();
        }
        if (setting.timeSet === 0 && setting.lifeSet !== 0) {
            SOUNDWINGAME.play();
            SOUNDWINGAME.volume = 0.2;
            clearInterval(timeID);
            winGame.classEndGo();
        }
        if (setting.timeSet === 0 && setting.lifeSet === 0) {
            SOUNDGAMEOVER.play();
            SOUNDGAMEOVER.volume = 0.2;
            clearInterval(timeID);
            gameOver.classEndGo();
        }


        function levelUp() {
                if (setting.timeSet % 20 == 0){
                    setting.levelSet++;
                    level.textContent = 'LEVEL: ' + setting.levelSet;
                    setting.speedPlayerSet += 2;   //скорость перемещения игрока
                    setting.trafficBonusSet += 1;   //скорость перемещения бонусов
                    setting.trafficEnemySet += 0.5;   //скорость перемещения оппонентов
                    setting.timeObjectSet += 100;   //интервал появления бонусов и оппонентов
                    setting.trafficRoadSet += 1;   //скорость перемещения дорожной разметки
            }
        }
        levelUp();
    }, 1000);
}


//случайное создание объектов
function objectRun() {    
    let arrayObjectFunc = ["stone.classBonusRun", "barrel.classBonusRun", "cone.classBonusRun", "enemy1.classEnemyRun", "enemy2.classEnemyRun"];
    let objectGo = setInterval(function() {
        let valObjectFunc = Math.floor(Math.random() * arrayObjectFunc.length);
        function randObjectFunc() {
            switch (valObjectFunc) {
                case 0:
                    stone.classBonusRun(setting.bonusStone);
                    break;
                case 1:
                    barrel.classBonusRun(setting.bonusBarrel);
                    break;
                case 2:
                    cone.classBonusRun(setting.bonusCone);
                    break;
                case 3:
                    enemy1.classEnemyRun(setting.bonusEnemy);
                    break;
                case 4:
                    enemy2.classEnemyRun(setting.bonusEnemy);
                    break;
                default:
                    stone.objectBonusRun(setting.bonusStone);
                    break;
            }
        }
        randObjectFunc();
        if (setting.lifeSet === 0 || setting.timeSet === 0) {
            clearInterval(objectGo);
        }
    }, setting.timeObjectSet);
}


//создание эффекта движения
function moveRoad() {
    let goRoad = setInterval (function() {
        let line = document.createElement('div');
        line.classList.add('line');
        document.body.appendChild(line);
        let goLine = setInterval (function() {
            line.style.left = line.offsetLeft - setting.trafficRoadSet + 'px';
            if (line.offsetLeft <= -line.offsetWidth) {
                line.innerHTML = "";
                line.remove();
                clearInterval(goLine);
            }
            if (setting.lifeSet === 0 || setting.timeSet === 0) {
                line.remove();
                clearInterval(goRoad);
            }
        }, setting.timeRoadSet);
    }, setting.createRoadSet);
}


//создание бонусов
class classBonus {
    constructor(name) {
        this.bonusName = name;
    }
    classBonusRun(val) {
        let bonus = document.createElement('div');
        bonus.setAttribute('id', this.bonusName);
        document.body.appendChild(bonus);
        let playerRect, bonusRect;
        bonus.style.top = setting.randomSet(0, document.body.offsetHeight - bonus.offsetHeight) + "px";
        
        let intervalBonus = setInterval (function() {
            bonus.style.left = bonus.offsetLeft - setting.trafficBonusSet + "px";
            if (bonus.offsetLeft + bonus.offsetWidth < 0) {
                bonus.remove();
                clearInterval(intervalBonus);
            }
            if (setting.lifeSet === 0 || setting.timeSet === 0) {
                bonus.remove();
            }
            playerRect = player.getBoundingClientRect();
            bonusRect = bonus.getBoundingClientRect();
            if (playerRect.top <= bonusRect.bottom && playerRect.right >= bonusRect.left && playerRect.left <= bonusRect.right && playerRect.bottom >= bonusRect.top){
                setting.scoreSet += val;
                score.textContent = 'SCORE: ' + setting.scoreSet;
                score.setAttribute('id', 'score_scale');
                let scoreID = function() {
                    score.setAttribute('id', 'score');
                };
                setTimeout(scoreID, 1000);
                clearTimeout(scoreID);
                SOUNDBONUS.play();
                SOUNDBONUS.volume = 0.1;
                bonus.remove();
                clearInterval(intervalBonus);
            }
        }, setting.timeBonusSet);
    }
}

let stone = new classBonus ('stone'),
    barrel = new classBonus ('barrel'),
    cone = new classBonus ('cone');


//создание оппонентов
class classEnemy {
    constructor(name) {
        this.enemyName = name;
    }
    classEnemyRun(val) {
        let enemy = document.createElement('div');
        enemy.setAttribute('id', this.enemyName);
        document.body.appendChild(enemy);
        let playerRect, enemyRect;
        enemy.style.top = setting.randomSet(0, document.body.offsetHeight - enemy.offsetHeight) + "px";
        
        let intervalEnemy = setInterval (function() {
            enemy.style.left = enemy.offsetLeft - setting.trafficEnemySet + "px";
            if (enemy.offsetLeft + enemy.offsetWidth < 0) {
                enemy.remove();
                clearInterval(intervalEnemy);
            }
            if (setting.lifeSet === 0 || setting.timeSet === 0) {
                enemy.remove();
            }
            playerRect = player.getBoundingClientRect();
            enemyRect = enemy.getBoundingClientRect();
            if (playerRect.top <= enemyRect.bottom && playerRect.right >= enemyRect.left && playerRect.left <= enemyRect.right && playerRect.bottom >= enemyRect.top){
                setting.scoreSet += val;
                score.textContent = 'SCORE: ' + setting.scoreSet;
                score.setAttribute('id', 'score_scale');
                let scoreID = function() {
                    score.setAttribute('id', 'score');
                };
                setTimeout(scoreID, 1000);
                clearTimeout(scoreID);

                setting.lifeSet --;
                life.textContent = 'LIFE: ' + setting.lifeSet;
                life.setAttribute('id', 'life_scale');
                let lifeID = function() {
                    life.setAttribute('id', 'life');
                };
                setTimeout(lifeID, 1000);
                clearTimeout(lifeID);
                
                enemy.setAttribute('id', 'enemy_fire');
                SOUNDCRUSH.play();
                SOUNDCRUSH.volume = 0.1;
                let fireTime = function() {
                    enemy.remove();
                };
                setTimeout (fireTime, 1000);
                clearInterval(intervalEnemy);
            }
        }, setting.timeEnemySet);
    }
}

let enemy1 = new classEnemy ('enemy1'),
    enemy2 = new classEnemy ('enemy2');


//создание окончания игры
class classEnd {
    constructor(name) {
        this.endName = name;
    }
    classEndGo() {
        let endGoName = document.createElement('p1');
        document.body.appendChild(endGoName);
        endGoName.textContent = this.endName;

        let endGoResult = document.createElement('p2');
        document.body.appendChild(endGoResult);
        endGoResult.textContent = `Your result! SCORE: ${setting.scoreSet} / TIME: ${setting.timeWin - setting.timeSet}`;

        let endGoRestart = document.createElement('button');
        endGoRestart.setAttribute('id', 'btnRestart');
        document.body.appendChild(endGoRestart);
        endGoRestart.textContent = "Restart game";
        endGoRestart.addEventListener('click', this.restartGame);
        player.remove();
        level.remove();
        life.remove();
        score.remove();
        time.remove();
    }
    restartGame(){
        location.reload();
    }
}

let winGame = new classEnd ('You are a winner!'),
    gameOver = new classEnd ('You lost the game!');