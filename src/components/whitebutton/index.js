import React, { Component } from "react";
import classNames from "classnames";
import * as style from "./index.less";

class WhiteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInverse: false,
    };
  }

  handleClick = () => {
    this.props.onMouseDown();
  };

  render() {
    const { isInverse } = this.state;
    const { children, isActive, disabled } = this.props;

    return (
      <button
        type="button"
        className={classNames(style.button, {
          [style.inverse]: isInverse || isActive,
        })}
        disabled={disabled}
        onMouseDown={this.handleClick}
      >
        {children}
      </button>
    );
  }
}

export default WhiteButton;
