import React, { Component } from "react";
import "whatwg-fetch";
// Removed logo since we don't need it anymore
import "./App.css";
class App extends Component {
  constructor(state) {
    super(state);
    this.state = {
      data: null,
      error: null
    };
    // this.loadAccountDetailsFromServer();
  }

  async componentWillMount() {
    let k;
    var res = await fetch("/account");
    var data = await res.json();
    k = data.display_name;
    console.log("k is ", k);
    this.setState({ data: k });
  }
  render() {
    console.log("render called");
    return (
      <div className="container">
        <h1>Hello World!</h1>
        <p>I just created my first React App</p>
        <p>{this.state.data}</p>
        <p>Yo</p>
      </div>
    );
  }
}
export default App;
