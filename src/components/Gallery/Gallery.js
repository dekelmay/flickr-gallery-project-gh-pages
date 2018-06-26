import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import FloatingButton from './FloatingButton.js';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    showFavorites: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      photoIndex: 0,
      isLightBoxOpen: false,
      page: 0,
      deletedImages: [],
      draggedImage: null,
      lastTag: '' //The value of last tag is used to know if the source for componentWillReceiveProp call
    };

    this.deleteImage = this.deleteImage.bind(this);
    this.expendImages = this.expendImages.bind(this);
    this.urlFromDto = this.urlFromDto.bind(this); //Moved to this class for the use of both classes Gallery and Image
    this.scrollHandler = this.scrollHandler.bind(this);
    this.undoHandler = this.undoHandler.bind(this);
    this.findDtoInImages = this.findDtoInImages.bind(this);

    this.onDragImg = this.onDragImg.bind(this);
    this.onDropImg = this.onDropImg.bind(this);

  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag, isScrollEvent) {
    const page = (isScrollEvent) ? this.state.page+1 : 1;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&page=${page}&per_page=100&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {

          this.setState((prevState) => ({
           images: (isScrollEvent) ? prevState.images.concat(res.photos.photo.filter(dto => !this.findDtoInImages(dto.id, 'images'))) :
             res.photos.photo.filter(dto => !this.findDtoInImages(dto.id, 'deletedImages')), // filter out existing (duplicate) images
           page,
           lastTag: tag
         }));
        }
      });
  }

  findDtoInImages(dto, arrType){
    var arrImages;
    if(arrType === 'images')
      arrImages = this.state.images;
    else if( arrType === 'deletedImages')
      arrImages = this.state.deletedImages;

    for(var i = 0 ; i < arrImages.length ; i++){
      var img = arrImages[i];
      if(dto === img.id)
        return img;
    }
    return null;
  }

  componentDidMount() {
    this.getImages(this.props.tag, false);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('resize', () => this.setState({galleryWidth: this.getGalleryWidth()}));
    window.addEventListener('scroll', this.scrollHandler);

  }

  componentWillReceiveProps(props) {
    if(this.state.lastTag !== props.tag) {
      this.getImages(props.tag, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.setState({galleryWidth: this.getGalleryWidth()}));
    window.removeEventListener('scroll', this.scrollHandler);
  }

  deleteImage(imgDto){

    this.setState({
      images: this.state.images.splice(this.state.images.indexOf(imgDto),1),
      deletedImages: this.state.deletedImages.concat([imgDto])
    });
  }

  undoHandler() {
    const lastImage = this.state.deletedImages.pop();
    this.setState({
      images: [lastImage].concat(this.state.images)
    });
  }

  expendImages(imgDto){
    this.setState({ photoIndex: this.state.images.indexOf(imgDto), isLightBoxOpen: true });
  }


  urlFromDto(dto) {
    /*I brought this function to this class for the use in lightbox*/
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  scrollHandler() {
    // Get the navbar
    var navbar = document.getElementById('navbar');
    // Get the offset height of the app-header
    var sticky = document.getElementById('app-header').offsetHeight;
    if (window.pageYOffset >= sticky) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }

    if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight)
      this.getImages(this.props.tag, true);

  }

  onDragImg(dto){
      this.setState({draggedImage: dto});
  }

  onDropImg(dto) {
    const {
      images,
      draggedImage
    } = this.state;

    if ( draggedImage ) {
      var draggedIndex = images.indexOf(draggedImage);
      var targetIndex = images.indexOf(dto);

      images.splice(draggedIndex, 1);
      images.splice(targetIndex, 0, draggedImage);

      this.setState({
        draggedImage: null
      });

    }
  }

  render() {
    const{
      images,
      photoIndex,
      isLightBoxOpen
    } = this.state;
    const showUndoBtn = this.state.deletedImages.length !== 0;

    return (
      <div className="gallery-root">

        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
                        urlFromDto={this.urlFromDto} deleteImage={this.deleteImage} expendImages={this.expendImages}
                        showFavorites={this.props.showFavorites} onDragImg={this.onDragImg}
                        onDropImg={this.onDropImg}/>;
        })}

        {isLightBoxOpen && (
          <Lightbox
            mainSrc={this.urlFromDto(images[photoIndex])}
            nextSrc={this.urlFromDto(images[(photoIndex + 1) % images.length])}
            prevSrc={this.urlFromDto(images[(photoIndex + images.length - 1) % images.length])}
            onCloseRequest={() => this.setState({ isLightBoxOpen: false })}
            onMovePrevRequest={() => this.setState({photoIndex: (photoIndex + images.length - 1) % images.length})}
            onMoveNextRequest={() => this.setState({photoIndex: (photoIndex + 1) % images.length})}
          />
        )}

        {showUndoBtn && (
          <FloatingButton handleClick={this.undoHandler} name="undo-alt" title="undo" />
        )}

      </div>
    );
  }
}

export default Gallery;
