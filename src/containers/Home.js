import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Icon,
  Menu,
  Segment,
  Sidebar
} from 'semantic-ui-react';
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
      sidebarVisible: false,
      langDropDownValue: [],
      tagDropDownValue: []
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

  filterList = (list, ...args) => {
    let secondList = [...list];
    const matchArray = args.filter(a => a.value.length);

    matchArray.forEach(filterArg => {
      secondList = secondList.filter(a => {
        return filterArg.value.find(f => f === a[`${filterArg.name}`][0]);
      });
    });

    return secondList;
  }

  renderAphorisms() {
    const aphorisms = this.filterList(
      this.state.aphorisms,
      {
        name: 'lang',
        value: this.state.langDropDownValue
      },
      {
        name: 'tags',
        value: this.state.tagDropDownValue
      }
    );
    return (
      <div className="aphorisms">
        {!this.state.isLoading &&
          (
            this.state.sidebarVisible ?
            <AphorismsList aphorisms={aphorisms} />
            :
            <QuoteContainer
              aphorism={aphorisms[this.state.aphorismCounter]}
              background={this.state.backgroundImages[this.state.imgCounter]}
            />
          )
        }
      </div>
    );
  }

  toggleVisibility = () => this.setState({ sidebarVisible: !this.state.sidebarVisible })

  handleDropDownChange = (e, dropDownValue) => {
    this.setState(
      { [`${dropDownValue.name}DropDownValue`]: dropDownValue.value }
    )
  }

  render() {
    const sidebarVisible = this.state.sidebarVisible
    const arrowRotate = sidebarVisible ? 'rotate' : ''
    const dropDownValue = this.state.dropDownValue

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
              {/* Language */}
              <Dropdown
                name='lang'
                onChange={this.handleDropDownChange}
                placeholder='Language'
                fluid
                search
                multiple
                selection
                options={langOptions}
              />
            </Menu.Item>
            <Menu.Item name='write'>
              <Icon name='write' />
              Author
            </Menu.Item>
            <Menu.Item name='tag'>
              <Icon name='tag' />
              {/* Tags */}
              <Dropdown
                name='tag'
                onChange={this.handleDropDownChange}
                placeholder='Tags'
                fluid
                search
                multiple
                selection
                options={tagOptions}
              />
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
