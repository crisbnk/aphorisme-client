import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Header, Container, List, Button, Card, Icon, Dimmer, Segment, Image } from 'semantic-ui-react';
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
      lander: 'login',
      dimmedIndex: 0
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
    const dimmed = parseInt(this.state.dimmedIndex);
    return [{}].concat(aphorisms).map(
      (aphorism, i) =>
        i !== 0
          ?
            // <Card
            //   key={aphorism.aphorismId}
            //   href={`/admin/aphorisms/${aphorism.aphorismId}`}
            //   onClick={this.handleAphorismClick}
            // >
            //   <Card.Content>
            //     <Card.Header>
            //       {aphorism.author}
            //     </Card.Header>
            //     <Card.Meta>
            //       {"Created: " + new Date(aphorism.createdAt).toLocaleString()}
            //     </Card.Meta>
            //     <Card.Description className="aphorisms-content">
            //       {aphorism.quote.trim().split("\n")[0]}
            //     </Card.Description>
            //   </Card.Content>
            // </Card>
            <Dimmer.Dimmable
              key={i}
              data-index={i}
              as={Card}
              dimmed={i === dimmed}
              onMouseEnter={this.handleDimmerShow}
              onMouseLeave={this.handleDimmerHide}
            >
              <Dimmer active={i === dimmed} onClickOutside={this.handleHide}>
                <Button
                  primary
                  onClick={this.handleAphorismClick}
                  href={`/admin/aphorisms/${aphorism.aphorismId}`}
                >
                  Edit
                </Button>
                <Button
                  href={`/admin/aphorisms/${aphorism.aphorismId}`}
                  onClick={this.handleDelete}
                >
                  Delete
                </Button>
              </Dimmer>
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
                  <Card.Description className="aphorisms-content">
                    {aphorism.quote.trim().split("\n")[0]}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Dimmer.Dimmable>
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

  handleDimmerShow = e => this.setState({ dimmedIndex: e.currentTarget.getAttribute('data-index') })
  handleDimmerHide = e => this.setState({ dimmedIndex: 0 })

  handleAphorismClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    const noteIdUrl = event.currentTarget.getAttribute("href");
    const noteId = noteIdUrl.split('/').pop();
    console.log(noteId, noteIdUrl);

    if (!confirmed) {
      return;
    }

    // this.setState({ isDeleting: true });

    try {
      // TODO - Delete also the attachment
      await this.deleteAphorism(noteIdUrl);
      let oldNotes = this.state.aphorisms;
      const newNotes = oldNotes.filter(n => n.aphorismId !== noteId);
      this.setState({ aphorisms: newNotes });
    } catch (e) {
      alert(e);
      // this.setState({ isDeleting: false });
    }
  }

  deleteAphorism(noteIdUrl) {
    return invokeApig({
      path: noteIdUrl,
      method: "DELETE"
    });
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
        <Card.Group className="aphorisms-list">
          {!this.state.isLoading && this.renderAphorismsList(this.state.aphorisms)}
        </Card.Group>
      </div>
    );
  }

  render() {
    return (
      <Container className="Admin main">
        {this.props.isAuthenticated ? this.renderAphorisms() : this.renderLander()}
      </Container>
    );
  }
}
