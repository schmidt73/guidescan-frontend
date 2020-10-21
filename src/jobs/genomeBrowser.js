import {immutableSetState} from 'utils';
import {JobResultsState} from 'jobs/results';

import React from 'react';
import igv from 'igv';

class GenomeBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.igvDiv = React.createRef();
    this.state = {browserLoaded: false};

    this.getOptions = this.getOptions.bind(this);
  }

  getOptions() {
    const locus = this.props.jobresults.data[0][0].name;
    const genome = this.props.jobresults.data[0][0].organism;

    const options = {
      genome: genome || "",
      locus: locus || "",
      tracks: [
        {
          "url": process.env.REACT_APP_REST_URL + "/job/result/bed/" + this.props.id,
          "format": "bed"
        }
      ]
    };

    return options;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.jobresults.status !== JobResultsState.RECEIVED) {
      return;
    }

    if (!this.state.browserLoaded) {
      igv.createBrowser(this.igvDiv.current, this.getOptions())
        .then((b) => immutableSetState(this, "browser", b));
      this.setState({browserLoaded: true});
    }

    if (prevProps.id !== this.props.id) {
      this.state.browser.removeBrowser();
      igv.createBrowser(this.igvDiv.current, this.getOptions())
        .then((b) => immutableSetState(this, "browser", b));
    }

    if (prevProps.coord !== this.props.coord) {
      this.state.browser.search(this.props.coord);
    }


  }
  
  render() {
    return <div ref={this.igvDiv}/>;
  }
}

export {GenomeBrowser};
