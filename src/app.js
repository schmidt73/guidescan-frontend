import React from 'react';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './app.scss';
import {QueryForm} from './queryForm.js';
import {GrnaQueryForm} from './grnaQueryForm.js';
import {LibraryQueryForm} from './libraryQueryForm.js';
import {AboutPage} from 'aboutPage';
import {ContactPage} from 'contactPage';
import {submitQuery, submitGrnaQuery, submitLibraryQuery} from 'jobs/rest';
import {JobPage} from 'jobs/jobPage';

import {
  Switch,
  Route,
  Redirect,
  Link,
  useRouteMatch,
  withRouter
} from 'react-router-dom';

function ActiveBreadcrumbItem(props) {
  const match = useRouteMatch({
    path: props.path,
    exact: props.exact
  });

  const link = (
    !match
      ? <Link className="breadcrumb-item" to={props.path}>{props.label}</Link>
      : <span className='breadcrumb-item active'>{props.label}</span>
  );

  return link;
}

function CitationBox() {
  const box_style = {padding: "2em 2em 1em 2em", margin: "2em 0 2em 0"};
  return (
    <Container>
      <Card style={box_style}>
        <h5>Citation</h5>
        <hr/>
        <p style={{fontSize: "1.1em"}}>
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
    <Breadcrumb>
      <ActiveBreadcrumbItem path="/" exact={true} label="Home" />
      <ActiveBreadcrumbItem path="/library" exact={true} label="Library Design" />
      <ActiveBreadcrumbItem path="/grna" label="gRNA Search" />
      <ActiveBreadcrumbItem path="/about" label="About" />
      <ActiveBreadcrumbItem path="/contact" label="Contact" />
    </Breadcrumb>
  );
}

function DoubleHelix(props) {
  return (
    <a href="/">
      <img src="/img/helix.png"
           width={props.width} height={props.height}
           alt="double helix"/>
    </a>
  );
}

function GuidescanJumbotron() {
  return (
    <Container>
      <Jumbotron>
        <Row>
          <Col xs="auto">
            <DoubleHelix width={100} height={100}/>
          </Col>
          <Col className="py-3 pl-4">
            <h1>GuideScan 1.5</h1>
            <h4>A generalized CRISPR guideRNA design tool.</h4>
          </Col>
        </Row>
      </Jumbotron>
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

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleSuccessfulQuery = this.handleSuccessfulQuery.bind(this);
    this.handleFailedQuery     = this.handleFailedQuery.bind(this);

    this.state = {
      query: {
        state: QueryState.NOT_SUBMITTED,
      }
    };
  }

  handleSuccessfulQuery(response) {
    const query = {state: QueryState.SUCCESS, response: response};
    this.setState({query: query});
  }

  handleFailedQuery(error) {
    const query = {state: QueryState.FAILURE, error: error};
    this.setState({query: query});
  }

  render() {
    const submitCallback = (queryState) =>
          submitQuery(this.handleSuccessfulQuery,
                      this.handleFailedQuery,
                      queryState);

    const grnaSubmitCallback = (queryState) =>
          submitGrnaQuery(this.handleSuccessfulQuery,
                          this.handleFailedQuery,
                          queryState);

    const librarySubmitCallback = (queryState) =>
          submitLibraryQuery(this.handleSuccessfulQuery,
                             this.handleFailedQuery,
                             queryState);

    let successToast = (
      <QuitableToast
        show={this.state.query.state === QueryState.SUCCESS}
        text="Successfully submitted query."/>
    );

    let failureToast = (
      <QuitableToast
        show={this.state.query.state === QueryState.FAILURE}
        text="Failure to submit query."/>
    );

    let pageSelector = null;
    if (this.state.query.state === QueryState.SUCCESS) {
      const jobId = this.state.query.response.data["job-id"];
      pageSelector = <Redirect to={"/job/" + jobId}/>;
    }

    return (
      <div className="App">
        <NavigationBar/>
        <GuidescanJumbotron/>
        {pageSelector}
        <Switch>
          <Route exact path="/">
            <QueryForm handleSubmit={submitCallback}/>
            <CitationBox/>
          </Route>
          <Route exact path="/library">
            <LibraryQueryForm handleSubmit={librarySubmitCallback}/>
            <CitationBox/>
          </Route>
          <Route exact path="/grna">
            <GrnaQueryForm handleSubmit={grnaSubmitCallback}/>
            <CitationBox/>
          </Route>
          <Route exact path="/about">
            <AboutPage/>
          </Route>
          <Route exact path="/contact">
            <ContactPage/>
          </Route>
          <Route exact path='/job/:id'
                 render={({match}) => (<JobPage id={match.params.id}/>)}>
          </Route>
        </Switch>
        {successToast}
        {failureToast}
      </div>
    );
  }
}

export default withRouter(App);
