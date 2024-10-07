import React from "react";
import * as style from "./index.less";

import todo from "../../control/todo";
import store from "../../store";

class Draggable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      dragDirection: null, // Store the direction of drag (horizontal or vertical)
    };
  }

  handleMouseDown = (e) => {
    e.preventDefault();
    this.setState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      dragDirection: null, // Reset the direction on mouse down
    });
  };

  handleMouseMove = (e) => {
    const { isDragging, startX, startY, dragDirection } = this.state;
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Determine the drag direction
    if (dragDirection === null) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Set drag direction to horizontal
        this.setState({ dragDirection: "horizontal" });
      } else {
        // Set drag direction to vertical
        this.setState({ dragDirection: "vertical" });
        if (e.clientY > this.state.startY) {
          todo.down.down(store);
        }
      }
    }

    // Update starting positions for continuous drag detection
    this.setState({
      endX: e.clientX,
      endY: e.clientY,
    });
  };

  handleMouseUp = () => {
    const { dragDirection } = this.state;

    if (dragDirection === "horizontal") {
      // Call horizontal drag functions based on the last drag direction
      if (this.state.endX > this.state.startX) {
        this.onDragRight();
      } else {
        this.onDragLeft();
      }
    } else if (dragDirection === "vertical") {
      // Call vertical drag functions based on the last drag direction
      if (this.state.endY > this.state.startY) {
        this.onDragDown();
      } else {
        this.onDragUp();
      }
    }

    this.setState({ isDragging: false, dragDirection: null }); // Reset direction on mouse up
  };

  handleMouseClick = () => {
    const { startX, startY, endX, endY, dragDirection } = this.state;
    console.log(startX, startY, endX, endY, dragDirection);
    if (endX === 0 && endY === 0 && dragDirection === null) {
      this.onDragUp();
    }
  };

  onDragLeft = () => {
    todo.left.down(store);
    setTimeout(() => {
      todo.left.up(store);
      this.setState({
        endX: 0,
        endY: 0,
        dragDirection: null,
      });
    }, 100);
  };

  onDragRight = () => {
    todo.right.down(store);
    setTimeout(() => {
      todo.right.up(store);
      this.setState({
        endX: 0,
        endY: 0,
        dragDirection: null,
      });
    }, 100);
  };

  onDragUp = () => {
    todo.rotate.down(store);
    setTimeout(() => {
      todo.rotate.up(store);
      this.setState({
        endX: 0,
        endY: 0,
        dragDirection: null,
      });
    }, 100);
  };

  onDragDown = () => {
    todo.down.up(store);
    this.setState({
      endX: 0,
      endY: 0,
      dragDirection: null,
    });
  };

  componentDidMount() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    return (
      <div
        className={style.draggable}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleMouseClick}
      />
    );
  }
}

export default Draggable;
