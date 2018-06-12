import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Lightbox from 'react-image-lightbox';
import { render } from "react-dom";
import InfiniteScroll from 'react-infinite-scroller';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      photoIndex: 0,
      isLightBoxOpen: false,
      pageNum: 1,
      hasMoreImages: true,
      isLoading: true,
      imagesIds: new Set(),

    };
    this.deleteImage = this.deleteImage.bind(this);
    this.expendImges = this.expendImges.bind(this);
    this.urlFromDto = this.urlFromDto.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleDupAndDelImages = this.handleDupAndDelImages.bind(this);
    this.getImages = this.getImages.bind(this);
    this.getGalleryWidth = this.getGalleryWidth.bind(this);
    this.handleSize = this.handleSize.bind(this);

  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    this.setState({isLoading: true});
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&page=${this.state.pageNum}&per_page=100&format=json&nojsoncallback=1`;
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
          this.handleDupAndDelImages(res.photos.photo);
        }else{
          this.setState({hasMoreImages: false});
        }
      });
  }

  componentDidMount() {  
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth,
    });
    window.addEventListener("resize", this.handleSize);
  }

  componentWillReceiveProps(props) {
    this.setState({images:[], imagesIds: new Set(), pageNum: 1});
    this.getImages(props.tag);
  }

  componentWillUnmount (){
    window.addEventListener("resize", this.getGalleryWidth);
    window.removeEventListener("resize", this.handleSize);
  }

  handleSize(){
    var sizeWindow = this.getGalleryWidth();
    this.setState({galleryWidth: sizeWindow});
  }
  
  handleDupAndDelImages(resPhotos){
    var noDupImages = this.state.images;
    var ids = this.state.imagesIds;
    
    resPhotos.forEach(function(item){
      if(!ids.has(item.id)){
        ids.add(item.id);
        noDupImages.push(item);
      }
    });
    this.setState({images: noDupImages, imagesIds:ids, isLoading: false});
  }

  deleteImage(imgDto){
    this.state.images.splice(this.state.images.indexOf(imgDto),1);
    this.setState({images: this.state.images});
  }

  expendImges(imgDto){
    this.setState({ photoindex: this.state.images.indexOf(imgDto), isLightBoxOpen: true });
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleScroll(){
      if(!this.state.isLoading){
        var newPageNum = this.state.pageNum+1;
        this.setState({pageNum: newPageNum});
        this.getImages(this.props.tag);
     }
  }

  render() {
    const{  images,
            photoindex,
            isOpen,
        } = this.state;

    return (
      <div className="gallery-root">
         
        <InfiniteScroll
              threshold={1000}
              pageStart={0}
              loadMore={this.handleScroll}
              hasMore={this.state.hasMoreImages}
              loader={<div key="loading" className="loader">Loading ...</div>}>

              {this.state.images.map(dto => {
                return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
                deleteImage={this.deleteImage} expendImages={this.expendImges}
                picture={this.urlFromDto(dto)}/>;
              })}
              
          </InfiniteScroll>

          {this.state.isLightBoxOpen && (
            <Lightbox
              enableZoom={false}
              mainSrc={this.urlFromDto(images[photoindex])}
              nextSrc={this.urlFromDto(this.state.images[(photoindex + 1) % images.length])}
              prevSrc={this.urlFromDto(images[(photoindex + images.length - 1) % images.length])}
              onCloseRequest={() => this.setState({ isLightBoxOpen: false })}
              onMovePrevRequest={() => this.setState({photoindex: (photoindex + images.length - 1) % images.length})}
              onMoveNextRequest={() => this.setState({photoindex: (photoindex + 1) % images.length})}
            />
          )}
       
      </div>
    );
  }
}

export default Gallery;
