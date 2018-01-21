import React from "react";
import { Container, Segment } from 'semantic-ui-react';
import config from "../config";
import "./QuoteContainer.css";

function createStyle(propsBackground) {
  return {
    height: "100vh",
    width: "100%",
    background: "url('" + propsBackground.url + "') no-repeat center center fixed",
    backgroundSize: "cover",
    padding: "10em",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
};

export default ({...props}) =>
  <Container style={createStyle(props.background)}>
    <Segment className="quote-segment" raised>
      <div className="quote-text">
        <h3 className="quote-text-title">{props.aphorism.quote}</h3>
      </div>
      <div className="quote-author">
        <p className="quote-author-name">{props.aphorism.author}</p>
      </div>
    </Segment>
  </Container>;
