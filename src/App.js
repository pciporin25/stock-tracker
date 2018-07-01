import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css?v=8';

var API_KEY = "L01XY3YXI7JUEE4L"
var URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="

function StockData(props) {
  if (!props.valid) {
    return(
      <div id="stock-data">
        <h4>{props.ticker}</h4>
        <p>Invalid stock ticker. Try spelling it differently or looking up another.</p>
      </div>
    )
  }
  if (props.valid && props.data!=null) {
    return(
      <div id="stock-data">
        <h4>{props.ticker}</h4>
        <p>Opening Price: {props.data[Object.keys(props.data)[0]]}</p>
        <p>High Price: {props.data[Object.keys(props.data)[1]]}</p>
        <p>Low Price: {props.data[Object.keys(props.data)[2]]}</p>
        <p>Closing Price: {props.data[Object.keys(props.data)[3]]}</p>
        <p>Volume: {props.data[Object.keys(props.data)[4]]}</p>
      </div>
    )
  }
  else {
    return (<div></div>);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {stockName: '', nameToDisplay: '', data: null, validData: true};
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  changeHandler(event) {
    this.setState({stockName: event.target.value});
  }

  submitHandler(event) {
    console.log("here");
    const currentName = this.state.stockName.toUpperCase();
    this.setState({nameToDisplay: currentName});
    fetch(URL + this.state.stockName.toUpperCase() + "&apikey=" + API_KEY)
    .then(results => {
      return results.json();
    }).then(data => {
      console.log(data);

      for (var point in data) {
        if (point=="Error Message") {
          console.log("error");
          this.setState({validData: false});
          break;
        }
        this.setState({validData: true});
      }

      if (this.state.validData) {
        var allDays = data[Object.keys(data)[1]];
        var targetDay = allDays[Object.keys(allDays)[0]];
        this.setState({data: targetDay});
        for (var dataPoint in targetDay) {
          console.log(dataPoint + ": " + targetDay[dataPoint]);
        }
      }


      //console.log(targetDay);
      /*
      for (var guy in data) {
        console.log(data[guy]);
      }
      */
    })
    event.preventDefault();
  }

  render() {
    return (
      <div>

      <div id="intro">
        <h1>Stock Price Checker</h1>
        <p>
        Enter the ticker for your desired stock below.  Data reflects market information from the current day.
        </p>
        <p>
        Note: Sometimes the data can take a while to be fetched.  Please be patient.
        </p>
      </div>

      <form onSubmit={this.submitHandler}>
        <label>
          Enter Stock Ticker:
          <input type="text" value={this.state.stockName} onChange={this.changeHandler} />
        </label>
        <input type="submit" value="Search for Stock" />
      </form>

      <StockData data={this.state.data} valid={this.state.validData} ticker={this.state.nameToDisplay}/>

      </div>
    );
  }
}

export default App;
