
const gameStore = require('../../stores/game-store')

Page({
  data: gameStore.data,
  onLoad() {
    gameStore.bind('gamePage', this)
    gameStore.start()
  },
  onHide() {
    gameStore.stop()
  },
  onUnload() {
    gameStore.stop()
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
