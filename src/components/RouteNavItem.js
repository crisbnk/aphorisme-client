import React from "react";
import { Route } from "react-router-dom";
import { Menu } from 'semantic-ui-react';

export default props =>
  <Route
    path={props.href}
    exact
    children={({ match, history }) =>
      <Menu.Item
        onClick={e => history.push(e.currentTarget.getAttribute("href"))}
        {...props}
        active={match ? true : false}
      >
        {props.children}
      </Menu.Item>}
  />;
