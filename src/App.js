import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Segment, Container } from 'semantic-ui-react';
import { authUser, signOutUser } from "./libs/awsLib";
import Routes from "./Routes";
import RouteNavItem from "./components/RouteNavItem";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = event => {
    signOutUser();

    this.userHasAuthenticated(false);

    this.props.history.push("/admin/login");
  }

  renderNavbar() {
    return (
      <Menu secondary fixed="top" id="navbar">
        <Menu.Item header>
          <Link to="/admin">Aphoris.me</Link>
        </Menu.Item>
        <Menu.Menu position='right'>
          {this.state.isAuthenticated
            ? <Menu.Item onClick={this.handleLogout}>
                Logout
              </Menu.Item>
            : [
                <RouteNavItem key={1} href="/admin/signup">
                  Signup
                </RouteNavItem>,
                <RouteNavItem key={2} href="/admin/login">
                  Login
                </RouteNavItem>
              ]
          }
        </Menu.Menu>
      </Menu>
    )
  }

  renderFooter() {
    return(
      <Segment secondary vertical id="footer">
        <Container>
          Footer
        </Container>
      </Segment>
    )
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        {this.props.location.pathname !== '/' && this.renderNavbar()}
        <Routes childProps={childProps} />
        {this.props.location.pathname !== '/' && this.renderFooter()}
      </div>
    );
  }
}

export default withRouter(App);
