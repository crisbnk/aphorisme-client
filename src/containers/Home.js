import React, { Component } from "react";
import { toJson } from "unsplash-js";
import { invokeApigNotAuth } from '../libs/awsLib';
import QuoteContainer from "../components/QuoteContainer";
import config from "../config";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      counter: 0,
      isLoading: true,
      aphorisms: []
    };
  }

  async componentDidMount() {
    let timer;
    try {
      const results = await this.aphorismsQuery();
      this.setState({ aphorisms: results });
      timer = setInterval(this.tick.bind(this), 2000);
    } catch (e) {
      alert(e);
    }

    // TODO - UNSPLASH API to retrieve background images
    // config.unsplash.photos.listPhotos(2, 15, "latest")
    // .then(toJson)
    // .then(json => {
    //   console.log(json);
    // });

    this.setState({ isLoading: false });
    this.setState({timer});
  }

  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }

  tick() {
    this.setState({
      counter: this.state.counter < this.state.aphorisms.length - 1 ?
        this.state.counter + 1 : 0
    });
  }

  aphorismsQuery() {
    return invokeApigNotAuth({ path: "/" });
  }

  handleAphorismClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderAphorisms() {
    return (
      <div className="aphorisms">
        {/* <h3>
          {!this.state.isLoading && this.state.aphorisms[this.state.counter].quote}
        </h3>
        <p>{!this.state.isLoading && this.state.aphorisms[this.state.counter].aphorismId}</p> */}
        {!this.state.isLoading && <QuoteContainer aphorism={this.state.aphorisms[this.state.counter]} />}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <h1>APHORIS.ME</h1>
        {this.renderAphorisms()}
      </div>
    );
  }
}
