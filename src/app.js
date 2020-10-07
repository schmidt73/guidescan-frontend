import React from 'react';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './app.scss';
import QueryForm from './queryForm.js';
import job from './job.js';

import {
  Switch,
  Route,
  Redirect,
  Link,
  useRouteMatch
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

function NavigationBar() {
  return (
    <Breadcrumb>
      <ActiveBreadcrumbItem path="/" exact={true} label="Home" />
      <ActiveBreadcrumbItem path="/about" label="About" />
      <ActiveBreadcrumbItem path="/contact" label="Contact" />
    </Breadcrumb>
  );
}

function DoubleHelix(props) {
  return (
    <img src="/img/helix.png" width={props.width} height={props.height}
         alt="double helix"/>
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
            <h1>GuideScan 2.0</h1>
            <h4 >A generalized CRISPR guideRNA design tool.</h4>
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
    const submitQuery = (query_state) =>
          job.submitQuery(this.handleSuccessfulQuery,
                          this.handleFailedQuery,
                          query_state);

    let success_toast = (
      <QuitableToast
        show={this.state.query.state === QueryState.SUCCESS}
        text="Successfully submitted query."/>
    );

    let failure_toast = (
      <QuitableToast
        show={this.state.query.state === QueryState.FAILURE}
        text="Failure to submit query."/>
    );

    let page_selector = null;
    if (this.state.query.state === QueryState.SUCCESS) {
      const job_id = this.state.query.response.data["job-id"];
      page_selector = <Redirect to={"/job/" + job_id}/>;
    }

    return (
      <div className="App">
        <NavigationBar/>
        <GuidescanJumbotron/>
        {page_selector}
        <Switch>
          <Route exact path="/">
            <QueryForm handleSubmit={submitQuery}/>
          </Route>
          <Route exact path="/about">
          </Route>
          <Route exact path="/contact">
          </Route>
          <Route exact path='/job/:id'
                 render={({match}) => (<job.JobPage id={match.params.id}/>)}>
          </Route>
        </Switch>
        {success_toast}
        {failure_toast}
      </div>
    );
  }
}

export default App;
