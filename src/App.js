import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Segment, Container } from 'semantic-ui-react';
import { authUser, signOutUser } from "./libs/awsLib";
import Routes from "./Routes";
import RouteNavItem from "./components/RouteNavItem";
import "./App.css";

function navBarStyle(pathname) {
  if(pathname === '/') {
    return {
      backgroundColor: "transparent"
    };
  }
}

function navBarLink(pathname) {
  if(pathname === '/') {
    return "/";
  }
  return "/admin";
}

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

  renderLogButtons() {
    return(
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
    )
  }

  renderNavbar() {
    return (
      <Menu secondary fixed="top" id="navbar" style={navBarStyle(this.props.location.pathname)}>
        <Menu.Item header>
          <Link to={navBarLink(this.props.location.pathname)}>Aphoris.me</Link>
        </Menu.Item>
        {this.props.location.pathname !== '/' && this.renderLogButtons()}
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
        {this.renderNavbar()}
        <Routes childProps={childProps} />
        {this.props.location.pathname !== '/' && this.renderFooter()}
      </div>
    );
  }
}

export default withRouter(App);
