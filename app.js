class Othello {
    constructor(playerOneName, playerTwoName) {
        this.playerNames = [playerOneName, playerTwoName]
    }

    init() {
        this.round = 0
        this.playerScores = [0, 0]
        this.turn = 0
        this.lastCreatedPawn = undefined
        this.playerColors = ['black', 'white']
    }

    changeTurn() {
        this.turn = Math.abs(this.turn - 1)
    }

    createPawn()  {
        let pawn = document.createElement('div')
        pawn.classList.add('pawn')
        pawn.classList.add(this.playerColors[this.turn])
        this.lastCreatedPawn = pawn
        return pawn
    } 

    flipConnectedPawns() {
        const parent = this.lastCreatedPawn.parentElement
        const [pawnY, pawnX] = parent.classList[1].split('box-')[1].split('-')
        const playerColor = this.playerColors[this.turn]
        const enemyColor = this.playerColors[Math.abs(this.turn-1)]

        // check upside
        for (let y = parseInt(pawnY)-1; y >= 0; y--) {
            let pawn = document.querySelector(`.box-${y}-${pawnX}`).firstChild
            if (pawn == null) break
            if (pawn.classList.contains(playerColor)) {
                for (let yR = pawnY-1; yR > y; yR--) {
                    let pawnFlip = document.querySelector(`.box-${yR}-${pawnX}`).firstChild
                    pawnFlip.classList.remove(enemyColor)
                    pawnFlip.classList.add(playerColor)
                }
            }
        }

        // check downside
        for (let y = parseInt(pawnY) + 1; y < 8; y++) {
            let pawn = document.querySelector(`.box-${y}-${pawnX}`).firstChild
            if (pawn == null) break
            if (pawn.classList.contains(playerColor)) {
                for (let yR = parseInt(pawnY) + 1; yR < y; yR++) {
                    let pawnFlip = document.querySelector(`.box-${yR}-${pawnX}`).firstChild
                    pawnFlip.classList.remove(enemyColor)
                    pawnFlip.classList.add(playerColor)
                }
            }
        }

        // check righside
        for (let x = parseInt(pawnX) + 1; x < 8; x++) {
            let pawn = document.querySelector(`.box-${pawnY}-${x}`).firstChild
            if (pawn == null) break
            if (pawn.classList.contains(playerColor)) {
                for (let xR = parseInt(pawnX) + 1; xR < x; xR++) {
                    let pawnFlip = document.querySelector(`.box-${pawnY}-${xR}`).firstChild
                    pawnFlip.classList.remove(enemyColor)
                    pawnFlip.classList.add(playerColor)
                }
            }
        }

        // check leftside
        for (let x = parseInt(pawnX)-1; x >= 0; x--) {
            let pawn = document.querySelector(`.box-${pawnY}-${x}`).firstChild
            if (pawn == null) break
            if (pawn.classList.contains(playerColor)) {
                for (let xR = pawnX-1; xR > x; xR--) {
                    let pawnFlip = document.querySelector(`.box-${pawnY}-${xR}`).firstChild
                    pawnFlip.classList.remove(enemyColor)
                    pawnFlip.classList.add(playerColor)
                }
            }
        }

        // check top-left side
        for (let x = parseInt(pawnX)-1, y = parseInt(pawnY)-1; x >= 0 && y >= 0; x--, y--) {
            let pawn = document.querySelector(`.box-${y}-${x}`).firstChild
            if (pawn == null) break
            if (pawn.classList.contains(playerColor)) {
                for (let xR = parseInt(pawnX)-1, yR = parseInt(pawnY)-1; xR > x && yR > y; x--, y--) {
                    let pawnFlip = document.querySelector(`.box-${yR}-${xR}`).firstChild
                    pawnFlip.classList.remove(enemyColor)
                    pawnFlip.classList.add(playerColor)
                }
            }
        }
    }
}

const game = new Othello('Muslim', 'Dayat')
game.init()

const boxes = document.querySelectorAll('.box')

boxes.forEach(box => {
    box.addEventListener('click', () => {

        if (box.childElementCount == 0) {
            box.appendChild(game.createPawn())
            game.flipConnectedPawns()
            game.changeTurn()
        }
    })
})