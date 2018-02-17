import React, { Component } from "react";
import { Button, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';
import Unsplash, { toJson } from 'unsplash-js';
import { invokeApigNotAuth } from '../libs/awsLib';
import { tagOptions, langOptions } from '../handlers'
import QuoteContainer from "../components/QuoteContainer";
import AphorismsList from "../components/AphorismsList";
import config from "../config";
import "./Home.css";

const unsplash = new Unsplash(config.unsplash);

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      aphorismCounter: 0,
      imgCounter: 0,
      isLoading: true,
      aphorisms: [],
      backgroundImages: [],
      sidebarVisible: false
    };
  }

  async componentDidMount() {
    let timer;
    try {
      const results = await this.aphorismsQuery();
      this.setState({ aphorisms: results });
      timer = setInterval(this.tick.bind(this), 10000);
    } catch (e) {
      alert(e);
    }

    // TODO - UNSPLASH API to retrieve background images
    // unsplash.photos.listPhotos(2, 15, "latest")
    // .then(toJson)
    // .then(json => {
    //   console.log(json);
    // });
    // unsplash.search.photos("travel", 3, 20)
    // .then(toJson)
    // .then(json => {
    //   console.log(json);
    // });
    this.setState({
      backgroundImages: [{
        url: config.urlImg,
        tag: tagOptions[1].value
      }, {
        url: config.urlImg_bis,
        tag: tagOptions[2].value
      }]
    });

    this.setState({ isLoading: false });
    this.setState({timer});
  }

  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }

  tick() {
    this.setState({
      aphorismCounter: this.state.aphorismCounter < this.state.aphorisms.length - 1 ?
        this.state.aphorismCounter + 1 : 0,
      imgCounter: this.state.imgCounter < this.state.backgroundImages.length - 1 ?
        this.state.imgCounter + 1 : 0
    });
  }

  aphorismsQuery() {
    return invokeApigNotAuth({ path: "/" });
  }

  handleAphorismClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderAphorisms() {
    return (
      <div className="aphorisms">
        {!this.state.isLoading &&
          (
            this.state.sidebarVisible ?
            <AphorismsList aphorisms={this.state.aphorisms} />
            :
            <QuoteContainer
              aphorism={this.state.aphorisms[this.state.aphorismCounter]}
              background={this.state.backgroundImages[this.state.imgCounter]}
            />
          )
        }
      </div>
    );
  }

  toggleVisibility = () => this.setState({ sidebarVisible: !this.state.sidebarVisible })

  render() {
    const sidebarVisible = this.state.sidebarVisible;
    const arrowRotate = sidebarVisible ? 'rotate' : '';
    return (
      <div className="Home">
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='uncover'
            width='thin'
            direction='right'
            visible={sidebarVisible}
            icon='labeled'
            vertical
          >
            <Menu.Item name='world'>
              <Icon name='world' />
              Language
            </Menu.Item>
            <Menu.Item name='write'>
              <Icon name='write' />
              Author
            </Menu.Item>
            <Menu.Item name='tag'>
              <Icon name='tag' />
              Tags
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment className='segment-quote-container'>
              {this.renderAphorisms()}
              <Button className='sidebar-show' onClick={this.toggleVisibility}>
                <Icon name='arrow left' className={arrowRotate} size='large' />
              </Button>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
