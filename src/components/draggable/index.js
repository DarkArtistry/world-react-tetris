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

  // Helper to get the coordinates from mouse or touch events
  getEventCoordinates = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  handleStart = (e) => {
    e.preventDefault();
    const { clientX, clientY } = this.getEventCoordinates(e);
    this.setState({
      isDragging: true,
      startX: clientX,
      startY: clientY,
      dragDirection: null, // Reset the direction on start
    });
  };

  handleMove = (e) => {
    const { isDragging, startX, startY, dragDirection } = this.state;
    if (!isDragging) return;

    const { clientX, clientY } = this.getEventCoordinates(e);
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    // Determine the drag direction
    if (dragDirection === null) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Set drag direction to horizontal
        this.setState({ dragDirection: "horizontal" });
      } else {
        // Set drag direction to vertical
        this.setState({ dragDirection: "vertical" });
        if (clientY > this.state.startY) {
          todo.down.down(store);
        }
      }
    }

    // Update starting positions for continuous drag detection
    this.setState({
      endX: clientX,
      endY: clientY,
    });
  };

  handleEnd = () => {
    const { dragDirection, endX, startX, endY, startY } = this.state;
    this.handleMouseClick();

    if (dragDirection === "horizontal") {
      if (endX > startX) {
        this.onDragRight();
      } else {
        this.onDragLeft();
      }
    } else if (dragDirection === "vertical") {
      if (endY > startY) {
        this.onDragDown();
      } else {
        this.onDragUp();
      }
    }

    // Reset drag state
    this.setState({ isDragging: false, dragDirection: null });
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
    // Mouse events
    document.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", this.handleEnd);

    // Touch events
    document.addEventListener("touchmove", this.handleMove);
    document.addEventListener("touchend", this.handleEnd);
  }

  componentWillUnmount() {
    // Mouse events
    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.handleEnd);

    // Touch events
    document.removeEventListener("touchmove", this.handleMove);
    document.removeEventListener("touchend", this.handleEnd);
  }

  render() {
    return (
      <div
        className={style.draggable}
        onMouseDown={this.handleStart} // Start drag on mouse down
        onTouchStart={this.handleStart} // Start drag on touch start
        // onClick={this.handleMouseClick}
      />
    );
  }
}

export default Draggable;
