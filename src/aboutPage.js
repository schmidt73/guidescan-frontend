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
            Coordinates are line delimited and must be one of three things. Namely,
            coordinates can take the form "chrX:start-end", they can be standard
            gene symbols (case sensitive), or they can be Entrez GeneIDs.
            The chromosome must be appropriate for the organism of interest.
            <br/>
            <br/>
        
            For example, one can find gRNAs for 5 loci as follows:<br/><br/>
            <code style={{textAlign: "center"}}>
              chr4:312000-315000<br/>
              chr4:313000-317000<br/>
              chr4:315000-319000<br/>
              VEGFA<br/>
              7422
            </code>

            <br/>
            <br/>
            Notice that VEFGA and 7422 are the same region
            (see: <a href="https://www.ncbi.nlm.nih.gov/gene/7422" target="_blank">here</a>).
            <br/><br/>
            <b>Alternatively,</b> one can submit a DNA-sequence. This will first find the
            location of the sequence within the genome of interest and then find all gRNAs
            within that sequence. Exact matches are required, so if a different reference is
            used, it is not guarenteed that matches are found.
            <br/><br/>
            For example, an input might look like this:<br/><br/>
            <code style={{textAlign: "center"}}>
              ATCAGCGATCGACTAGCGCGCGCGCTAAAAAAAAAAA<br/>
              CACATCTCTCTTAGGGGGAANACTAGGGGGGGGGGAA<br/>
              ACACACAGCCCCCCCCCCCCCCACAGGTTTTAACGAG<br/>
              ACATAGGGGGATACAGCGACGGGGGGGGGAGCGACAT<br/>
            </code>

            <br/>
            Line breaks <b>are</b> allowed within the input, but only one DNA-sequence can be
            submitted at a time due to the computational resources required for alignment.
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
