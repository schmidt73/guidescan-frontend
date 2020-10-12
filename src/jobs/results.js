import * as R from 'ramda';

import {getJobResults} from 'jobs/rest';
import {immutableSetState} from 'utils';

import React from 'react';

const JobResultsState = {
  PENDING:  1,
  ERROR:    2,
  RECEIVED: 3,
};

class JobResultsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onLoadSuccess = this.onLoadSuccess.bind(this);
    this.onLoadFailure = this.onLoadFailure.bind(this);

    this.loadJobResults = (id) =>
      getJobResults(this.onLoadSuccess,
                    this.onLoadFailure,
                    'json', id);

    this.state = {
      status: JobResultsState.PENDING
    };
  }

  componentDidMount() {
    this.loadSource = this.loadJobResults(this.props.id);
  }

  componentWillUnmount() {
    this.loadSource.cancel();
  }

  onLoadSuccess(response) {
    immutableSetState(this, {status: JobResultsState.RECEIVED,
                             data: response.data});
  }

  onLoadFailure(error) {
    immutableSetState(this, {status: JobResultsState.ERROR});
  }

  render() {
    let jobResults = {status: this.state.status}
    if (this.state.status === JobResultsState.RECEIVED) {
      jobResults.data = this.state.data;
    }

    const childrenWithProps = React.Children.map(this.props.children, child => {
      const props = R.mergeRight(child.props, { jobResults: jobResults });
      if (React.isValidElement(child)) {
        return React.cloneElement(child, props);
      }
      return child;
    });

    return childrenWithProps;
  }
}

export {JobResultsContainer, JobResultsState};
