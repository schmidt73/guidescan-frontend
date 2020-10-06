import React from 'react';
import * as R from 'ramda';
import './app.scss';
import QueryForm from './queryForm.js';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function NavigationBar() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item active >Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Help</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Contact</Breadcrumb.Item>
    </Breadcrumb>
  );
}

function DoubleHelix(props) {
  return (
    <img src="/img/helix.png" width={props.width} height={props.height}/>
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
      <QueryForm/>
    </div>
  );
}

export default App;
