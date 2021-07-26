import * as R from 'ramda';
import React from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';

import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Button from 'react-bootstrap/Button';

import {immutableSetState} from 'utils';
import {getJobResults} from 'jobs/rest';

function offTargetSummary(off_targets) {
  let summary = {};
  if (!off_targets) return summary;
  off_targets.forEach((off_target) => (off_target.distance in summary)
                      ? summary[off_target.distance]++
                      : summary[off_target.distance] = 1);
  return summary;
}


function grnaQueryProcessGrna(gRNA) {
  const strand = (gRNA.direction === "positive") ? "+" : "-";
  const genomicRegion = gRNA['genomic-region'];
  const coords = genomicRegion['chromosome-name'] + ":" + gRNA.start + "-" + gRNA.end + ":" + strand;
  gRNA.coordinate = coords;

  const offTargets = gRNA["off-targets"];
  const summary = offTargetSummary(offTargets);
  gRNA["num-off-targets"] = offTargets ? offTargets.length : 0;
  gRNA["off-target-summary"] = "2:" + (summary[2] || 0) +
    " | 3:" + (summary[3] || 0);

  if (!("specificity" in gRNA)) {
    gRNA["specificity"] = "N/A";
  }

  if (!("cutting-efficiency" in gRNA)) {
    gRNA["cutting-efficiency"] = "N/A";
  }
}

function processgRNA(onCoordsChange, chr, gRNA) {
  const strand = (gRNA.direction === "positive") ? "+" : "-";
  const coords = chr + ":" + gRNA.start + "-" + gRNA.end + ":" + strand;
  gRNA.coordinate = <a className="breadcrumb-item" onClick={() => onCoordsChange(coords)}>{coords}</a>;

  const offTargets = gRNA["off-targets"];
  const summary = offTargetSummary(offTargets);
  gRNA["num-off-targets"] = offTargets ? offTargets.length : 0;
  gRNA["off-target-summary"] = "2:" + (summary[2] || 0) +
    " | 3:" + (summary[3] || 0);

  if (gRNA["annotations"].length > 0) {
    let annotation = gRNA["annotations"][0];
    gRNA["annotations"] = "Exon " + annotation["exons/exon_number"] + " of " + annotation["exons/product"];
  } else {
    gRNA["annotations"] = "None"
  }

  if (!("specificity" in gRNA)) {
    gRNA["specificity"] = "N/A";
  }

  if (!("cutting-efficiency" in gRNA)) {
    gRNA["cutting-efficiency"] = "N/A";
  }

}

function processResultEntry(onCoordsChange, entry) {
  const chr = entry[0]['chromosome-name']; 
  entry[1].forEach((gRNA) => processgRNA(onCoordsChange, chr, gRNA));
}

/*
  Processes the results of a /job/result/ request into a format
  suitable for a results table. Mutates the input.
*/
function processJobResults(onCoordsChange, results) {
  results.forEach((e) => processResultEntry(onCoordsChange, e));
}

function floatFormatter(precision) {
  function f(cell, row) {
    const s = Math.pow(10, precision);
    const n = Math.trunc(cell * s) / s; 
    return (
        <span>{ n.toFixed(precision) }</span>
    );
  }

  return f;
}

function offTargetCoordinatesFormatter(cell, row) {
  console.log(cell);

  let startPosition = null;
  let endPosition = null;
  const direction = cell.direction === "positive" ? "+" : "-";
  
  if (direction === "+") {
    startPosition = cell.position;
    endPosition   = startPosition + 23;
  } else {
    endPosition   = cell.position;
    startPosition = endPosition - 23;
  }

  return 'chr' + cell.chromosome + ":" + startPosition + "-" + endPosition + ":" + direction;
}

const OffTargetResultsTableColumns =
      [{
        dataField: 'coords',
        text: 'coordinates',
        sort: true,
        formatter: offTargetCoordinatesFormatter,
      }, {
        dataField: 'distance',
        text: 'distance',
        sort: true,
      }];

function OffTargetModal(props) {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var offTargets = props.gRNA["off-targets"];
  offTargets = offTargets.map(off_target => {
    return {
      distance: off_target.distance,
      coords: {
        position: off_target.position,
        direction: off_target.direction,
        chromosome: off_target.chromosome
      }
    }
  });

  const offTargetSummary = props.gRNA["off-target-summary"];

  if (offTargets.length == 0) {
    return offTargetSummary;
  }

  return (
    <>
      <a href="#" variant="primary" onClick={(e) => {e.preventDefault(); handleShow();}}>
        {offTargetSummary}
      </a>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Off-targets for guideRNA targeting {props.gRNA["coordinate"]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapTable keyField='coords' data={offTargets}
                          striped={true} columns={OffTargetResultsTableColumns}
                          pagination={paginationFactory()} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function offTargetFormatter(cell, row) {
    return <OffTargetModal gRNA={row}/>;
}

const JobResultsTableColumns = 
  [{
    dataField: 'coordinate',
    text: 'coordinate',
    sort: true
  }, {
    dataField: 'sequence',
    text: 'sequence',
    sort: true
  }, {
    dataField: 'num-off-targets',
    text: 'num-off-targets',
    sort: true,
  }, {
    dataField: 'off-target-summary',
    text: 'off-target-summary',
    formatter: offTargetFormatter
  }, {
    dataField: 'cutting-efficiency',
    text: 'cutting-efficiency',
    sort: true,
    formatter: floatFormatter(2),
  }, {
    dataField: 'specificity',
    text: 'specificity',
    sort: true,
    formatter: floatFormatter(2),
  }, {
    dataField: 'annotations',
    text: 'annotations',
    sort: true
  }];

const GrnaJobResultsTableColumns = 
  [{
    dataField: 'coordinate',
    text: 'coordinate',
    sort: true
  }, {
    dataField: 'sequence',
    text: 'gRNA',
    sort: true
  }, {
    dataField: 'num-off-targets',
    text: 'num-off-targets',
    sort: true,
  }, {
    dataField: 'off-target-summary',
    text: 'off-target-summary',
    formatter: offTargetFormatter
  }, {
    dataField: 'cutting-efficiency',
    text: 'cutting-efficiency',
    sort: true,
    formatter: floatFormatter(2),
  }, {
    dataField: 'specificity',
    text: 'specificity',
    sort: true,
    formatter: floatFormatter(2),
  }];

const BadGrnaJobResultsTableColumns = 
  [{
    dataField: 'sequence',
    text: 'sequence',
    sort: true
  }, {
    dataField: 'error',
    text: 'error',
  }];

const JobResultsState = {
  PENDING:  1,
  ERROR:    2,
  RECEIVED: 3,
};

class JobResultsTable extends React.Component {
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
    this.props.onOrganismChange(this.state.data[0][0].organism);

    const genomicRegion = this.state.data[0][0];
    const defaultCoordsString = genomicRegion["chromosome-name"] + ":" + genomicRegion["coords"][1] + "-" + genomicRegion["coords"][2];
    this.props.onCoordsChange(defaultCoordsString);
  }

  onLoadFailure(error) {
    immutableSetState(this, {status: JobResultsState.ERROR});
  }

  render() {
    let page = null;

    switch (this.state.status) {
    case JobResultsState.RECEIVED:
      let gRNAs = JSON.parse(JSON.stringify(this.state.data)); // Works because data comes from JSON endpoint
      processJobResults(this.props.onCoordsChange, gRNAs);
      page = gRNAs.map((queryResult) => {
        const grnaCoordsString = queryResult[0]["region-name"];
        return (
          <React.Fragment key={queryResult[0]["region-name"]}>
            <h4 style={{margin: "0.5em 0 1em 0.5em", fontStyle: "italic"}}
                onClick={() => this.props.onCoordsChange(grnaCoordsString)}>
              <a className="breadcrumb-item" style={{color: "black"}}>
                {grnaCoordsString}
              </a>
            </h4>
            <BootstrapTable keyField='sequence' data={queryResult[1]}
                            striped={true}
                            columns={JobResultsTableColumns}
                            pagination={paginationFactory()} />
          </React.Fragment>
        );
      });
      break;
    case JobResultsState.ERROR:
      page = (
        <div className="alert alert-danger">
          Error loading results.
        </div>
      );
      break;
    default:
      page = (
        <div className="alert alert-warning">
          {"Job Results are currently pending..."}
        </div>
      );
    }

    return page;
  }
}

class GrnaJobResultsTable extends React.Component {
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
    let page = null;

    switch (this.state.status) {
    case JobResultsState.RECEIVED:
      let gRNAs = JSON.parse(JSON.stringify(this.state.data)); // Works because data comes from JSON endpoint
      let goodGrnas = [], badGrnas = [];
      for(const gRNA of gRNAs) {
        if (gRNA.error) {
          gRNA.error = gRNA.error.message;
          gRNA.sequence = gRNA.grna;
          badGrnas.push(gRNA);
        } else { 
          grnaQueryProcessGrna(gRNA);
          goodGrnas.push(gRNA);
        }
      }

      page = (
        <>
          <h4 style={{margin: "0.5em 0 1em 0.5em", fontStyle: "italic"}}>
            <a className="breadcrumb-item" style={{color: "black"}}>
              Evaluated gRNAs
            </a>
          </h4>
          <BootstrapTable keyField='sequence' data={goodGrnas}
                          striped={true}
                          columns={GrnaJobResultsTableColumns}/>
          {((badGrnas.length > 0) ? (
            <>
              <h4 style={{margin: "1.5em 0 1em 0.5em", fontStyle: "italic"}}>
                <a className="breadcrumb-item" style={{color: "black"}}>
                  Failed gRNAs
                </a>
              </h4>
              <BootstrapTable keyField='sequence' data={badGrnas}
                              striped={true}
                              columns={BadGrnaJobResultsTableColumns}/>
            </>
          ) : null)}
        </>
      );

      break;
    case JobResultsState.ERROR:
      page = (
        <div className="alert alert-danger">
          Error loading results.
        </div>
      );
      break;
    default:
      page = (
        <div className="alert alert-warning">
          {"Job Results are currently pending..."}
        </div>
      );
    }

    return page;
  }
}

export {JobResultsTable, GrnaJobResultsTable};
