import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import FontAwesome from 'react-fontawesome';


class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
      showFavorites: false // true if the 'show favorites' is active, otherwise false
    };
  }

  render() {
    return (
      <div className="app-root">
        <div id='app-header' className="app-header">
          <h2>Flickr Gallery</h2>
          <div id='navbar'>
            <input
              className="app-input"
              onChange={event => this.setState({tag: event.target.value, showFavorites: false})}
              value={this.state.tag}
            />

            <FontAwesome
              className= {(this.state.showFavorites) ? 'app-icon-fav-active' : 'app-icon'}
              name="heart" title="show tag favorites"
              /*This button shows favorited images.
              In favorites images the only icon being displayed is the favorite button*/
              onClick= {() => this.setState({showFavorites: !this.state.showFavorites})}
            />
          </div>
        </div>

        <Gallery
          tag={this.state.tag}
          showFavorites={this.state.showFavorites}
        />
      </div>
    );
  }
}

export default App;
