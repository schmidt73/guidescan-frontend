import {immutableSetState} from '../utils';

import React from 'react';
import igv from 'igv';

class GenomeBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.igvDiv = React.createRef();
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions() {
    const genome = this.props.organism;

    const options = {
      genome: genome,
      locus: this.props.coords,
      tracks: [
        {
          "url": "/backend/job/result/bed/" + this.props.id,
          "format": "bed"
        }
      ]
    };

    return options;
  }

  componentDidMount() {
    igv.createBrowser(this.igvDiv.current, this.getOptions()).then((b) => {
        b.search(this.props.coords);
    });
  }

  render() {
    return <div ref={this.igvDiv}/>;
  }
}

export {GenomeBrowser};
