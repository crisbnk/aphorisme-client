import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Header, List, Button, Card, Icon } from 'semantic-ui-react';
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
          ?
            <Card
              key={aphorism.aphorismId}
              href={`/admin/aphorisms/${aphorism.aphorismId}`}
              onClick={this.handleAphorismClick}
            >
              <Card.Content>
                <Card.Header>
                  {aphorism.author}
                </Card.Header>
                <Card.Meta>
                  {"Created: " + new Date(aphorism.createdAt).toLocaleString()}
                </Card.Meta>
                <Card.Description>
                  {aphorism.quote.trim().split("\n")[0]}
                </Card.Description>
              </Card.Content>
            </Card>
          :
            <Card
              key="new"
              href="/admin/aphorisms/new"
              onClick={this.handleAphorismClick}
            >
              <Card.Content>
                <Card.Header>
                  Create a new aphorism
                </Card.Header>
                <Card.Content className="addApohorism">
                  <Icon.Group size="huge">
                    <Icon size='big' name='thin circle' />
                    <Icon name='plus' />
                  </Icon.Group>
                </Card.Content>
              </Card.Content>
            </Card>
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
    const childProps = {
      isAuthenticated: this.props.isAuthenticated,
      userHasAuthenticated: this.props.userHasAuthenticated
    };

    return (
      <div className="lander">
        <h1>Aphoris.me</h1>
        <p>A simple best quotes app</p>
      </div>
    );
  }

  renderAphorisms() {
    return (
      <div className="aphorisms">
        <Header>Your Quotes</Header>
        <Card.Group>
          {!this.state.isLoading && this.renderAphorismsList(this.state.aphorisms)}
        </Card.Group>
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
