import React from "react";
import { Button, Icon } from 'semantic-ui-react'
import "./LoaderButton.css";

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Icon name="refresh" loading />}
    {!isLoading ? text : loadingText}
  </Button>;
