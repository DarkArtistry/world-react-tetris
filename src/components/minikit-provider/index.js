import React from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import propTypes from "prop-types";

export default class MiniKitProvider extends React.Component {
  componentDidMount() {
    MiniKit.install();
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

MiniKitProvider.propTypes = {
  children: propTypes.node.isRequired,
};
