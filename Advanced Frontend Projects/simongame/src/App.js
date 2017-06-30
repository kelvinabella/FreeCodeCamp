import React from 'react';
import './App.css';

class Buttons extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props.state.isboxLit)
    if (this.props.state.isboxLit) {// add levels here xxzv
      this.props.lightsOut(1500)
    }
  }

  render() {
    let {boxID, state, playerTurn}= this.props
    let bc = (state.level < 1 || state.isboxLit) ? "" : "bc"
    let addClass = (c, n) => boxID === n ? `box ${c} ${bc} ${c}-on`: `box ${c} ${bc}`
    return (
      <div>
        <div className="top">
          <div onClick={()=>playerTurn(0)} className={addClass("green", 0)} />
          <div onClick={()=>playerTurn(1)} className={addClass("red", 1)} />
        </div>
        <div className="bottom">
          <div onClick={()=>playerTurn(2)} className={addClass("yellow", 2)} />
          <div onClick={()=>playerTurn(3)} className={addClass("blue", 3)} />
        </div>
      </div>
    )
  }
}

class Controls extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    if (this.props.state.switchedStart && (this.props.state.switchedOn===prevProps.state.switchedOn)){
      setTimeout(()=>{
        // console.log(this.props.state.level+1)
        this.props.addLevel(this.props.state.level+1)
      }, 1500)
    }
  }
  render() {
    let {on, strictMode, startGame, setStrictMode, state} = this.props
    let level = state.level < 10 ? `0${state.level}` : state.level
    return (
      <div>
        <div className="controls">
          <div className="count">
            <p className={`p-r ${on}`}>{level}</p>
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
        isboxLit: false
      }
    }
    this.toggleONSwitch = this.toggleONSwitch.bind(this)
    this.setStrictMode = this.setStrictMode.bind(this)
    this.startGame = this.startGame.bind(this)
    this.addLevel = this.addLevel.bind(this)
    this.lightsOut = this.lightsOut.bind(this)
    this.playerTurn = this.playerTurn.bind(this)
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
        randomData: Array(20).fill(null),
        playerData: [],
        boxLit: null,
        boxClicked: null,
        isboxClicked: false,
        isboxLit: false
      }
    }))
  }

  startGame() {
    let randArr = []
    this.state.game.randomData.forEach((e)=> randArr.push(Math.round(Math.random()*3)))

    this.setState((state, props) => ({
      strictOn: false,
      switchedStart: true,
      game: {
        levelCount: 0,
        randomData: randArr,
        playerData: [],
        boxLit: null,
        boxClicked: null,
        isboxClicked: false,
        isboxLit: false
      }
    }))
  }

  addLevel(l){
    console.log([l-1])
    this.setState((state, props) => ({
      switchedStart: false,
      game: {
        ...state.game,
        levelCount: l,
        boxLit: state.game.randomData[l-1],
        isboxLit: true
      }
    }))
  }

  lightsOut(t){
    setTimeout(()=>{
      this.setState((state, props) => ({
        game: {
          ...state.game,
          boxLit: null,
          isboxLit: false
        }
      }))
    }, t)
  }

  playerTurn(i) {
    let a = []
    if(i === this.state.game.randomData[this.state.game.levelCount-1]) {
      // console.log(1)
      a = this.state.game.playerData.slice()
      a[this.state.game.levelCount-1] = i
      let x = 0
      let intervalID = setInterval(()=> {
      this.addLevel(++x)
      // console.log(x)
      if (x === 2) {
        clearInterval(intervalID)
      }
    }, 1000)
    //   this.setState((state, props) => ({
    //   game: {
    //     ...state.game,
    //     playerData: a,
    //     boxClicked: i,
    //     isboxClicked: true
    //   }
    // }))


    } else {
      console.log(2)
    }
  }


  render() {
    const {switchedOn, strictOn, switchedStart, game} = this.state
    const addFunction = (f) => switchedOn ? f: null
    const addClass = (s, c) => (s && switchedOn) ? c : ""
    return (
      <div className="App">
        <Buttons boxID={game.boxLit}
          state={{level:game.levelCount, isboxLit: game.isboxLit}}
          lightsOut={addFunction(this.lightsOut)}
          playerTurn={addFunction(this.playerTurn)}
        />
        <div className="middle">
          <h1>Simon<sup>&reg;</sup></h1>
          <Controls on={addClass(switchedOn, "p-wh")}
            strictMode={addClass(strictOn, "led-on")}
            setStrictMode={addFunction(this.setStrictMode)}
            startGame={switchedStart?null:addFunction(this.startGame)}
            addLevel={addFunction(this.addLevel)}
            state={{switchedStart, switchedOn, level: game.levelCount}}
          />
          <Switch on={addClass(switchedOn, "on")} toggleONSwitch={this.toggleONSwitch} />
        </div>
      </div>
    );
  }
}

export default App;
