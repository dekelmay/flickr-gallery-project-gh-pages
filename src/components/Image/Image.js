import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';


class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      size: 200,
      rotationDeg: 0,
    };
    this.handleRotation = this.handleRotation.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleExpend = this.handleExpend.bind(this);
    this.calcImageSize = this.calcImageSize.bind(this);
  }

  calcImageSize() {
    const galleryWidth = this.props.galleryWidth;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
    window.addEventListener("resize", this.calcImageSize);
  }

  componentWillUnmount (){
    window.removeEventListener("resize", this.calcImageSize);
  }

  handleDelete(){
    this.props.deleteImage(this.props.dto);
  }

  handleRotation() {
    var deg = this.state.rotationDeg+90;

    if(deg === 360){
      deg = 0;
    }
    this.setState({rotationDeg:deg});
  }

  handleExpend(){
    this.props.expendImages(this.props.dto);
  }
  
  render() {
    
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.props.picture})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: "rotate(" + this.state.rotationDeg + "deg)",
        }}
        >
        <div style={{transform: "rotate(-" + this.state.rotationDeg + "deg)"}}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.handleRotation}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.handleDelete}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.handleExpend}/>
        </div>
      </div>
    );
  }
}

export default Image;
