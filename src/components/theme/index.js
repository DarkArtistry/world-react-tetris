import React, { Component } from "react";
import { i18n, lan, themeColors } from "../../unit/const";
import * as style from "./index.less";
import states from "../../control/states";

export default class Theme extends Component {
  handleBackgroundColorChange = (event) => {
    states.backgroundColor(event.target.value);
  };

  handleButtonColorChange = (event) => {
    states.buttonColor(event.target.value);
  };

  handleArrowPositionChange = (event) => {
    states.arrowPosition(event.target.value);
  };

  handleSound = (event) => {
    const { value } = event.target;
    states.sound(value === "on" ? true : false);
  };

  render() {
    const { theme, music } = this.props;

    return (
      <div>
        <h3 className={style.textCenter}>{i18n.theme[lan]}</h3>
        <div className={style.themeForm}>
          <p>{i18n.backgroundColor[lan]}</p>
          <div className={style.radioGroup}>
            {themeColors.map((color, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`background-color-${index}`}
                  name="background-color"
                  value={color.code}
                  checked={theme.backgroundColor === color.code}
                  onChange={this.handleBackgroundColorChange}
                  onTouchStart={this.handleBackgroundColorChange}
                />
                <label htmlFor={`background-color-${index}`}>
                  {color.name}
                </label>
              </div>
            ))}
          </div>
          <p>{i18n.buttonColor[lan]}</p>
          <div className={style.radioGroup}>
            {themeColors.map((color, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`button-color-${index}`}
                  name="button-color"
                  value={color.code}
                  checked={theme.buttonColor === color.code}
                  onChange={this.handleButtonColorChange}
                  onTouchStart={this.handleButtonColorChange}
                />
                <label htmlFor={`button-color-${index}`}>{color.name}</label>
              </div>
            ))}
          </div>

          <p>{i18n.arrowPosition[lan]}</p>
          <div className={style.radioGroup}>
            {["left", "right"].map((pos, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`arrow-pos-${pos}`}
                  name="arrow-pos"
                  value={pos}
                  checked={theme.arrowPosition === pos}
                  onChange={this.handleArrowPositionChange}
                  onTouchStart={this.handleArrowPositionChange}
                />
                <label htmlFor={`arrow-pos-${pos}`}>{pos}</label>
              </div>
            ))}
          </div>
          <p>{i18n.sound[lan]}</p>
          <div className={style.radioGroup}>
            <div>
              <input
                type="radio"
                id={`music-on`}
                name="music"
                value={"on"}
                checked={music === true}
                onChange={this.handleSound}
                onTouchStart={this.handleSound}
              />
              <label htmlFor={`music-on`}>On</label>
            </div>
            <div>
              <input
                type="radio"
                id={`music-off`}
                name="music"
                value={"off"}
                checked={music === false}
                onChange={this.handleSound}
                onTouchStart={this.handleSound}
              />
              <label htmlFor={`music-off`}>Off</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
