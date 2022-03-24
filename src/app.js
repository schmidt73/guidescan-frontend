import React, {useState, useEffect} from 'react';
import * as R from 'ramda';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Toast from 'react-bootstrap/Toast';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './app.scss';
import {QueryForm} from './queryForm.js';
import {GrnaQueryForm} from './grnaQueryForm.js';
import {LibraryQueryForm} from './libraryQueryForm.js';
import {DownloadsPage} from './downloadsPage.js';
import {AboutPage} from './aboutPage';
import {ContactPage} from './contactPage';
import {submitQuery, submitGrnaQuery, submitLibraryQuery} from './jobs/rest';
import {JobPage} from './jobs/jobPage';

import {
  Routes,
  Route,
  Navigate,
  Link,
  useMatch,
  useNavigate,
} from 'react-router-dom';

function ActiveBreadcrumbItem(props) {
  const match = useMatch({
    path: props.path,
    exact: props.exact
  });

  const link = (
    !match
      ? <Breadcrumb.Item href={props.path}>{props.label}</Breadcrumb.Item>
      : <Breadcrumb.Item active>{props.label}</Breadcrumb.Item>
  );

  return link;
}

function CitationBox() {
  const box_style = {padding: "2em 2em 1em 2em", margin: "2em 0 2em 0"};
  return (
    <Container id="citation-box">
      <Card style={box_style}>
        <h4>Citation</h4>
        <hr/>
        <p style={{fontSize: "1.15em"}}>
          Perez, A. R., Pritykin, Y., Vidigal, J. A.,
          Chhangawala, S., Zamparo, L., Leslie, C. S., & Ventura,
          A. (2017). <br/>

          GuideScan software for improved single and paired
          CRISPR guide RNA design. <br/>

          <i>
            Nature biotechnology
          </i>&#44; 35 (4), 347-349.  
        </p>
      </Card>
    </Container>
  );
}

function NavigationBar() {
  return (
    <Breadcrumb className="navbar">
      <ActiveBreadcrumbItem path="/" exact={true} label="gRNA Design" />
      <ActiveBreadcrumbItem path="/library" exact={true} label="Gene-targeting Library" />
      <ActiveBreadcrumbItem path="/grna" label="gRNA Sequence Search" />
      <ActiveBreadcrumbItem path="/about" label="About" />
      <ActiveBreadcrumbItem path="/downloads" label="Downloads" />
      <ActiveBreadcrumbItem path="/contact" label="Contact" />
    </Breadcrumb>
  );
}

function GuidescanLogo(props) {
  return (
    <a href="/">
      <img src="/img/logo.png"
           height={props.height}
           objectfit="contain"
           alt="logo"/>
    </a>
  );
}

function GuidescanJumbotron() {
  const padding_style = (p) => ({padding: p});
  const margin_style = (m) => ({margin: m});
  return (
    <Container>
      <Card style={R.mergeRight(padding_style("2em"), margin_style("0 0 2.5em 0"))} className="bg-light">
        <Row>
          <Col >
            <GuidescanLogo height={55}/>
            <br/><br/>
            <h3>&nbsp;CRISPR guideRNA design and analysis</h3>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

class QuitableToast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {closed: false};
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.setState({closed: true});
  }

  render() {
    return (
        <Toast
          className={this.props.className}
          show={this.props.show && !this.state.closed}
          onClose={this.onClose}
          animation="true"
          style={{
            position: 'absolute',
            bottom: '3em',
            left: '3em',
          }}
          >
          <Toast.Header>
            <strong className="mr-auto">GuideScan</strong>
          </Toast.Header>
          <Toast.Body>{this.props.text}</Toast.Body>
        </Toast>
    );
  }
}

const QueryState = {
  NOT_SUBMITTED: 1,
  SUCCESS: 2,
  FAILURE: 3,
};

function App() {
    const [queryState, updateQueryState] = useState(QueryState.NOT_SUBMITTED);
    const navigate = useNavigate();

    function handleSuccessfulQuery(response) {
        updateQueryState(QueryState.SUCCESS);
        navigate('/job/' + response.data["job-id"]);
    }

    function handleFailedQuery(error) {
        updateQueryState(QueryState.FAILURE);
    }

    const submitCallback = (queryState) =>
        submitQuery(handleSuccessfulQuery, handleFailedQuery, queryState);

    const grnaSubmitCallback = (queryState) => 
        submitGrnaQuery(handleSuccessfulQuery, handleFailedQuery, queryState);

    const librarySubmitCallback = (queryState) => 
        submitLibraryQuery(handleSuccessfulQuery, handleFailedQuery, queryState);

    let successToast = (
      <QuitableToast
        show={queryState === QueryState.SUCCESS}
        text="Successfully submitted query."/>
    );

    let failureToast = (
      <QuitableToast
        show={queryState === QueryState.FAILURE}
        text="Failure to submit query."/>
    );

    return (
      <div className="App">
        <NavigationBar/>
        <GuidescanJumbotron/>
        <Routes>
          <Route exact path="/" element={<QueryForm handleSubmit={submitCallback}/>}/>
          <Route exact path="/library" element={<LibraryQueryForm handleSubmit={librarySubmitCallback}/>}/>
          <Route exact path="/grna" element={<GrnaQueryForm handleSubmit={grnaSubmitCallback}/>}/>
          <Route exact path="/about" element={<React.Fragment><AboutPage/><CitationBox/></React.Fragment>}/>
          <Route exact path="/contact" element={<ContactPage/>}/>
          <Route exact path="/downloads" element={<DownloadsPage/>}/>
          <Route exact path='/job/:id' element={<JobPage/>}/>
        </Routes>
        {successToast}
        {failureToast}
      </div>
    );
}

export default App;
