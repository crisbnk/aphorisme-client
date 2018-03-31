import React from "react";
import { Card, Container, Icon } from 'semantic-ui-react';
import config from "../config";
import { tagOptions, langOptions } from '../handlers'
import "./AphorismsList.css";

function renderTags(tags) {
  const arrayTagOpt = tags.map((t, i) => {
    const opt = tagOptions.filter(to => to.key === t);
    return (
      <Icon key={i} name={opt[0].icon} />
    )
  });
  return arrayTagOpt;
}

function renderLang(lang) {
  const langObj = langOptions.filter(lo => lo.value === lang[0]);
  const renderLang = <span>{langObj[0].key.toUpperCase()}</span>
  return renderLang;
}

export default ({...props}) =>
  <Container className="aphorisms-list">
    {console.log(props.aphorisms)}
    {
      props.aphorisms.map((a, i) => (
        <Card key={i} className="aphorism-card">
          <Card.Content>
            <Card.Header>
              {a.author}
            </Card.Header>
            <Card.Content>
              {a.quote}
            </Card.Content>
            <Card.Content
              extra
              className='card-content-extra'
            >
              <div className="card-lang">
                {renderLang(a.lang)}
              </div>
              <div className="card-tags">
                {renderTags(a.tags)}
              </div>
            </Card.Content>
          </Card.Content>
        </Card>
      ))
    }
  </Container>;
