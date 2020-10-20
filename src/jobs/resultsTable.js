import * as R from 'ramda';

import React from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';

import {immutableSetState} from 'utils';
import {JobResultsState} from 'jobs/results';

function offTargetSummary(off_targets) {
  let summary = {};
  if (!off_targets) return summary;
  off_targets.forEach((off_target) => (off_target.distance in summary)
                      ? summary[off_target.distance]++
                      : summary[off_target.distance] = 0);
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
    sort: true
  }, {
    dataField: 'off-target-summary',
    text: 'off-target-summary',
  }, {
    dataField: 'cutting-efficiency',
    text: 'cutting-efficiency',
    sort: true
  }, {
    dataField: 'specificity',
    text: 'specificity',
    sort: true
  }];

function JobResultsTable(props) {
  let page = null;

  switch (props.jobResults.status) {
  case JobResultsState.RECEIVED:
    processJobResults(props.jobResults.data);
    page = props.jobResults.data.map((queryResult) => (
      <React.Fragment key={queryResult[0].name}>
        <h4 style={{margin: "0.5em 0 1em 0.5em", fontStyle: "italic"}}>{queryResult[0].name}</h4>
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
