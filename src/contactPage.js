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
            <a href="mailto:aventura71@gmail.com" style={contact_style}>
              &nbsp;aventura71@gmail.com
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
              Henri Schmidt: 
            </p>
          </Col>
          <Col xs="3">
            <a href="mailto:henrischmidt73@gmail.com" style={contact_style}>
              &nbsp;henrischmidt73@gmail.com
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

          <a href="mailto:henrischmidt73@gmail.com">
            &nbsp;henrischmidt73@gmail.com
          </a>

          &nbsp;as he is currently in charge of the project.

          All bug reports are greatly appreciated.
        </p>
      </Card>
    </Container>
  );
}

export {ContactPage};
