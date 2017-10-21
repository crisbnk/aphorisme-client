import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { invokeApig } from '../libs/awsLib';
import "./Admin.css";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      aphorisms: []
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
          ? <ListGroupItem
              key={aphorism.aphorismId}
              href={`/admin/aphorisms/${aphorism.aphorismId}`}
              onClick={this.handleAphorismClick}
              header={aphorism.quote.trim().split("\n")[0]}
            >
              {"Created: " + new Date(aphorism.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/admin/aphorisms/new"
              onClick={this.handleAphorismClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new aphorism
              </h4>
            </ListGroupItem>
    );
  }

  handleAphorismClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Aphoris.me</h1>
        <p>A simple best quotes app</p>
        <div>
          <Link to="/admin/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/admin/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderAphorisms() {
    return (
      <div className="aphorisms">
        <PageHeader>Your Quotes</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderAphorismsList(this.state.aphorisms)}
        </ListGroup>
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
