import * as R from 'ramda';

import {JobResultsTable} from 'jobs/resultsTable';
import {JobResultsContainer} from 'jobs/results';
import {GenomeBrowser} from 'jobs/genomeBrowser';

import {immutableSetState} from 'utils';
import {getJobStatus, submitQuery} from 'jobs/rest';

import axios from 'axios';
import fileDownload from 'js-file-download';

import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

function downloadResults(id, format) {
  axios.get(process.env.REACT_APP_REST_URL + `/job/result/${format}/${id}`)
    .then((response) => {
      fileDownload(R.is(Object, response.data) ?
                   JSON.stringify(response.data) : response.data,
                   `results.${format}`);
    });
}

class JobCompletedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false
    };
  }

  render() {
    const center_style = {textAlign: "center"};

    const showResultsButton = (
      <Button 
        style={{margin: "1em"}}
        variant="primary" onClick={() => immutableSetState(this, {showResults: !(this.state.showResults)})}>
        {this.state.showResults ? "Hide results" : "Show results"}
      </Button>
    );

    const downloadResultsButton = (
      <DropdownButton
        style={{margin: "1em"}}
        id="dropdown-basic-button" title="Download results" download>
        <Dropdown.Item onClick={() => downloadResults(this.props.id, "json")}>
          as json...
        </Dropdown.Item>
        <Dropdown.Item onClick={() => downloadResults(this.props.id, "csv")}>
          as csv...
        </Dropdown.Item>
        <Dropdown.Item onClick={() => downloadResults(this.props.id, "bed")}>
          as bed...
        </Dropdown.Item>
      </DropdownButton>
    );

    const results = !this.state.showResults ? null : (
      <JobResultsContainer id={this.props.id}>
        <GenomeBrowser id={this.props.id}/>
        <hr/> 
        <JobResultsTable/>
      </JobResultsContainer>
    );

    return (
      <Container>
        <h2 style={center_style}>Job Results</h2>
        <Row className="justify-content-md-center">
          {showResultsButton}
          {downloadResultsButton}
        </Row>
        <hr/>
        {results}
      </Container>
    );
  }
}

export {JobCompletedPage};
