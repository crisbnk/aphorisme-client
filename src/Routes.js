import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home";
import Admin from "./containers/Admin";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewAphorism from "./containers/NewAphorism";
import Aphorisms from "./containers/Aphorisms";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/admin" exact component={Admin} props={childProps} />
    <UnauthenticatedRoute path="/admin/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/admin/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/admin/aphorisms/new" exact component={NewAphorism} props={childProps} />
    <AuthenticatedRoute path="/admin/aphorisms/:id" exact component={Aphorisms} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
