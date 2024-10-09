import React, { Component } from "react";
import classNames from "classnames";
import * as style from "./index.less";

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInverse: false,
    };
  }

  handleClick = () => {
    this.setState({ isInverse: true });
    setTimeout(() => {
      this.setState({ isInverse: false });
    }, 1000);
    this.props.onClick();
  };

  render() {
    const { isInverse } = this.state;
    const { children } = this.props;

    return (
      <div className={style.buttonContainer}>
        <button
          type="button"
          className={classNames(style.button, {
            [style.inverse]: isInverse,
          })}
          onClick={this.handleClick}
        >
          {children}
        </button>
      </div>
    );
  }
}

export default Button;
