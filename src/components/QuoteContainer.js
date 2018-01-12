import React from "react";
import { Container, Image } from 'semantic-ui-react';
import config from "../config";
import "./QuoteContainer.css";

export default ({...props}) =>
  <Container>
    <h3>{props.aphorism.quote}</h3>
    <p>{props.aphorism.aphorismId}</p>
    <Image src={config.urlImg} fluid />
  </Container>;
