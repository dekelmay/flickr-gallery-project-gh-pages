// import 'jsdom-global/register';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import Image from './Image.js';
import Gallery from '../Gallery';

describe('Image', () => {

  const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};

  let wrapper;
  const galleryWidth = 1111;
  const gallery = new Gallery({});

  const mountImage = () => {
    return shallow(
      <Image dto={sampleImage} galleryWidth={galleryWidth} urlFromDto={gallery.urlFromDto}
             deleteImage={gallery.deleteImage} expendImages={gallery.expendImages}
             showFavorites={gallery.props.showFavorites} onDragImg={gallery.onDragImg}
             onDropImg={gallery.onDropImg}/>,
      {lifecycleExperimental: true, attachTo: document.createElement('div')}
    );
  };

  beforeEach(() => {
    wrapper = mountImage();
  });

  it('render 4 icons on each image', () => {
    expect(wrapper.find('FontAwesome').length).to.equal(4);
  });

  it('calc image size on mount', () => {
    const spy = sinon.spy(Image.prototype, 'calcImageSize');
    wrapper = mountImage();
    expect(spy.called).to.be.true;
  });

  it('calculate image size correctly', () => {
    const imageSize = wrapper.state().size;
    const remainder = galleryWidth % imageSize;
    expect(remainder).to.be.lessThan(1);
  });

  it('check if deleteHandler function was called when clicked ', () => {
    const spy = sinon.spy(Image.prototype, 'deleteHandler');
    wrapper = mountImage();
    wrapper.find('#delete-btn').simulate('click');
    expect(spy.called).to.be.true;
  });

  it('check if expendHandler function was called when clicked ', () => {
    const spy = sinon.spy(Image.prototype, 'expendHandler');
    wrapper = mountImage();
    wrapper.find('#expand-btn').simulate('click');
    expect(spy.called).to.be.true;
  });

  it('check if rotationHandler function was called when clicked ', () => {
    const spy = sinon.spy(Image.prototype, 'rotationHandler');
    wrapper = mountImage();
    wrapper.find('#rotate-btn').simulate('click');
    expect(spy.called).to.be.true;
  });

  it('check if isFavorite was changed when clicked on favorite button ', () => {
    wrapper.find('#favorite-btn').simulate('click');
    const isFavorite = wrapper.state().isFavorite;
    expect(isFavorite).to.be.true;
  });

  it('check if rotation was changed when clicked ', () => {
    wrapper.find('#rotate-btn').simulate('click');
    const rotation = wrapper.state().rotationDeg;
    expect(rotation).to.equal(90);
  });

});
