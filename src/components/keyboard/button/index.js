import React from "react";
import cn from "classnames";
import propTypes from "prop-types";

import * as style from "./index.less";
import { transform } from "../../../unit/const";

export default class Button extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.active !== this.props.active ||
      nextProps.backgroundColor !== this.props.backgroundColor ||
      nextProps.top !== this.props.top ||
      nextProps.left !== this.props.left ||
      nextProps.position !== this.props.position ||
      nextProps.positionRight !== this.props.positionRight
    );
  }

  render() {
    const {
      active,
      color,
      size,
      top,
      left,
      label,
      position,
      positionRight,
      arrow,
      backgroundColor,
    } = this.props;

    return (
      <div
        className={cn({
          [style.button]: true,
          [style[color]]: true,
          [style[size]]: true,
        })}
        style={{ top, left }}
      >
        <i
          style={{ backgroundColor }}
          className={cn({ [style.active]: active })}
          ref={(c) => {
            this.dom = c;
          }}
        />
        {size === "s1" && (
          <em
            style={{
              [transform]: `${arrow} scale(1,2)`,
            }}
          />
        )}
        <span
          className={cn({
            [style.position]: position,
            [style.positionRight]: positionRight,
          })}
        >
          {label}
        </span>
      </div>
    );
  }
}

Button.propTypes = {
  color: propTypes.string.isRequired,
  size: propTypes.string.isRequired,
  top: propTypes.number.isRequired,
  left: propTypes.number.isRequired,
  label: propTypes.string.isRequired,
  position: propTypes.bool,
  positionRight: propTypes.bool,
  arrow: propTypes.string,
  active: propTypes.bool.isRequired,
  backgroundColor: propTypes.string,
};
