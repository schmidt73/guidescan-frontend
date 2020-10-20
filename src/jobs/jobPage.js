import {JobCompletedPage} from 'jobs/completedPage';
import {GenomeBrowser} from 'jobs/genomeBrowser';

import {immutableSetState} from 'utils';
import {getJobStatus, submitQuery} from 'jobs/rest';

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const JobStatus = {
  UNKNOWN: 1,
  NOT_FOUND: 2,
  PENDING: 3,
  COMPLETED: 4,
  FAILED: 5
};

const UPDATE_INTERVAL = 1000;

class JobPage extends React.Component {
  constructor(props) {
    super(props);

    this.onJobStatusSuccess = this.onJobStatusSuccess.bind(this);
    this.onJobStatusError = this.onJobStatusError.bind(this);
    this.updateJobStatus = (id) => () =>
      this.updateSource = getJobStatus(this.onJobStatusSuccess,
                                       this.onJobStatusError,
                                       id);

    this.state = {
      job_status: JobStatus.UNKNOWN,
    };
  }

  componentDidMount() {
    const update = this.updateJobStatus(this.props.id);
    update();
    this.statusInterval = setInterval(update, UPDATE_INTERVAL);
  }

  componentDidUpdate() {
    this.updateSource.cancel();

    clearInterval(this.statusInterval);
    const update = this.updateJobStatus(this.props.id);
    update();
    this.statusInterval = setInterval(update, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.statusInterval);
    this.updateSource.cancel();
  }

  onJobStatusError(error) {
    immutableSetState(this, {job_status: JobStatus.NOT_FOUND});

  }

  onJobStatusSuccess(response) {
    const status = response.data["job-status"];

    if (status === "pending") {
      immutableSetState(this, {job_status: JobStatus.PENDING});
    } else if (status === "completed") {
      immutableSetState(this, {job_status: JobStatus.COMPLETED});
    } else if (status === "failed") {
      const failure_msg = response.data["failure"];
      immutableSetState(this, {job_status: JobStatus.FAILED,
                               job_err_msg: failure_msg});
    } else {
      immutableSetState(this, {job_status: JobStatus.UNKNOWN});
    }
  }

  render() {
    const center_style = {textAlign: "center"};
    const padding_style = (p) => ({padding: p});

    let page = null;
    switch (this.state.job_status) {
    case JobStatus.PENDING:
      page = (
        <>
          <h4 style={center_style}>Job Pending</h4>
          <hr/>
          <div className="alert alert-warning">
            Job is currently pending.
          </div>
        </>
      );
      break;
    case JobStatus.NOT_FOUND:
      page = (
        <>
          <h4 style={center_style}>Job Not Found</h4>
          <hr/>
          <div className="alert alert-warning">
            Job with given ID is not found. It is most likely that the
            job was not submitted into the queue.
          </div>
        </>
      );
      break;
    case JobStatus.FAILED:
      page = (
        <>
          <h4 style={center_style}>Job Failed</h4>
          <hr/>
          <div className="alert alert-danger">
            {
              this.state.job_err_msg.split('\n').map(
                (item, key) => <React.Fragment key={key}>{item}<br/></React.Fragment>
              )
            }
          </div>
        </>
      );
      break;
    case JobStatus.COMPLETED:
      page = (
        <JobCompletedPage id={this.props.id}/>
      );
      break;
    default:
      page = (
        <>
          <h4 style={center_style}>Job Status Unknown</h4>
          <hr/>
          <div className="alert alert-danger">
            Server is not responding. The job's status is currently unknown.
          </div>
        </>
      );
      break;
    }

    return (
      <Container>
        <Card style={padding_style("2em")} className="bg-light">
          {page}
        </Card>
      </Container>
    );
  }
}

export {JobPage};
