const alarm = document.getElementById("beep");


/*
States of the component:

breakLength: the length of break as specified by user, in minutes
sessionLength: the length of session as specified by user, in minutes
clockTime: the displayed value of the countdown timer in seconsds
currentTimer: the label for the displayed value
isPlaying: whether the clock is playing or paused
*/

class App extends React.Component {
    constructor(props) {
    super(props);

    // variable containing the setInterval() loop
    this.loop = undefined;

    this.state = {
        breakLength: 5,
        sessionLength: 25,
        clockTime: 25 * 60,
        currentTimer: 'Session',
        isPlaying: false
    };


    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleBreakIncrease = this.handleBreakIncrease.bind(this);
    this.handleBreakDecrease = this.handleBreakDecrease.bind(this);
    this.handleSessionIncrease = this.handleSessionIncrease.bind(this);
    this.handleSessionDecrease = this.handleSessionDecrease.bind(this);

  }
    //converts seconds to MM:SS format
    convertToClockFormat(seconds) {
        let minutes = parseInt(seconds / 60);
        let new_seconds = seconds % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        new_seconds = new_seconds < 10 ? "0" + new_seconds : new_seconds;

        return `${minutes}:${new_seconds}`;
    }

    handlePlayPause() {
        if (this.state.isPlaying) {
            this.setState(prevState => {
                return({
                    isPlaying: false
                });
            });

            clearInterval(this.loop);
        }

        else {
            this.setState(prevState => {
                return({
                    isPlaying: true
                });
            });

            this.loop = setInterval(() => {
                this.setState(prevState => {

                    // decrement counter as long as clockTime is positive
                    if (prevState.clockTime > 0) {
                        return({
                            clockTime: prevState.clockTime - 1
                        });
                    }

                    // switches between break and session when timer hits 00:00
                    else if (prevState.clockTime == 0) {
                        alarm.play();
                        return({
                            clockTime: (prevState.currentTimer == 'Session') ? prevState.breakLength * 60 : prevState.sessionLength * 60,
                            currentTimer: (prevState.currentTimer == 'Session') ? 'Break' : 'Session'
                        });
                    }
                });
            }, 1000);

        }
    }

    handleReset() {
        clearInterval(this.loop);

        alarm.pause();
        alarm.currentTime = 0;

        this.setState(prevState => {
            return({
                breakLength: 5,
                sessionLength: 25,
                clockTime: 25 * 60,
                currentTimer: 'Session',
                isPlaying: false
            });
        });
    }

    handleBreakIncrease() {
        this.setState(prevState => {
            if (prevState.breakLength < 60){
                return ({
                    breakLength: prevState.breakLength + 1
                });
            }
        });
    }

    handleBreakDecrease() {
        this.setState(prevState => {
            if (prevState.breakLength > 1){
                return ({
                    breakLength: prevState.breakLength - 1
                });
            }
        });
    }

    handleSessionIncrease() {
        this.setState(prevState => {
            if (prevState.sessionLength < 60){
                return ({
                    sessionLength: prevState.sessionLength + 1,
                    clockTime: (prevState.sessionLength + 1) * 60
                });
            }
        });
    }

    handleSessionDecrease() {
        this.setState(prevState => {
            if (prevState.sessionLength > 1){
                return ({
                    sessionLength: prevState.sessionLength - 1,
                    clockTime: (prevState.sessionLength - 1) * 60
                });
            }
        });
    }

    render(){

    return (
        <div id="main-container">
            <div className="primary-container">
                <div className="secondary-container">
                    <h2 id="break-label">Break Length</h2>
                    <div className="flex-row">
                        <button id="break-decrement" onClick={this.handleBreakDecrease}><i className="fas fa-minus"></i></button>
                        <div id="break-length">{this.state.breakLength}</div>
                        <button id="break-increment" onClick={this.handleBreakIncrease}><i className="fas fa-plus"></i></button>
                    </div>
                </div>
                <div className="secondary-container">
                    <h2 id="session-label">Session Length</h2>
                    <div className="flex-row">
                        <button id="session-decrement" onClick={this.handleSessionDecrease}><i className="fas fa-minus"></i></button>
                        <div id="session-length">{this.state.sessionLength}</div>
                        <button id="session-increment" onClick={this.handleSessionIncrease}><i className="fas fa-plus"></i></button>
                    </div>
                </div>
            </div>
            <div className="secondary-container">
                <h1 id="timer-label">{this.state.currentTimer}</h1>
                <div id="time-left">{this.convertToClockFormat(this.state.clockTime)}</div>
                <button id="start_stop" onClick={this.handlePlayPause}>{(this.state.isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>)}</button>
                <button id="reset" onClick={this.handleReset}><i className="fas fa-sync"></i></button>
            </div>
         </div>
    );
  }
}




ReactDOM.render(<App />, document.getElementById("root"));

