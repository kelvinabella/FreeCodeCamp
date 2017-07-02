import React from 'react'
import './App.css'

const initialState = {
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
    isError: false,
    win: false
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

class Buttons extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    let {game: {levelCount, isboxLit, isboxClicked, counter}, lightsOut}= this.props
    if (isboxLit) {
      if (isboxClicked || counter > 0) {
        lightsOut(100)
      }else {
        if (levelCount>5) {
          lightsOut(500)
        } else if (levelCount>10) {
          lightsOut(300)
        } else if (levelCount>15) {
          lightsOut(100)
        } else {
          lightsOut(1000)
        }
      }
    }
  }

  render() {

    let {boxID, game: {levelCount, isboxLit, win}, playerTurn}= this.props
    let bc = (levelCount < 1 || isboxLit) ? "" : "bc"
    let addClass = (c, n) => (boxID === n || win) ? `box ${c} ${bc} ${c}-on`: `box ${c} ${bc}`
    let addFunction = (n) => playerTurn ? ()=>playerTurn(n) : null

    return (
      <div>
        <div className="top">
          <div onClick={addFunction(0)} className={addClass("green", 0)} />
          <div onClick={addFunction(1)} className={addClass("red", 1)} />
        </div>
        <div className="bottom">
          <div onClick={addFunction(2)} className={addClass("yellow", 2)} />
          <div onClick={addFunction(3)} className={addClass("blue", 3)} />
        </div>
      </div>
    )
  }
}

class Controls extends React.Component {

  render() {

    let {on,
      startGame,
      strictMode,
      setStrictMode,
      info: {game: {levelCount, isError, win}}
    } = this.props
    let level = levelCount < 10 ? `0${levelCount}` : levelCount

    return (
      <div>
        <div className="controls">
          <div className="count">
            <p className={`p-r ${on}`}>{isError? "XX" : win ? "WIN" : level}</p>
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

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...initialState}

    this.toggleONSwitch = this.toggleONSwitch.bind(this)
    this.setStrictMode = this.setStrictMode.bind(this)
    this.startGame = this.startGame.bind(this)
    this.addLevel = this.addLevel.bind(this)
    this.lightsOut = this.lightsOut.bind(this)
    this.playerTurn = this.playerTurn.bind(this)
    this.repeatPattern = this.repeatPattern.bind(this)
    this.gameWon = this.gameWon.bind(this)
    this.playAudio = this.playAudio.bind(this)

    this.countClick = 0
    this.error = new Audio("http://soundbible.com/grab.php?id=1127&type=mp3")
  }

  setStrictMode() {
    this.setState((state, props) => ({
      strictOn: !state.strictOn
      })
    )
  }

  toggleONSwitch() {
    this.setState((state, props) => ({
      ...initialState,
      switchedOn: !state.switchedOn,
      game: {
        ...initialState.game,
        randomData: Array(20).fill(null)
      }})
    )
  }

  startGame() {
    this.countClick++
    if (this.countClick !== 1) {
      console.log(this.countClick,"Do not click multiple times!!!")
    }
    else {
      let randArr = []
      this.state.game.randomData.forEach(
        (e)=> randArr.push(
          Math.round(Math.random()*3)
        )
      )

      this.setState((state, props) => ({
        ...initialState,
        strictOn: state.strictOn,
        switchedOn: true,
        switchedStart: true,
        game: {
          ...initialState.game,
          randomData: randArr,
          win: false
        }})
      )

      setTimeout(()=>{
        this.addLevel(1)
        this.repeatPattern(0)
      }, 1500)

    // reset count
    setTimeout(()=>this.countClick = 0, 2000)
    }
  }

  addLevel(l){
    this.setState((state, props) => ({
      game: {
        ...state.game,
        levelCount: l,
      }})
    )
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
    this.playAudio(this.state.game.randomData[i])
    this.setState((state, props) => ({
      game: {
        ...state.game,
        boxLit: state.game.randomData[i],
        isboxLit: true,
        isError: false
      }})
    )
  }

  playerTurn(i) {
    this.countClick++
    if (this.countClick !== 1) {
      console.log(this.countClick,"Do not click multiple times!!!")
    }
    else {

      let a = this.state.game.playerData.slice(), matched = true
      let {strictOn, game: {
        levelCount,
        randomData,
        playerData,
        counter}} = this.state

      // check if user clicks the rigth box
      if(i !== randomData[counter]) {
        matched = false
        this.error.play()
      } else {
        a[levelCount-1] = i
      }

      //if all boxes matched advance to the next level
      if(matched && counter === levelCount-1) {
        this.playAudio(i)
        if(playerData.length+1 === randomData.length) {

          this.gameWon()
          setTimeout(()=>this.startGame(), 3000)

        }else {

          let x = 0

          setTimeout(()=>this.addLevel(levelCount+1), levelCount>10?500:1000)

          let intervalID = setInterval(()=> {
            this.repeatPattern(x++)
              if (x === levelCount+1) {
                clearInterval(intervalID)
              }
          }, levelCount>10?1000:2000) // make faster as level goes up

          this.setState((state, props) => ({
            game: {
              ...state.game,
              playerData: a,
              boxClicked: i,
              isboxClicked: true,
              boxLit: i,
              isboxLit: true,
              counter: 0
            }})
          )
        }
      }

      // wait until all the boxes are clicked
      else if(matched && counter !== levelCount-1) {
        this.playAudio(i)
        this.setState((state, props) => ({
          game: {
            ...state.game,
            boxLit: i,
            isboxLit: true,
            counter: state.game.counter + 1
          }})
        )
      }

      // box clicked mismtached
      else {

        // strict mode - restart new level
        if(strictOn) {
          this.setState((state, props) => ({
            game: {
              ...state.game,
              isError: true
            }})
          )
          setTimeout(()=>this.startGame(), 1000)
        }

        // repeat pattern
        else {

          let y = 0

          let intervalID = setInterval(()=> {
            this.repeatPattern(y++)
            if (y === levelCount) {
              clearInterval(intervalID)
            }
          }, 1500)

          this.setState((state, props) => ({
            game: {
              ...state.game,
              playerData: a,
              boxClicked: null,
              boxLit: i,
              isboxLit: true,
              counter: 0,
              isError: true
            }})
          )
        }
      }

    //reset count
    setTimeout(()=>this.countClick = 0, 500)
    }

  }

  gameWon(){
    this.setState((state, props) => ({
      game: {
        ...state.game,
        win: true
      }})
    )
  }

  playAudio(i) {
    const audioGreen = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
    const audioRed = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
    const audioYellow = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
    const audioBlue = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')

    switch (i) {
      case 0:
        audioGreen.play()
        break
      case 1:
        audioRed.play()
        break
      case 2:
        audioYellow.play()
        break
      case 3:
        audioBlue.play()
        break
      default:
        break
    }
  }

  render() {
    const {switchedOn,
      strictOn,
      switchedStart,
      game,
      game: {levelCount, isError, win, boxLit}
    } = this.state
    const addFunction = (f) => switchedOn ? f: null
    const addClass = (s, c) => (s && switchedOn) ? c : ""

    return (
      <div className="App">
        <Buttons boxID={boxLit}
          game={game}
          lightsOut={addFunction(this.lightsOut)}
          playerTurn={switchedStart?addFunction(this.playerTurn):null}
        />
        <div className="middle">
          <h1>Simon<sup>&reg;</sup></h1>
          <Controls on={addClass(switchedOn, "p-wh")}
            strictMode={addClass(strictOn, "led-on")}
            setStrictMode={addFunction(this.setStrictMode)}
            startGame={addFunction(this.startGame)}
            info={{game: {levelCount, isError, win}}}
          />
          <Switch on={addClass(switchedOn, "on")}
          toggleONSwitch={this.toggleONSwitch} />
        </div>
      </div>
    );
  }
}

export default App
