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

    add(name, element) {
        this.map[name] = element
    }

    addAll(elements) {
        this.map = {...this.map, ...elements}
    }

    get(elm) {
        return this.map[elm]
    }

    set(interfaceName, value) {
        this.map[interfaceName].innerText = value
    }
}

class Othello {
    constructor(playerOneName, playerTwoName, UserInterface) {
            
            this.playerOne = new Player(playerOneName, 2, 'black')
            this.playerTwo = new Player(playerTwoName, 2, 'white')
            this.UserInterface = UserInterface
        }

    init() {
        this.round = 0
        this.curPlayer = this.playerOne
        this.nextPlayer = this.playerTwo
        this.lastCreatedPawn = undefined

        // initial pawns
        this.createPawnWithColorAt(this.getBoxAt(3, 3), this.playerOne.color)
        this.createPawnWithColorAt(this.getBoxAt(3, 4), this.playerTwo.color)
        this.createPawnWithColorAt(this.getBoxAt(4, 3), this.playerTwo.color)
        this.createPawnWithColorAt(this.getBoxAt(4, 4), this.playerOne.color)
    }

    changeTurn() {
        [this.curPlayer, this.nextPlayer] = [this.nextPlayer, this.curPlayer] 
        this.round++
    }

    getBoxAt(x, y) {
        const board = this.UserInterface.get('board')
        return board.querySelector(`.box-${y}-${x}`)
    }

    createPawn(box)  {
        let pawn = document.createElement('div')
        pawn.classList.add('pawn', this.curPlayer.color)
        this.curPlayer.incrementScore();
        box.appendChild(pawn)

        this.lastCreatedPawn = pawn
    } 

    createPawnWithColorAt(box, color) {
        let pawn = document.createElement('div')
        pawn.classList.add('pawn', color)
        box.appendChild(pawn)
    }

    canCreatePawnAt(box) {

        const board = this.UserInterface.get('board')

        const [y, x] = box.classList[1].split('box-')[1].split('-')
        const thisPlace = box.firstChild 
        const top = () => {
            let top = board.querySelector(`.box-${parseInt(y)-1}-${x}`)
            return top ? top.firstChild : null
        } 
        const bottom = () => {
            let bottom = board.querySelector(`.box-${parseInt(y)+1}-${x}`)
            return bottom ? bottom.firstChild : null
        }
        const left = () => {
            let left = board.querySelector(`.box-${y}-${parseInt(x)-1}`)
            return left ? left.firstChild : null
        }
        const right = () => {
            let right = board.querySelector(`.box-${y}-${parseInt(x)+1}`)
            return right ? right.firstChild : null
        }
        const topLeft = () => {
            let topLeft = board.querySelector(`.box-${parseInt(y)-1}-${parseInt(x)-1}`)
            return topLeft ? topLeft.firstChild : null
        }
        const topRight = () => {
            let topRight = board.querySelector(`.box-${parseInt(y)-1}-${parseInt(x)+1}`)
            return topRight ? topRight.firstChild : null
        }
        const bottomRight = () => {
            let bottomRight = board.querySelector(`.box-${parseInt(y)+1}-${parseInt(x)+1}`)
            return bottomRight ? bottomRight.firstChild : null
        }
        const bottomLeft = () => {
            let bottomLeft = board.querySelector(`.box-${parseInt(y)+1}-${parseInt(x)-1}`)
            return bottomLeft ? topRight.firstChild : null
        }
        return !thisPlace && (top() || bottom() || left() || right() || topLeft() || topRight() || bottomRight() || bottomLeft())
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
        this.UserInterface.set('playerOneName', this.playerOne.name)
        this.UserInterface.set('playerTwoName', this.playerTwo.name)
        this.UserInterface.set('playerOneScore', this.playerOne.score)
        this.UserInterface.set('playerTwoScore', this.playerTwo.score)
        this.UserInterface.set('round', this.round)
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
        if (game.canCreatePawnAt(box)) {
            game.createPawn(box)
            game.flipConnectedPawns()
            game.changeTurn()
            game.updateDisplay()
        }
    })
})