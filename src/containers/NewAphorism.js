import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap"; // TODO - remove Bootstrap
import { Dropdown } from 'semantic-ui-react'
import { tagOptions } from '../handlers'
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
      tags: []
    };
  }

  validateForm() {
    return (
      this.state.quote.length > 0 &&
      this.state.author.length > 0 &&
      this.state.tags.length > 0
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

  createAphorism(aphorism) {
    return invokeApig({
      path: "/admin/aphorisms",
      method: "POST",
      body: aphorism
    });
  }

  render() {
    return (
      <div className="NewAphorism">
        <form onSubmit={this.handleSubmit}>

          <FormGroup controlId="quote">
            <ControlLabel>Quote</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.quote}
              componentClass="textarea"
            />
          </FormGroup>

          <FormGroup controlId="author">
            <ControlLabel>Author</ControlLabel>
            <FormControl
              type="text"
              onChange={this.handleChange}
              value={this.state.author}
              componentClass="input"
            />
          </FormGroup>

          <Dropdown
            placeholder='Select your tag'
            options={tagOptions}
            onChange={this.handleTags}
            fluid multiple selection
          />

          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>

          <LoaderButton
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />

        </form>
      </div>
    );
  }
}
