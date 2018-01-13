import React from "react";
import { Container, Image, Segment } from 'semantic-ui-react';
import config from "../config";
import "./QuoteContainer.css";

const style = {
  height: "100vh",
  width: "100%",
  background: "url('" + config.urlImg + "') no-repeat center center fixed",
  backgroundSize: "cover",
  padding: "10em",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center"
};

export default ({...props}) =>
  <Container style={style}>
    <Segment className="quote-segment" raised>
      <h3>{props.aphorism.quote}</h3>
      <p>{props.aphorism.aphorismId}</p>
    </Segment>
  </Container>;
