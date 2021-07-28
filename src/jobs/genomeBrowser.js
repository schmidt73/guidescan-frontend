import {immutableSetState} from 'utils';

import React from 'react';
import igv from 'igv';

class GenomeBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.igvDiv = React.createRef();
    this.state = {browser: null, browserState: {organism: null, coords: null}};
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions() {
    const genome = this.props.organism;
    console.log(genome);

    const options = {
      genome: genome,
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

  componentDidMount() {
    igv.createBrowser(this.igvDiv.current, this.getOptions()).then((b) => {
        if(!this._ismounted) return;
        this.setState({browser: b});
        this.state.browser.search(this.props.coords);
    });

    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    if (this.state.browser) this.state.browser.search(this.props.coords);

    return <div ref={this.igvDiv}/>;
  }


}

export {GenomeBrowser};
