import React, { Component } from "react";
import { Header, Container, Button, Card, Dimmer, Popup } from 'semantic-ui-react';
import { invokeApig } from '../libs/awsLib';
import "./Admin.css";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      aphorisms: [],
      lander: 'login',
      dimmedIndex: -1
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
      // this.setState({ aphorisms: [] });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  aphorisms() {
    return invokeApig({ path: "/admin/aphorisms" });
  }

  renderAphorismsList(aphorisms) {
    const dimmed = parseInt(this.state.dimmedIndex, 10);
    let renderedList = aphorisms.length === 0 ?
      <div>
        {this.renderCreateNewAphorism()}
        <p>
          Your aphorism list is empty!
        </p>
      </div> :
      aphorisms.map((aphorism, i) =>
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
      );

    return renderedList;
  }

  handleDimmerShow = e => this.setState({ dimmedIndex: e.currentTarget.getAttribute('data-index') })
  handleDimmerHide = e => this.setState({ dimmedIndex: -1 })

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

  renderCreateNewAphorism() {
    const style = {
      borderRadius: 0,
      opacity: 0.7,
      padding: '2em',
    }
    return (
      <Popup
        trigger={
          <Button
            icon='add'
            href="/admin/aphorisms/new"
            onClick={this.handleAphorismClick}
          />
        }
        content='Create a new aphorism'
        style={style}
        inverted
      />
    )
  }

  renderLander() {
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
        {this.state.aphorisms.length !== 0 && this.renderCreateNewAphorism()}
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
