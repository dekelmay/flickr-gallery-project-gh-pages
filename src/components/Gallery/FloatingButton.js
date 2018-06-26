import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import './FloatingButton.scss'

class FloatingButton extends React.Component {
  static propTypes = {
    handleClick: PropTypes.func,
    name: PropTypes.string,
    title: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FontAwesome className="float" name={this.props.name} title={this.props.title} onClick={() =>  this.props.handleClick() } />
    );
  }
}

export default FloatingButton;
