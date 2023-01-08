import React from 'react';

class SortButtons extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {this.props.text}
        <div onClick={this.props.onSortUp} style={{cursor: "pointer"}}>&uarr;</div>
        <div onClick={this.props.onSortDown} style={{cursor: "pointer"}}>&darr;</div>
      </div>
    );
  }
}

export default SortButtons;