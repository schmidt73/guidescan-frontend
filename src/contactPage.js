import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

function ContactPage() {
  const padding_style = (p) => ({padding: p});
  const name_style = {fontWeight: "bold", fontSize: "1.15em"};
  const contact_style = {fontWeight: "normal", fontSize: "1.15em"};

  return (
    <Container>
      <Card style={padding_style("2em")} className="bg-light">
        <h3>Contact Information</h3>
        <hr/>
        <Row>
          <Col xs="3">
            <p style={name_style}>
              Christina Leslie, PhD: 
            </p>
          </Col>
          <Col xs="3">
            <a href="mailto:cleslie@cbio.mskcc.org" style={contact_style}>
              &nbsp;cleslie@cbio.mskcc.org
            </a>
          </Col>
          <Col>
            <a href="http://cbio.mskcc.org/leslielab/" style={contact_style}>
              &nbsp;cbio.mskcc.org/leslielab
            </a>
          </Col>
        </Row>
        <Row>
          <Col xs="3">
            <p style={name_style}>
              Andrea Ventura, MD, PhD: 
            </p>
          </Col>
          <Col xs="3">
            <a href="mailto:venturaa@mskcc.org" style={contact_style}>
              &nbsp;venturaa@mskcc.org
            </a>
          </Col>
          <Col>
            <a href="https://venturalaboratory.com/" style={contact_style}>
              &nbsp;venturalaboratory.com
            </a>
          </Col>
        </Row>
        <Row>
          <Col xs="3">
            <p style={name_style}>
              Yuri Pritykin, PhD: 
            </p>
          </Col>
          <Col xs="3">
            <a href="mailto:pritykin@princeton.edu" style={contact_style}>
              &nbsp;pritykin@princeton.edu
            </a>
          </Col>
          <Col>
            <a href="https://pritykin.github.io/" style={contact_style}>
              &nbsp;pritykin.github.io
            </a>
          </Col>
        </Row>
        <Row>
          <Col xs="3">
            <p style={name_style}>
              Henri Schmidt: 
            </p>
          </Col>
          <Col xs="3">
            <a href="mailto:henri.schmidt@princeton.edu" style={contact_style}>
              &nbsp;henri.schmidt@princeton.edu
            </a>
          </Col>
          <Col >
            <a href="https://github.com/schmidt73" style={contact_style}>
              &nbsp;github.com/schmidt73
            </a>
          </Col>
        </Row>
        <hr/>
        <p style={contact_style}>
          For any questions, comments, or concerns about the website or the
          project,
          feel free to contact Henri Schmidt at

          <a href="mailto:henri.schmidt@princeton.edu">
            &nbsp;henri.schmidt@princeton.edu
          </a>

          &nbsp;as he is currently in charge.

          All bug reports are greatly appreciated.
        </p>
      </Card>
    </Container>
  );
}

export {ContactPage};
