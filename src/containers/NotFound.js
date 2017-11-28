import React from "react";
import { Image } from 'semantic-ui-react'
import "./NotFound.css";
import imageUrl from '../images/matthew-henry-20172.jpg'

export default () =>
  <div className="NotFound">
    <h3>Sorry, page not found!</h3>
    <Image src={imageUrl} fluid />
    <p>Photo by Matthew Henry on Unsplash</p>
  </div>;
