import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { HashLink as Link } from 'react-router-hash-link';

function DownloadsPage() {
  const padding_style = (p) => ({padding: p});
  const tool_style = {fontWeight: "bold", fontSize: "1.6em"};
  const question_style = {fontWeight: "bold", fontSize: "1.3em"};
  const toc_header_style =  {fontWeight: "bold", fontSize: "1.6em"};
  const toc_style = {fontSize: "1.3em"};
  const answer_style = {fontSize: "1.15em"};
  const image_style = {maxWidth: "100%", maxHeight: "100%", padding: "1em"};

  return (
    <Container>
      <Card style={padding_style("2em")} className="bg-light">
        <h3>Downloads</h3>
        <hr style={{border: "2px solid black"}}/>
        <Row>
          <Col>
           <p style={answer_style}>
      A more flexible version of Guidescan2 is offered as a command line interface
      at <a href="https://github.com/schmidt73/guidescan-cli">github.com/schmidt73/guidescan-cli. </a> 
      Common use cases and complete documentation is well-described in the attached manual. 
      For ease of use we make available a set of pre-constructed indices for several genomes that
      can be used with the command line version of our software for a variety of tasks. In addition,
      we provide the raw Guidescan2 databases produced by our tool for several organism-enzyme
      combinations in a compressed BAM format. The exact details of the format are described in the software
      manual.<br/><br/>
      <div style={{fontStyle: "italic", textAlign: "center"}}>Guidescan2 Indices:</div>
      <hr/>
      <div style={{fontStyle: "italic", textAlign: "center"}}>Guidescan2 Databases:</div>
      <hr/>
           </p>
          </Col>
        </Row>
    </Card>
    </Container>
  );
}

export {DownloadsPage};
