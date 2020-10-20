import {immutableSetState} from 'utils.js';

import axios from 'axios';

/*
  Functions that access the server's REST API for us, returning cancel
  tokens that can be used to cancel the request if necessary.
*/

function submitQuery(success_callback, error_callback, data) {
  let formData = new FormData();

  formData.append("organism", data.organism);
  formData.append("enzyme", data.enzyme);
  formData.append("query-text", data.query_text);
  formData.append("filter-annotated", data.filter_annotated_grnas);
              
  const mode = data.flanking.enabled ? "flanking" : "within";
  formData.append("mode", mode);

  if (data.flanking.enabled) {
    formData.append("flanking", data.flanking.value);
  }

  if (data.top_n.enabled) {
    formData.append("topn", data.top_n.value);
  }

  if (data.fileInput.current.files.length > 0) {
    formData.append("query-file-upload", data.fileInput.current.files[0]);
  }

  const source = axios.CancelToken.source();
  console.log(process.env.REACT_APP_REST_URL + '/query');
  console.log(process.env);
  axios.post(process.env.REACT_APP_REST_URL + '/query', formData, {
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
  axios.get(process.env.REACT_APP_REST_URL + '/job/status/' + job_id, {
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

function getJobResults(success_callback, error_callback, format, job_id) {
  const source = axios.CancelToken.source();
  axios.get(process.env.REACT_APP_REST_URL + '/job/result/' + format + '/' + job_id, {
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

export {getJobResults, getJobStatus, submitQuery};
