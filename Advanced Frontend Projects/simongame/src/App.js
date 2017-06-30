import React from 'react';
import './App.css';

class Buttons extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    if (this.props.state.isboxLit) {// add levels here xxzv
      if (this.props.state.isboxClicked || this.props.state.counter > 0) {
        this.props.lightsOut(100)
      }else {
        this.props.lightsOut(1000)
      }
    }
  }

  render() {
    let {boxID, state, playerTurn}= this.props
    let bc = (state.level < 1 || state.isboxLit) ? "" : "bc"
    let addClass = (c, n) => (boxID === n || state.win) ? `box ${c} ${bc} ${c}-on`: `box ${c} ${bc}`
    return (
      <div>
        <div className="top">
          <div onClick={playerTurn?()=>playerTurn(0):null} className={addClass("green", 0)} />
          <div onClick={playerTurn?()=>playerTurn(1):null} className={addClass("red", 1)} />
        </div>
        <div className="bottom">
          <div onClick={playerTurn?()=>playerTurn(2):null} className={addClass("yellow", 2)} />
          <div onClick={playerTurn?()=>playerTurn(3):null} className={addClass("blue", 3)} />
        </div>
      </div>
    )
  }
}

class Controls extends React.Component {

  render() {
    let {on, strictMode, startGame, setStrictMode, state} = this.props
    let level = state.level < 10 ? `0${state.level}` : state.level

    return (
      <div>
        <div className="controls">
          <div className="count">
            <p className={`p-r ${on}`}>{state.error? "XX" : state.win ? "WIN" : level}</p>
          </div>
          COUNT
        </div>
        <div className="controls">
          <div className="start" onClick={startGame} />
          START
        </div>
        <div className="controls">
          <div className={`led ${strictMode}`} />
          <div className="strict" onClick={setStrictMode} />
          STRICT
        </div>
      </div>
    )
  }
}

const Switch = props => (
  <div className="inline">
    <p>OFF</p>
    <div className="switch" onClick={props.toggleONSwitch}>
    <div className={`off ${props.on} `} />
    </div>
    <p>ON</p>
  </div>
)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      switchedOn: false,
      strictOn: false,
      switchedStart: false,
      game: {
        levelCount: 0,
        randomData: [],
        playerData: [],
        boxLit: null,
        boxClicked: null,
        isboxClicked: false,
        isboxLit: false,
        counter: 0,
        win: false
      }
    }
    this.toggleONSwitch = this.toggleONSwitch.bind(this)
    this.setStrictMode = this.setStrictMode.bind(this)
    this.startGame = this.startGame.bind(this)
    this.addLevel = this.addLevel.bind(this)
    this.lightsOut = this.lightsOut.bind(this)
    this.playerTurn = this.playerTurn.bind(this)
    this.repeatPattern = this.repeatPattern.bind(this)
    this.gameWon = this.gameWon.bind(this)
    this.playAudio = this.playAudio.bind(this)

    this.audioGreen = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
    this.audioRed = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
    this.audioYellow = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
    this.audioBlue = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')

  }

  setStrictMode() {
    this.setState((state, props) => ({
      strictOn: !state.strictOn
    }))
  }


  toggleONSwitch() {
    this.setState((state, props) => ({
      strictOn: false,
      switchedStart: false,
      switchedOn: !state.switchedOn,
      game: {
        levelCount: 0,
        randomData: Array(2).fill(null),
        playerData: [],
        boxLit: null,
        boxClicked: null,
        isboxClicked: false,
        isboxLit: false,
        counter: 0,
        win: false
      }
    }))
  }

  startGame() {
    let randArr = []
    this.state.game.randomData.forEach((e)=> randArr.push(Math.round(Math.random()*3)))

    this.setState((state, props) => ({
      switchedStart: true,
      game: {
        levelCount: 0,
        randomData: randArr,
        playerData: [],
        boxLit: null,
        boxClicked: null,
        isboxClicked: false,
        isboxLit: false,
        counter: 0,
        isError: false,
        win: false
      }
    }))

    setTimeout(()=>{
      this.addLevel(1)
      this.repeatPattern(1)
    }, 1500)
  }

  addLevel(l){
    this.setState((state, props) => ({
      game: {
        ...state.game,
        levelCount: l,
      }
    }))
  }

  lightsOut(t){
    setTimeout(()=>{
      this.setState((state, props) => ({
        game: {
          ...state.game,
          boxLit: null,
          isboxLit: false,
          isboxClicked: false
        }
      }))
    }, t)
  }

  repeatPattern(i){
    this.setState((state, props) => ({
      game: {
        ...state.game,
        boxLit: state.game.randomData[i-1],
        isboxLit: true,
        isError: false
      }
    }))
  this.playAudio(this.state.game.randomData[i-1])

  }

  playerTurn(i) {
    this.playAudio(i)
    let a = this.state.game.playerData.slice(), matched = true

    if(i !== this.state.game.randomData[this.state.game.counter]) {
        matched = false
    } else {
      a[this.state.game.levelCount-1] = i
    }
    if(matched && this.state.game.counter === this.state.game.levelCount-1) {

     if(this.state.game.playerData.length+1 === this.state.game.randomData.length) {
      this.gameWon()
      setTimeout(()=>{
        this.startGame()
      }, 3000)
     }else {

      let x = 0
      setTimeout(()=>{
        this.addLevel(this.state.game.levelCount+1)
      }, 1000)
      let intervalID = setInterval(()=> {
      this.repeatPattern(++x)
      if (x === this.state.game.levelCount) {
        clearInterval(intervalID)
      }
      }, 2000) // make faaster as level goes up

      this.setState((state, props) => ({
      game: {
        ...state.game,
        playerData: a,
        boxClicked: i,
        isboxClicked: true,
        boxLit: i,
        isboxLit: true,
        counter: 0
      }
    }))
    }
  } else if(matched && this.state.game.counter !== this.state.game.levelCount-1) {

      this.setState((state, props) => ({
        game: {
          ...state.game,
          boxLit: i,
          isboxLit: true,
          counter: state.game.counter + 1
        }
      }))

  } else {
      if(this.state.strictOn) {
        this.setState((state, props) => ({
          game: {
            ...state.game,
            isError: true
          }
        }))
        setTimeout(()=>this.startGame(), 1000)
      } else {
      let y = 0
      let intervalID = setInterval(()=> {
        this.repeatPattern(++y)
        if (y === this.state.game.levelCount) {
          clearInterval(intervalID)
        }
      }, 1500)

      this.setState((state, props) => ({
        game: {
          ...state.game,
          playerData: a,
          boxClicked: i,
          boxLit: i,
          isboxLit: true,
          counter: 0,
          isError: true
        }
      }))}
  }
}

  gameWon(){
    this.setState((state, props) => ({
      game: {
        ...state.game,
        win: true
      }
    }))
  }

  playAudio(i) {
    switch (i) {
      case 0:
        this.audioGreen.play()
        break
      case 1:
        this.audioRed.play()
        break
      case 2:
        this.audioYellow.play()
        break
      case 3:
        this.audioBlue.play()
        break
      default:
        break
    }
  }

  render() {
    const {switchedOn, strictOn, switchedStart, game} = this.state
    const addFunction = (f) => switchedOn ? f: null
    const addClass = (s, c) => (s && switchedOn) ? c : ""

    return (
      <div className="App">
        <Buttons boxID={game.boxLit}
          state={{level:game.levelCount, isboxLit: game.isboxLit, isboxClicked: game.isboxClicked, counter: game.counter, win: game.win}}
          lightsOut={addFunction(this.lightsOut)}
          playerTurn={switchedStart?addFunction(this.playerTurn):null}
        />
        <div className="middle">
          <h1>Simon<sup>&reg;</sup></h1>
          <Controls on={addClass(switchedOn, "p-wh")}
            strictMode={addClass(strictOn, "led-on")}
            setStrictMode={addFunction(this.setStrictMode)}
            startGame={addFunction(this.startGame)}
            addLevel={addFunction(this.addLevel)}
            repeatPattern={addFunction(this.repeatPattern)}
            state={{switchedStart, switchedOn, level: game.levelCount, error: game.isError, win: game.win}}
          />
          <Switch on={addClass(switchedOn, "on")} toggleONSwitch={this.toggleONSwitch} />
        </div>
      </div>
    );
  }
}

export default App;
