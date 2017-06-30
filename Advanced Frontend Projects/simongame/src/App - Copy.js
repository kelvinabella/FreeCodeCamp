import React from 'react';
import './App.css';

class Buttons extends React.Component {

  componentWillReceiveProps(nextProps) {
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.toggleClick && this.props.box) {
      setTimeout(()=>{
        this.props.toggleLight()
      }, 2500)
    }
    // console.log(this.props.game.levelCount)
      if(this.props.game.levelCount >1){
      // console.log(this.props.game.randNum[this.props.game.levelCount-1],this.props.game.usrData[this.props.game.levelCount-1])
      if(this.props.game.randNum[this.props.game.levelCount-2]===this.props.game.usrData[this.props.game.levelCount-2]) {
        console.log(1)
      } else {
        console.log(2)
      }
    }

  }

  render() {
    let {box, counter, cursor} = this.props
    let cls = (c, n) => box === n ? `box ${c} ${c}-on ${cursor}`: `box ${c} ${cursor}`
    // let onc = (n) => box === n ? counter : null
    return (
      <div>
        <div className="top">
          <div onClick={counter} className={cls("green", 0)} />
          <div onClick={counter} className={cls("red", 1)}/>
        </div>
        <div className="bottom">
          <div onClick={counter} className={cls("yellow", 2)} />
          <div onClick={counter} className={cls("blue", 3)} />
        </div>
      </div>
    )
  }
}

class Controls extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.info.start) {
      setTimeout(()=>{
        this.props.counter()
      }, 1500)
    }
    // console.log(2)
  }

  render() {
    let {switchStrict, switchStart, on, ledOn, info: {levelCount, start}} = this.props
    let level = levelCount < 10 ? `0${levelCount}` : levelCount
    return (
      <div>
        <div className="controls">
          <div className="count">
            <p className={`p-r ${on}`}>{level}</p>
          </div>
          COUNT
        </div>
        <div className="controls">
          <div className="start" onClick={start ? null: switchStart} />
          START
        </div>
        <div className="controls">
          <div className={`led ${ledOn}`} />
          <div className="strict" onClick={switchStrict}>
          </div>
          STRICT
        </div>
      </div>
    )
  }
}

const Switch = props => (
  <div className="inline">
    <p>OFF</p>
    <div className="switch" onClick={props.switch}>
    <div className={"off " + props.off} />
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
        randNum: [],
        randBox: null,
        usrData: [],
        toggleClick: true
      }
    }

    this.switch = this.switch.bind(this)
    this.switchStrict = this.switchStrict.bind(this)
    this.switchStart = this.switchStart.bind(this)
    this.counter = this.counter.bind(this)
    this.toggleLight = this.toggleLight.bind(this)
  }

  switch() {
    this.setState((state, props) => ({
      strictOn: false,
      switchedStart: false,
      switchedOn: !state.switchedOn,
      game: {
        levelCount: 0,
        randNum: Array(20).fill(null),
        randBox: null,
        usrData: [],
        toggleClick: true
      }
    }))
  }

  switchStrict() {
    this.setState((state, props) => ({
      strictOn: !state.strictOn
    }))
  }

  switchStart() {
    let a = []
    this.state.game.randNum.forEach((e)=> a.push(Math.round(Math.random()*3)))
    this.setState((state, props) => ({
      switchedStart: true,
      game: {
        levelCount: 0,
        randNum: a,
        randBox: null,
        usrData: [],
        toggleClick: false
      }
    }))
  }

  counter(a){//add clicked button
    this.setState((state, props) => ({
      switchedStart: false,
      game: {
        ...state.game,
        levelCount: state.game.levelCount + 1,
        randBox: state.game.randNum[state.game.levelCount],
        toggleClick: true
      }
    }))
  }

  toggleLight() {
    let arr = this.state.game.usrData.slice()
    arr.push(this.state.game.randBox)
    // console.log(arr)
    this.setState((state, props) => ({
      switchedStart: false,
      game: {
        ...state.game,
        randBox: null,
        usrData: arr,
      }
    }))
  }

  render() {
    const {switchedOn:on, strictOn: strict, switchedStart:start, game: {levelCount, randBox, toggleClick}} = this.state
    const func = (f) => on ? f: null
    const info = (s, c) => (s && on) ? c : ""
    return (
      <div className="App">
        <Buttons box={on ? toggleClick ? randBox : null: null} counter={(start||levelCount>0) ? this.counter:null}
        toggleLight={this.toggleLight} toggleClick={toggleClick} cursor={(start||levelCount>0) ? "bc": ""}
        game={this.state.game}/>
        <div className="middle">
          <h1>Simon<sup>&reg;</sup></h1>
          <Controls ledOn={info(strict, "led-on")} switchStrict={func(this.switchStrict)}
            on={info(on, "p-wh")} info={{levelCount, start}}
            switchStart={func(this.switchStart)} counter={func(this.counter)}
          />
          <Switch off={info(on,"on")} switch={this.switch}/>
        </div>
      </div>
    );
  }
}

export default App;
