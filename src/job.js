import React from 'react';
import * as R from 'ramda';

import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import axios from 'axios';
import immutableSetState from './utils.js';

/*
  Functions that access the server's REST API for us, returning cancel
  tokens that can be used to cancel the request.
*/

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

  const source = axios.CancelToken.source();
  axios.post('http://localhost:8000/query', formData, {
    cancelToken: source.token,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

function getJobStatus(success_callback, error_callback, job_id) {
  const source = axios.CancelToken.source();
  axios.get('http://localhost:8000/job/status/' + job_id, {
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

function getJobResults(success_callback, error_callback, format, job_id) {
  const source = axios.CancelToken.source();
  axios.get('http://localhost:8000/job/result/' + format + '/' + job_id, {
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

function offTargetSummary(off_targets) {
  let summary = {};
  if (!off_targets) return summary;
  off_targets.forEach((off_target) => (off_target.distance in summary)
                      ? summary[off_target.distance]++
                      : summary[off_target.distance] = 0);
  return summary;
}

function processgRNA(chr, gRNA) {
  const strand = (gRNA.strand === "positive") ? "+" : "-";
  gRNA.coordinate = chr + ":" + gRNA.start + "-" + gRNA.end + ":" + strand;
  const off_targets = gRNA["off-targets"];
  const summary = offTargetSummary(off_targets);
  gRNA["num-off-targets"] = off_targets ? off_targets.length : 0;
  gRNA["off-target-summary"] = "2:" + (summary[2] || 0) + " | 3:" + (summary[3] || 0);
}

function processResultEntry(entry) {
  const chr = entry[0].coords[0]; 
  entry[1].forEach((gRNA) => processgRNA(chr, gRNA));
}

const JobResults = {
  PENDING:  1,
  ERROR:    2,
  RECEIVED: 3,
};

class JobResultPage extends React.Component {
  constructor(props) {
    super(props);

    this.onLoadSuccess = this.onLoadSuccess.bind(this);
    this.onLoadFailure = this.onLoadFailure.bind(this);

    this.loadJobResults = (id) =>
      getJobResults(this.onLoadSuccess,
                    this.onLoadFailure,
                    'json', id);

    this.state = {
      status: JobResults.PENDING
    };
  }

  componentDidMount() {
    this.loadSource = this.loadJobResults(this.props.id);
  }

  componentWillUnmount() {
    this.loadSource.cancel();
  }

  onLoadSuccess(response) {
    response.data.forEach(processResultEntry);
    immutableSetState(this, {status: JobResults.RECEIVED,
                             data: response.data});
  }

  onLoadFailure(error) {
    immutableSetState(this, {status: JobResults.ERROR});
  }

  render() {
    const center_style = {textAlign: "center"};
    const columns = [{
      dataField: 'coordinate',
      text: 'coordinate'
    }, {
      dataField: 'sequence',
      text: 'sequence'
    }, {
      dataField: 'num-off-targets',
      text: 'num-off-targets'
    }, {
      dataField: 'off-target-summary',
      text: 'off-target-summary',
    }, {
      dataField: 'cutting-efficiency',
      text: 'cutting-efficiency',
    }, {
      dataField: 'specificity',
      text: 'specificity',
    }];

    let page = null;

    switch (this.state.status) {
    case JobResults.RECEIVED:
      page = this.state.data.map((queryResult) => (
        <React.Fragment key={queryResult[0].name}>
          <h6>{queryResult[0].name}</h6>
          <BootstrapTable keyField='coordinate' data={queryResult[1]}
                          pagination={paginationFactory()} columns={columns}/>
        </React.Fragment>
      ));
      break;
    case JobResults.ERROR:
      page = (
        <>
          <hr/>
          <div className="alert alert-danger">
            Error loading results.
          </div>
        </>
      );
      break;
    default:
      page = (
        <>
          <hr/>
          <div className="alert alert-danger">
            {"Job Results are currently pending..."}
          </div>
        </>
      );
    }

    return (
      <>
        <h4 style={center_style}>Job Results</h4>
        {page}
      </>
    );
  }
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
    this.setState({job_status: JobStatus.NOT_FOUND});

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
          <div className="alert alert-danger">{this.state.job_err_msg}</div>
        </>
      );
      break;
    case JobStatus.COMPLETED:
      page = (
        <JobResultPage id={this.props.id}/>
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
