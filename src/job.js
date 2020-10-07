import React from 'react';
import * as R from 'ramda';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import axios from 'axios';

function submitQuery(success_callback, error_callback, state) {
  let formData = new FormData();

  formData.append("organism", state.organism);
  formData.append("enzyme", state.enzyme);
  formData.append("query-text", state.query_text);
  formData.append("filter-annotated", state.filter_annotated_grnas);
              
  const mode = state.flanking.enabled ? "flanking" : "within";
  formData.append("mode", mode);

  if (state.flanking.enabled) {
    formData("flanking-value", state.flanking.value);
  }

  if (state.top_n.enabled) {
    formData("topn-value", state.top_n.value);
  }

  if (state.fileInput.current.files.length > 0) {
    formData.append("query-file-upload", state.fileInput.current.files[0]);
  }

  axios.post('http://localhost:8000/query', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(success_callback)
    .catch(error_callback);
}

function getJobStatus(success_callback, error_callback, job_id) {
  axios.get('http://localhost:8000/job/status/' + job_id)
    .then(success_callback)
    .catch(error_callback);
}

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
      getJobStatus(this.onJobStatusSuccess,
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
    clearInterval(this.statusInterval);
    const update = this.updateJobStatus(this.props.id);
    this.statusInterval = setInterval(update, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.statusInterval);
  }

  onJobStatusError(error) {
      this.setState({job_status: JobStatus.NOT_FOUND});
  }

  onJobStatusSuccess(response) {
    const status = response.data["job-status"];

    if (status === "pending") {
      this.setState({job_status: JobStatus.PENDING});
    } else if (status === "completed") {
      this.setState({job_status: JobStatus.COMPLETED});
    } else if (status === "failed") {
      const failure_msg = response.data["failure"];
      this.setState({job_status: JobStatus.FAILED,
                     job_err_msg: failure_msg});
    } else {
      this.setState({job_status: JobStatus.UNKNOWN});
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
          <div className="alert alert-danger">{this.state.job_err_msg}</div>
        </>
      );
      break;
    case JobStatus.COMPLETED:
      page = (
        <p> COMPLETED </p>
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

const job = {
  submitQuery: submitQuery,
  JobPage: JobPage
};

export default job;
