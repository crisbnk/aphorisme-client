import React, { Component } from "react";
import { Dropdown, Form, Container, Grid } from 'semantic-ui-react';
import { tagOptions, langOptions } from '../handlers';
import LoaderButton from "../components/LoaderButton";
import { invokeApig, s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewAphorism.css";

export default class NewAphorism extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      quote: "",
      author: "",
      tags: [],
      lang: []
    };
  }

  validateForm() {
    return (
      this.state.quote.length > 0 &&
      this.state.author.length > 0 &&
      this.state.tags.length > 0 &&
      this.state.lang.length > 0
    );
  }

  handleChange = event => {
    console.log(event);
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      const uploadedFilename = this.file
        ? (await s3Upload(this.file)).Location
        : null;

      await this.createAphorism({
        quote: this.state.quote,
        author: this.state.author,
        tags: this.state.tags,
        lang: this.state.lang,
        attachment: uploadedFilename
      });
      this.props.history.push("/admin");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleTags = (e, { value }) => {
    this.setState({ tags: value });
  }

  handleLang = (e, { value }) => {
    this.setState({ lang: value });
  }

  createAphorism(aphorism) {
    return invokeApig({
      path: "/admin/aphorisms",
      method: "POST",
      body: aphorism
    });
  }

  render() {
    return (
      <Container className="NewAphorism">
        <Form onSubmit={this.handleSubmit}>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Form.TextArea
                  id="quote"
                  label="Quote"
                  placeholder="This is my best quote..."
                  onChange={this.handleChange}
                  value={this.state.quote}
                  width={12}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  id="author"
                  label="Author"
                  placeholder="Author"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.author}
                />
                <Form.Input
                  id="attachment"
                  label="Attachment"
                  placeholder="Attachment"
                  onChange={this.handleFileChange}
                  type="file"
                />
                <label className="form-label">Tag</label>
                <Dropdown
                  placeholder='Select your tag'
                  options={tagOptions}
                  onChange={this.handleTags}
                  fluid multiple selection
                />
                <label className="form-label">Languages</label>
                <Dropdown
                  placeholder='Select your language'
                  options={langOptions}
                  onChange={this.handleLang}
                  fluid multiple selection
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <LoaderButton
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Create"
                loadingText="Creating…"
              />
            </Grid.Row>
          </Grid>
        </Form>
      </Container>
    );
  }
}
