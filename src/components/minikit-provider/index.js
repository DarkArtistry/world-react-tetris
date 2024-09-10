import React from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default class MiniKitProvider extends React.Component {
  componentDidMount() {
    MiniKit.install();
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}