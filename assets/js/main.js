import { sfx } from "./sfx.js"
// DOM element assignment
const viewScore = document.getElementById('score')
const viewGame = document.getElementById('game')
const viewMessage = document.getElementById('message')
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
        circle: 0,
        cross: 0,
        rounds: 3, // next features
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
        scoreCross.textContent = `X:${assets.score.cross}`
        viewScore.appendChild(scoreCross)
        const scoreCircle = document.createElement('div')
        scoreCircle.classList.add('scoreCircle')
        scoreCircle.textContent = `O:${assets.score.circle}`
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
        const idxGrid = Array.from(target.parentNode.children).indexOf(target)

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
        viewMessage.textContent = 'draw match.'
    }
}
// check win match
function checkWin() {
    viewMessage.textContent = ''
    winComb.forEach(arr => {
        count = 0
        arr.forEach(v => {
            if (map[v] === player)
                count++
            if (count === 3) {
                let winner
                player ? winner = 'cross' : winner = 'circle'
                viewMessage.textContent = winner + ' win'
                assets.score[winner]++
                assets.makeScore()
                restart()
                sfx.win().play()
                return
            }
        })
    })
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