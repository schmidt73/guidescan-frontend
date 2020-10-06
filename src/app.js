import React from 'react';
import './app.scss';
import QueryForm from './queryForm.js';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  Switch,
  Route,
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

function App() {
  return (
    <div className="App">
      <NavigationBar/>
      <GuidescanJumbotron/>
      <Switch>
        <Route exact path="/">
          <QueryForm handleSubmit={console.log}/>
        </Route>
        <Route path="/about">
        </Route>
        <Route path="/contact">
        </Route>
      </Switch>
    </div>
  );
}

export default App;
