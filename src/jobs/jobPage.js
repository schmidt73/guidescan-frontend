import {JobCompletedPage} from './completedPage';

import {immutableSetState} from '../utils';
import {getJobStatus} from './rest';
import {useParams} from 'react-router-dom';

import React, { useState, useEffect } from 'react';
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

function JobPage(props) {
    const { id } = useParams();
    const [job_status, setJobStatus] = useState(JobStatus.UNKNOWN);
    const [job_type, setJobType] = useState(null);
    const [failure_msg, setFailureMessage] = useState(null);

    function onJobStatusSuccess(response) {
        const jstatus = response.data["job-status"];
        const jtype = response.data["result-type"];

        if (jstatus === "pending") {
            setJobStatus(JobStatus.PENDING);
        } else if (jstatus === "completed") {
            setJobType(jtype);
            setJobStatus(JobStatus.COMPLETED); 
        } else if (jstatus === "failed") {
            setFailureMessage(response.data["failure"]);
            setJobStatus(JobStatus.FAILED);
        } 
    }

    function onJobStatusError(response) {
        setJobStatus(JobStatus.UNKNOWN);
    }

    const update = () => getJobStatus(onJobStatusSuccess, onJobStatusError, id);

    useEffect(() => { update(); }, [id]); // force initial update
    setInterval(update, UPDATE_INTERVAL);

    const center_style = {textAlign: "center"};
    const padding_style = (p) => ({padding: p});
    const pathname = "/job/" + id;

    let page = null;
    switch (job_status) {
    case JobStatus.PENDING:
      page = (
        <>
          <h4 style={center_style}>Job Pending</h4>
          <hr/>
          <div className="alert alert-warning">
            Job is currently pending. You can save the
            link <a href={pathname}>{pathname}</a> and
            come back later to check on the job.
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
              job_err_msg.split('\n').map(
                (item, key) => <React.Fragment key={key}>{item}<br/></React.Fragment>
              )
            }
          </div>
        </>
      );
      break;
    case JobStatus.COMPLETED:
      page = (
        <JobCompletedPage id={id} jobType={job_type}/>
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

export {JobPage};
