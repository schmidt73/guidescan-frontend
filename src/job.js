import React from 'react';
import * as R from 'ramda';

import axios from 'axios';

function submitQuery(success_callback, error_callback, state) {
  let form = {
    "organism"         : state.organism,
    "enzyme"           : state.enzyme,
    "query-text"       : state.query_text,
    "filter-annotated" : state.filter_annotated_grnas,
  };
              
  const mode = state.flanking.enabled ? "flanking" : "within";
  form = R.assoc("mode", mode, state);

  if (state.flanking.enabled) {
    form["flanking-value"] = state.flanking.value;
  }

  if (state.top_n.enabled) {
    form["topn-value"] = state.top_n.value;
  }

  var formData = new FormData();
  for (let key in form) {
    formData.append(key, form[key]);
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

const job = {
  submitQuery: submitQuery
};

export default job;
