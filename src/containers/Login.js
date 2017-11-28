import React, { Component } from "react";
import { Grid, Form, Segment, Input } from 'semantic-ui-react';
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from "amazon-cognito-identity-js";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
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
      await this.login(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  login(email, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  render() {
    return (
      <div className="Login">
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
              <LoaderButton
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Login"
                loadingText="Logging in…"
              />
            </Segment>
          </Form>
        </Grid>
      </div>
    );
  }
}
