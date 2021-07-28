import * as R from 'ramda';

import {JobResultsTable, GrnaJobResultsTable} from 'jobs/resultsTable';
import {GenomeBrowser} from 'jobs/genomeBrowser';

import {immutableSetState} from 'utils';

import axios from 'axios';
import { saveAs } from 'file-saver';

import React from 'react';

import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';

function downloadResults(id, format, extension) {
  saveAs(process.env.REACT_APP_REST_URL + `/job/result/${format}/${id}`, `results.${extension}`)
}

class JobCompletedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false,
      organism: null,
      coords: null,
    };

    this.handleCoordsChange = this.handleCoordsChange.bind(this);
    this.handleOrganismChange = this.handleOrganismChange.bind(this);
  }

  handleCoordsChange(c) {
    immutableSetState(this, {coords: c});
  }

  handleOrganismChange(o) {
    immutableSetState(this, {organism: o});
  }

  render() {
    const center_style = {textAlign: "center"};

    const showResultsButton = (
      <Button 
        style={{margin: "1em"}}
        variant="primary" onClick={() => immutableSetState(this, {showResults: !(this.state.showResults)})}>
        {this.state.showResults ? "Show results" : "Hide results"}
      </Button>
    );

    const downloadResultsButton = (
      <DropdownButton
        style={{margin: "1em"}}
        id="dropdown-basic-button" title="Download results" download>
        <Dropdown.Item onClick={() => downloadResults(this.props.id, "json", "json")}>
          as json...
        </Dropdown.Item>
        <Dropdown.Item onClick={() => downloadResults(this.props.id, "csv", "csv")}>
          as csv...
        </Dropdown.Item>
        <Dropdown.Item onClick={() => downloadResults(this.props.id, "excel", "xlsx")}>
          as excel...
        </Dropdown.Item>
        <Dropdown.Item onClick={() => downloadResults(this.props.id, "bed", "bed")}>
          as bed...
        </Dropdown.Item>
      </DropdownButton>
    );

    let results =  null;

    if (!this.state.showResults) {
      if (this.props.jobType === "grna") {
        results = (
          <GrnaJobResultsTable id={this.props.id}/>
        );
      } else if (this.props.jobType === "library") {
        results = null;
      } else {
        results = (
          <>
            {
              (this.state.organism && this.state.coords) ? (
                <GenomeBrowser id={this.props.id}
                               organism={this.state.organism}
                               coords={this.state.coords}/>
              ) : null
            }
            <hr/> 
            <JobResultsTable id={this.props.id}
                             onCoordsChange={this.handleCoordsChange}
                             onOrganismChange={this.handleOrganismChange}/>
          </>
        );
      }
    }
    
    return (
      <Container>
        <h2 style={center_style}>Job Results</h2>
        <Row className="justify-content-md-center">
          {(this.props.jobType === "library") ? null : showResultsButton}
          {downloadResultsButton}
        </Row>
        {(results ? (
          <>
            <hr/>
            {results}
          </>) : null)}
      </Container>
    );
  }
}

export {JobCompletedPage};
