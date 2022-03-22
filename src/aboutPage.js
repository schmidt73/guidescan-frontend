import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { HashLink as Link } from 'react-router-hash-link';

function AboutPage() {
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
        <h2>Help</h2>
        <hr style={{border: "2px solid black"}}/>
        <Row>
          <Col>
            <p style={toc_header_style}>
              Table of Contents
            </p>
            <ol style={toc_style}>
            <li>
                <Link to="#grna_design_introduction">gRNA Design Tool</Link>
                <ol>
                <li><Link to="#genomic_coordinates">Textbox Input Format</Link></li>
                <li><Link to="#valid_upload_formats">File Upload Format</Link></li>
                </ol>
            </li>
            <li>
              <Link to="#screen_design_introduction">Screen Design Tool</Link>
              <ol>
                <li><Link to="#screen_design_textbox">Textbox Input Format</Link></li>
                <li><Link to="#screen_design_params">Configuration Parameters</Link></li>
              </ol>
            </li>
            <li><Link to="#grna_search">gRNA Search Tool</Link></li>
            </ol>
          </Col>
        </Row>
        <hr style={{border: "2px solid black"}}/>
        <Row>
          <Col>
            <p style={tool_style} id="grna_design_introduction">
              gRNA Design Tool
            </p>
            <p style={answer_style}>
              The gRNA design tool provides the least processed interface to the
              Guidescan2 backend. It takes as input a genomic interval and
              responds with all gRNAs within that genomic region that have been
              vetted and annotated by Guidescan2. The output is displayed
              both in an IGV browser 
              and a tabular format available for download. Due to the
              density of gRNAs in most genomes, the output for even a
              small genomic region may have many guides. Do not be
              concerned if the output seems rather large.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p style={question_style} id="genomic_coordinates">
              Textbox Input Format
            </p>
            <p style={answer_style}>
              Genomic intervals are line delimited and can take three forms. Namely,
              Guidescan2 understands the coordinate syntax "chrX:start-end", 
              gene symbols (case sensitive), and Entrez GeneIDs.
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
            <p id="valid_upload_formats" style={question_style}>
              File Upload Format
            </p>
            <p style={answer_style}>
              One can upload their query a BED file, GFF/GTF file, or TXT file to be processsed.
              Standard BED and GTF formats are expected.
              For a TXT file, the site expects a file composed of a single column of genomic coordinates
              of the form chrX:start-end just as in
              the textbox input. This TXT file should have one genomic coordinate per line. Note that
              Guidescan2 expects standard file extensions (i.e. .txt/.bed/.gff/.gtf) for file uploads.

              <br/><br/>

              The exact specificiations used for BED and GFF/GTF files are from the following places:
           </p>

            <ul style={answer_style}>
            <li>BED: <a href="https://m.ensembl.org/info/website/upload/bed.html">m.ensembl.org/info/website/upload/bed.html</a></li>
            <li>GFF/GTF: <a href="https://m.ensembl.org/info/website/upload/gff.html">m.ensembl.org/info/website/upload/gff.html</a></li>
            </ul>

            <p style={answer_style}>
              We provide working examples where we use the same regions across all examples for clarity.<br/><br/>
              <div style={{fontStyle: "italic", textAlign: "center"}}>Example of a valid TXT file upload:</div>
              <hr/>
              <code style={{textAlign: "center"}}>
                chr4:312000-320000<br/>
                chr4:312000-313000<br/>
                chr4:312000-315000<br/>
              </code>
              <hr/>

              <div style={{fontStyle: "italic", textAlign: "center"}}>Example of a valid BED file upload:</div>
              <hr/>
              <code style={{textAlign: "center"}}>
                chr4&emsp;312000&emsp;320000&emsp;chr_4_example_1&emsp;0&emsp;+<br/>
                chr4&emsp;312000&emsp;313000&emsp;chr_4_example_2&emsp;0&emsp;+<br/>
                chr4&emsp;312000&emsp;315000&emsp;chr_4_example_3&emsp;0&emsp;+<br/>
              </code>
              <hr/>

              <div style={{fontStyle: "italic", textAlign: "center"}}>Example of a valid GFF/GTF file upload:</div>
              <hr/>
              <code style={{textAlign: "center"}}>
                chr4&emsp;example_1&emsp;interval&emsp;312000&emsp;320000&emsp;.&emsp;+&emsp;.&emsp;.<br/>
                chr4&emsp;example_2&emsp;interval&emsp;312000&emsp;313000&emsp;.&emsp;+&emsp;.&emsp;.<br/>
                chr4&emsp;example_3&emsp;interval&emsp;312000&emsp;315000&emsp;.&emsp;+&emsp;.&emsp;.<br/>
              </code>
              <hr/>
            </p>
          </Col>
        </Row>
        <hr style={{border: "2px solid black"}}/>
        <Row>
          <Col>
            <p style={tool_style} id="screen_design_introduction">
              Screen Design Tool
            </p>
            <p style={answer_style}>
              GuideScan2 analysis identified widespread confounding effects of low-specificity
              gRNAs in published CRISPR knockout,
              interference and activation screens and enabled construction of a ready-to-use
              gRNA library that reduced off-target effects in a novel gene essentiality screen. The screen design
              tool provides an interface to design CRISPR screens using this library. Complete details
              for the  Guidescan2 libraries can be found in our paper.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p style={question_style} id="screen_design_textbox">
              Textbox Input Format
            </p>
            <p style={answer_style}>
              The Guidescan2 libraries, and thus the screen design tool, work at the gene level. Genes
              should be input in a line delimited format as in the gRNA design tool. The key difference here,
              however, is that arbitrary genomic intervals are not accepted. Genes input are case sensitive and if
              a gene is not found, it will be reported to you in the output.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p style={question_style} id="screen_design_params">
              Parameters
            </p>
            <p style={answer_style}>
              The important configuration parameters for the tool are the number of gRNAs per gene and
              the percentage of control gRNAs. The Guidescan2 library covers each gene with six gRNAs, but we
              allow the user to reduce this number as necessary. The Guidescan2 library contains two types of
              control gRNAs, non-targeting and safe-targeting, which are described in our paper. When designing
              a screen, we allow users to specify the percentage of control guides as a fraction of the total
              library size. Similarly, we allow users to select a random set of essential genes to include in their
              screen as a fraction of the total library size.
            </p>
          </Col>
        </Row>
        <hr style={{border: "2px solid black"}}/>
        <Row>
          <Col>
            <p style={tool_style} id="grna_search">
              gRNA Search Tool
            </p>
            <p style={answer_style}>
              The gRNA search tool offers the ability to search for gRNAs in the Guidescan2
              databases directly by their sequence. Importantly, we note that this is 
              <b> not equivalent</b> to searching the sequence directly against the Guidescan2 indices as
              this database has already filtered gRNAs with multiple perfect matches.
              Unfortunately due to resource constraints we could not offer this feature on our website, but
              it is offered in the command line version of our tool. The tool requires that the gRNAs
              nearly perfectly match that found in the database. Thus if a gRNA is not returned by the search
              it could mean that either it is not a match in the database or that it was filtered out by
              Guidescan2.
            </p>
          </Col>
        </Row>
    </Card>
    </Container>
  );
}

export {AboutPage};
