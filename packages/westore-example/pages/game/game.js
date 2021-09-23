
const gameStore = require('../../store/game-store')

Page({
  data: gameStore.data,
  onLoad() {
    gameStore.bind('gamePage', this)
  },
  turnUp() {
    gameStore.turnUp()
  },
  turnDown() {
    gameStore.turnDown()
  },
  turnLeft() {
    gameStore.turnLeft()
  },
  turnRight() {
    gameStore.turnRight()
  },
  toggleSpeed() {
    gameStore.toggleSpeed()
  },
  reset() {
    gameStore.reset()
  },
  pauseOrPlay() {
    gameStore.pauseOrPlay()
  }
})
