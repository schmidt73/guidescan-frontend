import {immutableSetState} from 'utils';

import React from 'react';
import igv from 'igv';

class GenomeBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.igvDiv = React.createRef();

    this.state = {
      creatingBrowser: false,
      browserSettings:
                  {organism: null, coords: null, id: null},
                  browser: null};
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions() {
    const genome = this.props.organism;

    const options = {
      genome: genome || "",
      locus: this.props.coords,
      tracks: [
        {
          "url": process.env.REACT_APP_REST_URL + "/job/result/bed/" + this.props.id,
          "format": "bed"
        }
      ]
    };

    return options;
  }

  // TODO: Fix this code because it has several race conditions.
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.creatingBrowser) return;

    if ((this.props.organism !== this.state.browserSettings.organism ||
         this.props.id !== this.state.browserSettings.id) &&
        (!!this.props.id && !!this.props.organism && !!this.props.coords)) {
      if (this.state.browser) {
        igv.removeBrowser(this.state.browser);
      }

      this.setState({creatingBrowser: true});
      igv.createBrowser(this.igvDiv.current, this.getOptions())
        .then((b) => {
          this.setState({
            creatingBrowser: false,
            browser: b,
            browserSettings: {
              organism: this.props.organism,
              id: this.props.id,
              coords: this.props.coords,
            }});
        });
    }

    if (this.props.coords !== this.state.browserSettings.coords
       && !!this.state.browser) {
      this.state.browser.search(this.props.coords);
      this.setState({browserSettings: {
        organism: this.state.browserSettings.organism,
        id: this.state.browserSettings.id,
        coords: this.props.coords
      }});
    }
  }
  
  render() {
    return <div ref={this.igvDiv}/>;
  }
}

export {GenomeBrowser};
