import { sfx } from "./sfx.js"
// DOM element assignment
const viewScore = document.getElementById('score')
const viewGame = document.getElementById('game')
const viewMessage = document.getElementById('message')
// cup image
let cup = new Image(44, 40)
cup.src = './assets/img/cup.png'
// original start map 
const initMap = () => {
    return [
        9, 9, 9,
        9, 9, 9,
        9, 9, 9
    ]
}
// map init game
let map = initMap()
// win combination 
const winComb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
// assets obj
const assets = {
    selectID: 1, // current player
    score: {
        O: 0,
        X: 0,
        rounds: 3,
        game: {
            O: 0,
            X: 0
        }
    },
    circle: {
        id: 0,
    },
    cross: {
        id: 1,
    },
    empty: {
        id: 9
    },
    makeCircle() {
        const makeCircle = document.createElement('div')
        makeCircle.classList.add('circle')
        viewGame.appendChild(makeCircle)
    },
    makeCross() {
        const makeCross = document.createElement('div')
        makeCross.classList.add('cross')
        viewGame.appendChild(makeCross)
    },
    makeEmpty() {
        const makeEmpty = document.createElement('div')
        makeEmpty.classList.add('empty')
        viewGame.appendChild(makeEmpty)
    },
    makeScore() {
        viewScore.textContent = ''
        const scoreCross = document.createElement('div')
        scoreCross.classList.add('scoreCross')
        scoreCross.textContent = `X:${assets.score.X}-${assets.score.game.X}`
        viewScore.appendChild(scoreCross)
        const scoreCircle = document.createElement('div')
        scoreCircle.classList.add('scoreCircle')
        scoreCircle.textContent = `O:${assets.score.O}-${assets.score.game.O}`
        viewScore.appendChild(scoreCircle)
    },
}

let count = 0
let player = null
// map draw
const mapDraw = () => {
    viewGame.textContent = ''
    map.forEach(v => {
        if (v === assets.circle.id) assets.makeCircle()
        if (v === assets.cross.id) assets.makeCross()
        if (v === assets.empty.id) assets.makeEmpty()
    })
}
// click handler
const clickHandler = () => {
    viewGame.addEventListener('click', ({ target }) => {
        viewMessage.classList.remove('winner')
        const idxGrid = Array.from(target.parentNode.children).indexOf(target);
        if (map[idxGrid] === assets.empty.id) {
            if (assets.circle.id === assets.selectID) {
                map[idxGrid] = assets.selectID
                assets.selectID = assets.cross.id
            } else if (assets.cross.id === assets.selectID) {
                map[idxGrid] = assets.selectID
                assets.selectID = assets.circle.id
            }
            mapDraw()
            checkWin()
            checkDraw()
            player = assets.selectID
            sfx.click().play()
        } else {
            sfx.clickError().play()
        }
    })
}
// check draw match
function checkDraw() {
    const drawMatch = map.filter(v => v === 9).length
    if (drawMatch === 0) {
        restart()
        viewMessage.textContent = 'draw match'
    }
}
// check win match
let winner = null
function checkWin() {
    viewMessage.textContent = ''
    winComb.forEach(arr => {
        count = 0
        arr.forEach(v => {
            if (map[v] === player)
                count++
            if (count === 3) {
                player ? winner = 'X' : winner = 'O'
                viewMessage.textContent = 'round ' + winner
                assets.score[winner]++
                assets.makeScore()
                restart()
                sfx.win().play()
                return
            }
        })
    })
    // check game win
    if ((assets.score.O === assets.score.rounds) || (assets.score.X === assets.score.rounds)) {
        viewMessage.classList.add('winner')
        viewMessage.textContent = winner + ' win game'
        assets.score.O = 0
        assets.score.X = 0
        assets.score.game[winner]++
        assets.makeScore()
        viewMessage.appendChild(cup)
        sfx.win().play()
    }
}
// restart match
function restart() {
    map = initMap()
    mapDraw()
}
// init game
(function init() {
    assets.makeScore()
    clickHandler()
    mapDraw()
})()