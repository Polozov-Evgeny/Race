"use strict";

//выбор персонажа
let player1 = document.querySelector('#player1'),
    player2 = document.querySelector('#player2'),
    imgPlayer1 = document.querySelector('#img_player1'),
    imgPlayer2 = document.querySelector('#img_player2');


//добавление события на мышку
player1.addEventListener('click', selectPlayer1);
player2.addEventListener('click', selectPlayer2);

function selectPlayer1() {
    localStorage.setItem('player', 'player1');
    imgPlayer1.setAttribute('id', 'img_select');
    imgPlayer2.setAttribute('id', 'img');
}

function selectPlayer2() {
    localStorage.setItem('player', 'player2');
    imgPlayer2.setAttribute('id', 'img_select');
    imgPlayer1.setAttribute('id', 'img');
}