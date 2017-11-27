import React, { Component } from "react";
import { Grid, Message, Form, Segment, Input } from 'semantic-ui-react';
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import {
  AuthenticationDetails,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import config from "../config";


export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const newUser = await this.signup(this.state.email, this.state.password);
      this.setState({
        newUser: newUser
      });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.confirm(this.state.newUser, this.state.confirmationCode);
      await this.authenticate(
        this.state.newUser,
        this.state.email,
        this.state.password
      );

      this.props.userHasAuthenticated(true);
      this.props.history.push("/admin");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  signup(email, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    return new Promise((resolve, reject) =>
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result.user);
      })
    );
  }

  confirm(user, confirmationCode) {
    return new Promise((resolve, reject) =>
      user.confirmRegistration(confirmationCode, true, function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      })
    );
  }

  authenticate(user, email, password) {
    const authenticationData = {
      Username: email,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  renderConfirmationForm() {
    return (
      <Grid textAlign='center' verticalAlign='middle'>
        <Form size="large" onSubmit={this.handleConfirmationSubmit}>
          <Segment stacked>
            <Form.Field>
              <Input
                id="confirmationCode"
                label="Confirmation Code"
                type="tel"
                value={this.state.confirmationCode}
                onChange={this.handleChange}
              />
              <Message info>
                <p>Please check your email for the code.</p>
              </Message>
            </Form.Field>
            <LoaderButton
              disabled={!this.validateConfirmationForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Verify"
              loadingText="Verifying…"
            />
          </Segment>
        </Form>
      </Grid>
    );
  }

  renderForm() {
    return (
      <Grid textAlign='center' verticalAlign='middle'>
        <Form size="large" onSubmit={this.handleSubmit}>
          <Segment stacked>
            <Form.Field>
              <Input
                id="email"
                placeholder="Email address"
                type="email"
                icon='users'
                iconPosition='left'
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                icon='lock'
                iconPosition='left'
                value={this.state.password}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                id="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                icon='lock'
                iconPosition='left'
                value={this.state.confirmPassword}
                onChange={this.handleChange}
              />
            </Form.Field>
            <LoaderButton
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Signup"
              loadingText="Signing up…"
            />
          </Segment>
        </Form>
      </Grid>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
