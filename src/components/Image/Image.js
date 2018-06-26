import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import VisibilitySensor from 'react-visibility-sensor';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    showFavorites: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotationDeg: 0,
      imagesPerRow: 0,
      isFavorite: false,
      showBackgroundImage: true
    };

    this.deleteHandler = this.deleteHandler.bind(this);
    this.rotationHandler = this.rotationHandler.bind(this);
    this.expendHandler = this.expendHandler.bind(this);
    this.showImage = this.showImage.bind(this);
    this.showIcons = this.showIcons.bind(this);

    this.onDragImgHandler = this.onDragImgHandler.bind(this);
    this.onDropImgHandler = this.onDropImgHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);

    this.showBackgroundImage = this.showBackgroundImage.bind(this);
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size,
      imagesPerRow
    });
  }

  componentDidMount() {
    this.calcImageSize();

    window.addEventListener('resize', this.calcImageSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calcImageSize);
  }

  deleteHandler(){
    this.props.deleteImage(this.props.dto);
  }

  rotationHandler() {
    var deg = this.state.rotationDeg+90;

    if(deg === 360){
      deg = 0;
    }
    this.setState({rotationDeg:deg});
  }

  expendHandler(){
    this.props.expendImages(this.props.dto);
  }

  showImage() {
    /* Return true if 'show favorites' button is not active or if it's active and the image is favorited */
    return (!this.props.showFavorites || (this.props.showFavorites && this.state.isFavorite));
  }

  onDragImgHandler(){
    this.props.onDragImg(this.props.dto);
  }

  onDropImgHandler(){
    this.props.onDropImg(this.props.dto);
  }

  dragOverHandler(event){
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();
  }

  showIcons(){
    return !this.props.showFavorites ? 'inline-block' : 'none';
  }

  showBackgroundImage(isVisible){
    this.setState({showBackgroundImage: isVisible })

  }


  render() {

    return (

      <div
        className="image-root"
        draggable={true}
        onDragStart={this.onDragImgHandler}
        onDrop={this.onDropImgHandler}
        onDragOver={this.dragOverHandler}
        style={{
          backgroundImage: this.state.showBackgroundImage ? `url(${this.props.urlFromDto(this.props.dto)})` : 'none',
          width: 100/this.state.imagesPerRow + '%',
          height: this.state.size + 'px',
          transform: 'rotate(' + this.state.rotationDeg + 'deg)',
          display: this.showImage() ? 'inline-block' : 'none'
        }}
        >
        <VisibilitySensor onChange={this.showBackgroundImage} offset={{top:-this.state.size, bottom:-this.state.size}}/>
        <div
          id={this.props.dto.id}
          className={'image-icon-container'}
          style={{transform: 'rotate(-' + this.state.rotationDeg + 'deg)'}}
        >
          <FontAwesome id="rotate-btn" className="image-icon" name="sync-alt" title="rotate" onClick={this.rotationHandler}
                       style={{display: this.showIcons()}}/>
          <FontAwesome id="delete-btn" className="image-icon" name="trash-alt" title="delete" onClick={this.deleteHandler}
                       style={{display: this.showIcons()}}/>
          <FontAwesome id="expand-btn" className="image-icon" name="expand" title="expand" onClick={this.expendHandler}
                       style={{display: this.showIcons()}}/>
          <FontAwesome id="favorite-btn" className={(this.state.isFavorite) ? 'image-icon-favorited' : 'image-icon'}
                       name="heart" title="favorite"
                       onClick= {() => this.setState({isFavorite: !this.state.isFavorite})}
          />
        </div>
      </div>
    );
  }
}

export default Image;
