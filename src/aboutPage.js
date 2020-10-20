import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

function AboutPage() {
  const padding_style = (p) => ({padding: p});
  const question_style = {fontWeight: "bold", fontSize: "1.3em"};
  const answer_style = {fontSize: "1.15em"};
  const image_style = {maxWidth: "100%", maxHeight: "100%", padding: "1em"};

  return (
    <Container>
      <Card style={padding_style("2em")} className="bg-light">
        <h3>Help</h3>
        <hr/>
        <Row>
          <Col>
          <p style={question_style}>
            What is valid textbox input?
          </p>
          <p style={answer_style}>
            Coordinates are line delimited and must be of the form: "chrX:start-end".
            The chromosome must be appropriate for the organism of interest.
            For example, one can find gRNAs for three regions as follows:<br/><br/>
            <code style={{textAlign: "center"}}>
              chr4:312000-315000<br/>
              chr4:313000-317000<br/>
              chr4:315000-319000
            </code>
          </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p id="valid-upload-format" style={question_style}>
              What are valid file upload formats?
            </p>
            <p style={answer_style}>
              One can upload their query a BED file, GFF/GTF file, or TXT file to be processsed. Standard BED and GTF formats are expected.
              For a TXT file, the site expects a file composed of a single column of genomic coordinates of the form chrX:start-end just as in
              the textbox input. This TXT file should have one genomic coordinate per line.

              <br/><br/>

              The exact specificiations used for BED and GFF/GTF files are from the following places:
              <ul>
                <li>BED: <a href="https://m.ensembl.org/info/website/upload/bed.html">m.ensembl.org/info/website/upload/bed.html</a></li>
                <li>GFF/GTF: <a href="https://m.ensembl.org/info/website/upload/gff.html">m.ensembl.org/info/website/upload/gff.html</a></li>
              </ul>

              <p style={{fontStyle: "italic", textAlign: "center"}}>Example of a valid TXT file upload:</p>
              <img src="/img/human_txt_example.png" style={image_style} alt="human text example"/>

              <p style={{fontStyle: "italic", textAlign: "center"}}>Example of a valid BED file upload:</p>
              <img src="/img/human_bed_example.png" style={image_style} alt="human bed example"/>

              <p style={{fontStyle: "italic", textAlign: "center"}}>Example of a valid GFF/GTF file upload:</p>
              <img src="/img/human_gtf_example.png" style={image_style} alt="human gtf example"/>
            </p>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export {AboutPage};
