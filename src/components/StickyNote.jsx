// StickyNote.jsx
import React, { Component } from 'react';
import Draggable from 'react-draggable';

class StickyNote extends Component {
  render() {
    const {
      title = 'Reminder',
      content = "Don't forget to add interactivity!",
      top = '100px',
      left = '100px',
      width = '200px',
      height = '200px',
      backgroundColor = 'yellow',
    } = this.props;

    return (
      <Draggable>
        <div
          style={{
            width,
            height,
            backgroundColor,
            padding: '20px',
            position: 'absolute',
            top,
            left,
            boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
          }}
        >
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
      </Draggable>
    );
  }
}

export default StickyNote;
