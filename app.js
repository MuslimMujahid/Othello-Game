class Player {
    constructor(name, score, color) {
        this.name = name
        this.score = score
        this.color = color
    }

    incrementScore() {
        this.score++
    }

    decrementScore() {
        this.score--
    }
}

class UserInterface {
    constructor(interfaces) {
        if (interfaces != null) {
            this.map = interfaces
        } else {
            this.map = {}
        }
    }

    addInterface(name, element) {
        this.map[name] = element
    }

    addInterfaces(elements) {
        this.map = {...this.map, ...elements}
    }

    getInterface(elm) {
        return this.map[elm]
    }

    setInterface(interfaceName, value) {
        this.map[interfaceName].innerText = value
    }
}

class Othello {
    constructor(playerOneName, playerTwoName, UserInterface) {
            
            this.playerOne = new Player(playerOneName, 0, 'black')
            this.playerTwo = new Player(playerTwoName, 0, 'white')
            this.UserInterface = UserInterface
        }

    init() {
        this.round = 0
        this.curPlayer = this.playerOne
        this.nextPlayer = this.playerTwo
        this.lastCreatedPawn = undefined
    }

    changeTurn() {
        [this.curPlayer, this.nextPlayer] = [this.nextPlayer, this.curPlayer] 
    }

    createPawn()  {
        let pawn = document.createElement('div')
        pawn.classList.add('pawn', this.curPlayer.color)
        this.curPlayer.incrementScore();
        this.lastCreatedPawn = pawn
        return pawn
    } 

    flipConnectedPawns() {
        const parent = this.lastCreatedPawn.parentElement
        const [pawnY, pawnX] = parent.classList[1].split('box-')[1].split('-')

        const flipXY = (xI, yI) => {
            const xMax = xI < 0 ? -1 : 8
            const yMax = yI < 0 ? -1 : 8

            let x = parseInt(pawnX) + xI
            let y = parseInt(pawnY) + yI
            while (x != xMax || y != yMax) {
                try {
                    let pawn = document.querySelector(`.box-${y}-${x}`).firstChild
                    if (pawn == null) break
                    if (pawn.classList.contains(this.curPlayer.color)) {
                        let xR = parseInt(pawnX) + xI
                        let yR = parseInt(pawnY) + yI
                        while (xR != x || yR != y) {
                            // console.log(xR, yR)
                            let pawnFlip = document.querySelector(`.box-${yR}-${xR}`).firstChild
                            pawnFlip.classList.remove(this.nextPlayer.color)
                            pawnFlip.classList.add(this.curPlayer.color)
                            this.curPlayer.incrementScore()
                            this.nextPlayer.decrementScore()
                        
                            xR += xI
                            yR += yI
                        }
                    }
                } catch(e) {
                    break
                }

                x += xI
                y += yI
            }
        }

        flipXY(0, -1) // up
        flipXY(0, 1) // down
        flipXY(-1, 0) // left
        flipXY(1, 0) // right
        flipXY(1, 1) // bottom-right
        flipXY(1, -1) // top-right
        flipXY(-1, 1) // bottom-left
        flipXY(-1, -1) // top-left
    }

    updateDisplay() {
        this.UserInterface.setInterface('playerOneName', this.playerOne.name)
        this.UserInterface.setInterface('playerTwoName', this.playerTwo.name)
        this.UserInterface.setInterface('playerOneScore', this.playerOne.score)
        this.UserInterface.setInterface('playerTwoScore', this.playerTwo.score)
        this.UserInterface.setInterface('round', this.round)
    }
}

const board = document.querySelector('.board')
const playerOneNameElement = document.querySelector('.playerOne .playerName')
const playerOneScoreElement = document.querySelector('.playerOne .playerScore')
const playerTwoNameElement = document.querySelector('.playerTwo .playerName')
const playerTwoScoreElement = document.querySelector('.playerTwo .playerScore')
const roundElement = document.querySelector('.roundInfo')

const userInterface = new UserInterface({
    'board': board,
    'playerOneName': playerOneNameElement,
    'playerTwoName': playerTwoNameElement,
    'playerOneScore': playerOneScoreElement,
    'playerTwoScore': playerTwoScoreElement,
    'round': roundElement
})
const game = new Othello('Muslim', 'Dayat', userInterface)
game.init()
game.updateDisplay()

const boxes = document.querySelectorAll('.box')

boxes.forEach(box => {
    box.addEventListener('click', () => {

        if (box.childElementCount == 0) {
            box.appendChild(game.createPawn())
            game.flipConnectedPawns()
            game.changeTurn()
            game.updateDisplay()
        }
    })
})