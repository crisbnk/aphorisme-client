import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Header, List, Button } from 'semantic-ui-react';
import { invokeApig } from '../libs/awsLib';
import Login from './Login';
import Signup from './Signup';
import "./Admin.css";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      aphorisms: [],
      lander: 'login'
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const results = await this.aphorisms();
      console.log('RESULTS');
      console.log(results);
      this.setState({ aphorisms: results });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  aphorisms() {
    return invokeApig({ path: "/admin/aphorisms" });
  }

  renderAphorismsList(aphorisms) {
    return [{}].concat(aphorisms).map(
      (aphorism, i) =>
        i !== 0
          ? <List.Item
              key={aphorism.aphorismId}
              href={`/admin/aphorisms/${aphorism.aphorismId}`}
              onClick={this.handleAphorismClick}
            >
              <List.Content>
                <List.Header>
                  {aphorism.quote.trim().split("\n")[0]}
                </List.Header>
                <List.Description>
                  {"Created: " + new Date(aphorism.createdAt).toLocaleString()}
                </List.Description>
              </List.Content>
            </List.Item>
          : <List.Item
              key="new"
              href="/admin/aphorisms/new"
              onClick={this.handleAphorismClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new aphorism
              </h4>
            </List.Item>
    );
  }

  handleAphorismClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderLanderBtn = event => {
    this.setState({
      lander: event.target.id
    });
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Aphoris.me</h1>
        <p>A simple best quotes app</p>
        <div>
          {/* <Link to="/admin/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/admin/signup" className="btn btn-success btn-lg">
            Signup
          </Link> */}
          <Button.Group>
            <Button id="login" onClick={this.renderLanderBtn}>Login</Button>
            <Button id="signup" onClick={this.renderLanderBtn}>Signup</Button>
          </Button.Group>
          { this.state.lander === 'login'? <Login /> : <Signup /> }
        </div>
      </div>
    );
  }

  renderAphorisms() {
    return (
      <div className="aphorisms">
        <Header>Your Quotes</Header>
        <List>
          {!this.state.isLoading && this.renderAphorismsList(this.state.aphorisms)}
        </List>
      </div>
    );
  }

  render() {
    return (
      <div className="Admin">
        {this.props.isAuthenticated ? this.renderAphorisms() : this.renderLander()}
      </div>
    );
  }
}
