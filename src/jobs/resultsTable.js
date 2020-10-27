import React from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';

import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Button from 'react-bootstrap/Button';

import {JobResultsState} from 'jobs/results';

function offTargetSummary(off_targets) {
  let summary = {};
  if (!off_targets) return summary;
  off_targets.forEach((off_target) => (off_target.distance in summary)
                      ? summary[off_target.distance]++
                      : summary[off_target.distance] = 1);
  return summary;
}

function processgRNA(chr, gRNA) {
  const strand = (gRNA.direction === "positive") ? "+" : "-";
  gRNA.coordinate = chr + ":" + gRNA.start + "-" + gRNA.end + ":" + strand;
  const offTargets = gRNA["off-targets"];
  const summary = offTargetSummary(offTargets);
  gRNA["num-off-targets"] = offTargets ? offTargets.length : 0;
  gRNA["off-target-summary"] = "2:" + (summary[2] || 0) +
    " | 3:" + (summary[3] || 0);

  if (gRNA["annotations"].length > 0) {
    //console.log(gRNA["annotations"]);
    let uniqueAnnotations = Array.from(new Set(gRNA["annotations"].map((arr) => arr[1])));
    gRNA["annotations"] = uniqueAnnotations.join("\n");
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

function processResultEntry(entry) {
  const chr = entry[0].coords[0]; 
  entry[1].forEach((gRNA) => processgRNA(chr, gRNA));
}

/*
  Processes the results of a /job/result/ request into a format
  suitable for a results table. Mutates the input.
*/
function processJobResults(results) {
    results.forEach(processResultEntry);
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
  let startPosition = null;
  let endPosition = null;
  const direction = cell[0].direction === "positive" ? "+" : "-";
  
  if (direction === "+") {
    startPosition = cell[0].position;
    endPosition   = startPosition + 23;
  } else {
    endPosition   = cell[0].position;
    startPosition = endPosition - 23;
  }

  return cell[0].chromosome + ":" + startPosition + "-" + endPosition + ":" + direction;
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

  const offTargets = props.gRNA["off-targets"];
  const offTargetSummary = props.gRNA["off-target-summary"];
  console.log(offTargets);

  if (!offTargets) {
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
          <BootstrapTable keyField='coordinate' data={offTargets}
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

function JobResultsTable(props) {
  let page = null;

  switch (props.jobresults.status) {
  case JobResultsState.RECEIVED:
    processJobResults(props.jobresults.data);
    page = props.jobresults.data.map((queryResult) => (
      <React.Fragment key={queryResult[0]["region-name"]}>
        <h4 style={{margin: "0.5em 0 1em 0.5em", fontStyle: "italic"}}>{queryResult[0]["region-name"]}</h4>
        <BootstrapTable keyField='coordinate' data={queryResult[1]}
                        striped={true}
                        columns={JobResultsTableColumns}
                        pagination={paginationFactory()} />
      </React.Fragment>
    ));
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

export {JobResultsTable};
