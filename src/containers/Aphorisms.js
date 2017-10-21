import React, { Component } from "react";
import { invokeApig, s3Upload } from "../libs/awsLib"; // TODO - Add s3Delete
import { Dropdown, Form } from 'semantic-ui-react'
import { tagOptions } from '../handlers'
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Aphorisms.css";

export default class Aphorisms extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      aphorism: null,
      quote: "",
      author: "",
      tags: []
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getAphorism();
      this.setState({
        aphorism: results,
        quote: results.quote,
        author: results.author,
        tags: results.tags
      });
    } catch (e) {
      alert(e);
    }
  }

  getAphorism() {
    return invokeApig({ path: `/admin/aphorisms/${this.props.match.params.id}` });
  }

  validateForm() {
    return (
      this.state.quote.length > 0 &&
      this.state.author.length > 0 &&
      this.state.tags.length > 0
    );
  }

  formatFilename(str) {
    return str.length < 50
      ? str
      : str.substr(0, 20) + "..." + str.substr(str.length - 20, str.length);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  saveAphorism(aphorism) {
    return invokeApig({
      path: `/admin/aphorisms/${this.props.match.params.id}`,
      method: "PUT",
      body: aphorism
    });
  }

  handleSubmit = async event => {
    let uploadedFilename;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        // TODO - Insert s3Delete before upload a new attachment
        uploadedFilename = (await s3Upload(this.file))
          .Location;
      }

      await this.saveAphorism({
        ...this.state.quote,
        quote: this.state.quote,
        author: this.state.author,
        tags: this.state.tags,
        attachment: uploadedFilename || this.state.quote.attachment
      });
      this.props.history.push("/admin");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deleteAphorism() {
    return invokeApig({
      path: `/admin/aphorisms/${this.props.match.params.id}`,
      method: "DELETE"
    });
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      // TODO - Delete also the attachment
      await this.deleteAphorism();
      this.props.history.push("/admin");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  handleTags = (e, { value }) => {
    this.setState({ tags: value });
  }

  render() {
    return (
      <div className="Aphorisms">
        {this.state.aphorism &&
          <form onSubmit={this.handleSubmit} className="ui form">
            <Form.Group>
              <Form.TextArea
                label="Quote"
                onChange={this.handleChange}
                value={this.state.quote}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="Author"
                type="text"
                onChange={this.handleChange}
                value={this.state.author}
              />
            </Form.Group>
            <Dropdown
              placeholder='Select your tag'
              options={tagOptions}
              onChange={this.handleTags}
              value={this.state.tags}
              fluid multiple selection
            />
            {this.state.aphorism.attachment &&
              <Form.Group>
                <Form.Field
                  label="Attachment"
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.aphorism.attachment}
                  >
                    {this.formatFilename(this.state.aphorism.attachment)}
                  </a>
                </Form.Field>
              </Form.Group>}
            <Form.Group>
              <Form.Input
                label="Attachment"
                onChange={this.handleFileChange}
                type="file"
              />
            </Form.Group>
            <LoaderButton
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}
