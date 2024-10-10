import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import propTypes from "prop-types";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import * as style from "./index.less";

import Matrix from "../components/matrix";
import Decorate from "../components/decorate";
import Number from "../components/number";
import Next from "../components/next";
import Music from "../components/music";
import Pause from "../components/pause";
import Point from "../components/point";
import Logo from "../components/logo";
import Keyboard from "../components/keyboard";
// import Guide from '../components/guide';

import {
  transform,
  lastRecord,
  speeds,
  i18n,
  lan,
  themeColors,
} from "../unit/const";
import { visibilityChangeEvent, isFocus } from "../unit";
import states from "../control/states";
import Draggable from "../components/draggable";
import Leaderboard from "../components/leaderboard";
import lightenColor from "../utils/lightenColor";
import Button from "../components/button";
import WhiteButton from "../components/whitebutton";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this); // Add this line
    this.sendPayment = this.sendPayment.bind(this); // Add this line
  }

  componentWillMount() {
    MiniKit.install();
    window.addEventListener("resize", this.resize.bind(this), true);
  }

  componentDidMount() {
    if (visibilityChangeEvent) {
      // 将页面的焦点变换写入store
      document.addEventListener(
        visibilityChangeEvent,
        () => {
          states.focus(isFocus());
        },
        false
      );
    }

    if (lastRecord) {
      // 读取记录
      if (lastRecord.cur && !lastRecord.pause) {
        // 拿到上一次游戏的状态, 如果在游戏中且没有暂停, 游戏继续
        const { speedRun } = this.props;
        let timeout = speeds[speedRun - 1] / 2; // 继续时, 给予当前下落速度一半的停留时间
        // 停留时间不小于最快速的速度
        timeout =
          speedRun < speeds[speeds.length - 1]
            ? speeds[speeds.length - 1]
            : speedRun;
        states.auto(timeout);
      }
      if (!lastRecord.cur) {
        states.overStart();
      }
    } else {
      states.overStart();
    }
  }

  handleButtonClick() {
    this.sendPayment();
  }

  async sendPayment() {
    console.log("MiniKit.isInstalled() 2: ", MiniKit.isInstalled());
    // const res = await fetch('/api/initiate-payment', {
    // method: 'POST',
    // });
    // const { id } = await res.json();

    const uuid = crypto.randomUUID().replace(/-/g, "");

    const payload = {
      reference: uuid,
      to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Test address
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
        },
      ],
      description: "Test example payment for minikit",
    };

    if (MiniKit.isInstalled()) {
      MiniKit.commands.pay(payload);
    }
  }

  resize() {
    this.setState({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }
  handleBackgroundColorChange = (event) => {
    states.backgroundColor(event.target.value);
  };

  handleButtonColorChange = (event) => {
    states.buttonColor(event.target.value);
  };

  handleArrowPositionChange = (event) => {
    states.arrowPosition(event.target.value);
  };

  render() {
    let filling = 0;
    const size = (() => {
      const { w } = this.state;
      const { h } = this.state;
      const ratio = h / w;
      let scale;
      let css = {};
      if (ratio < 1.5) {
        scale = h / 960;
      } else {
        scale = w / 640;
        filling = (h - 960 * scale) / scale / 3;
        css = {
          paddingTop: Math.floor(filling) + 42,
          paddingBottom: Math.floor(filling),
          marginTop: Math.floor(-480 - filling * 1.5),
        };
      }
      css[transform] = `scale(${scale})`;
      return css;
    })();
    const { theme, pause, cur } = this.props;

    return (
      <div
        className={style.app}
        style={{ ...size, backgroundColor: theme.backgroundColor }}
      >
        <div
          className={classnames({
            [style.rect]: true,
            [style.drop]: this.props.drop,
          })}
        >
          <div className={style.buttonContainer}>
            <WhiteButton
              onTouchStart={(e) => {
                console.log("event : ", e);
                e.preventDefault();
                this.handleButtonClick();
              }}
            >
              Support Development by Donating 1 WLD
            </WhiteButton>
          </div>
          <Decorate />

          <div
            className={style.screen}
            style={{ borderColor: lightenColor(theme.backgroundColor) }}
          >
            {!theme.isTheme && !pause && cur && <Draggable />}
            <div className={style.panel}>
              {theme.isTheme ? (
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
                          <label htmlFor={`button-color-${index}`}>
                            {color.name}
                          </label>
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
                  </div>
                </div>
              ) : (
                <div>
                  <Leaderboard />
                  <Matrix
                    matrix={this.props.matrix}
                    cur={this.props.cur}
                    reset={this.props.reset}
                  />
                  <Logo cur={!!this.props.cur} reset={this.props.reset} />
                  <div className={style.state}>
                    <Point
                      cur={!!this.props.cur}
                      point={this.props.points}
                      max={this.props.max}
                    />
                    <p>
                      {this.props.cur ? i18n.cleans[lan] : i18n.startLine[lan]}
                    </p>
                    <Number
                      number={
                        this.props.cur
                          ? this.props.clearLines
                          : this.props.startLines
                      }
                    />
                    <p>{i18n.level[lan]}</p>
                    <Number
                      number={
                        this.props.cur
                          ? this.props.speedRun
                          : this.props.speedStart
                      }
                      length={1}
                    />
                    <p>{i18n.next[lan]}</p>
                    <Next data={this.props.next} />
                    <div className={style.bottom}>
                      <Music data={this.props.music} />
                      <Pause data={this.props.pause} />
                      <Number time />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Keyboard filling={filling} keyboard={this.props.keyboard} />
        {/* <Guide /> */}
      </div>
    );
  }
}

App.propTypes = {
  music: propTypes.bool.isRequired,
  pause: propTypes.bool.isRequired,
  matrix: propTypes.object.isRequired,
  next: propTypes.string.isRequired,
  cur: propTypes.object,
  dispatch: propTypes.func.isRequired,
  speedStart: propTypes.number.isRequired,
  speedRun: propTypes.number.isRequired,
  startLines: propTypes.number.isRequired,
  clearLines: propTypes.number.isRequired,
  points: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  reset: propTypes.bool.isRequired,
  drop: propTypes.bool.isRequired,
  theme: propTypes.object.isRequired,
  keyboard: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pause: state.get("pause"),
  music: state.get("music"),
  matrix: state.get("matrix"),
  next: state.get("next"),
  cur: state.get("cur"),
  speedStart: state.get("speedStart"),
  speedRun: state.get("speedRun"),
  startLines: state.get("startLines"),
  clearLines: state.get("clearLines"),
  points: state.get("points"),
  max: state.get("max"),
  reset: state.get("reset"),
  drop: state.get("drop"),
  theme: state.get("theme"),
  keyboard: state.get("keyboard"),
  lock: state.get("lock"),
});

export default connect(mapStateToProps)(App);
