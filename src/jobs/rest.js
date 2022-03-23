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

  if (data.specificity_filter.enabled) {
    formData.append("s-bounds-l", data.specificity_filter.value);
    formData.append("s-bounds-u", 1);
  }

  if (data.ce_filter.enabled) {
    formData.append("ce-bounds-l", data.ce_filter.value);
    formData.append("ce-bounds-u", 1);
  }

  const source = axios.CancelToken.source();
  axios.post('/backend/query', formData, {
    cancelToken: source.token,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

function submitGrnaQuery(success_callback, error_callback, data) {
  let formData = new FormData();

  formData.append("organism", data.organism);
  formData.append("enzyme", data.enzyme);
  formData.append("query-text", data.query_text);
  formData.append("query-type", "grna");

  const source = axios.CancelToken.source();
  axios.post('/backend/query', formData, {
    cancelToken: source.token,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

function submitLibraryQuery(success_callback, error_callback, data) {
  let formData = new FormData();

  formData.append("organism", data.organism);
  formData.append("query-text", data.query_text);
  formData.append("query-type", "library");

  if (data.num_pools.enabled) {
    formData.append("num-pools", data.num_pools.value);
  }

  if (data.saturation.enabled) {
    formData.append("saturation", data.saturation.value);
  }

  if (data.num_control.enabled) {
    formData.append("num-control", data.num_control.value);
  }

  if (data.num_essential.enabled) {
    formData.append("num-essential", data.num_essential.value);
  }

  formData.append("prime5-g", data.prime5_g);

  const source = axios.CancelToken.source();
  axios.post('/backend/query', formData, {
    cancelToken: source.token,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(success_callback)
    .catch(error_callback);
  return source;
}


function getCompletions(success_callback, error_callback, organism, symbol) {
  const source = axios.CancelToken.source();
  axios.get('/backend/info/autocomplete', {
    params: {
      organism: organism,
      symbol: symbol
    },
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);
}

function getJobStatus(success_callback, error_callback, job_id) {
  const source = axios.CancelToken.source();
  axios.get('/backend/job/status/' + job_id, {
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

function getJobResults(success_callback, error_callback, format, job_id) {
  const source = axios.CancelToken.source();

  let formData = new FormData();
  formData.append("type", "all");
  formData.append("key", "{}");

  axios.post('/backend/job/result/' + format + '/' + job_id, formData, {
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);

  return source;
}

function getInfoSupported(success_callback, error_callback) {
  const source = axios.CancelToken.source();
  axios.get('/backend/info/supported', {
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

function getExamples(success_callback, error_callback) {
  const source = axios.CancelToken.source();
  axios.get('/backend/info/examples', {
    cancelToken: source.token
  }).then(success_callback)
    .catch(error_callback);
  return source;
}

export {getJobResults, getJobStatus, getInfoSupported, getExamples,
        submitQuery, submitGrnaQuery, submitLibraryQuery};
