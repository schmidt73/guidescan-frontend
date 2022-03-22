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
      at: <a href="https://github.com/schmidt73/guidescan-cli">github.com/schmidt73/guidescan-cli</a>.
      Common use cases and complete documentation is well-described in the attached manual. 
      For ease of use we make available a set of pre-constructed indices for several genomes that
      can be used with the command line version of our software for a variety of tasks. In addition,
      we provide the raw Guidescan2 databases produced by our tool for several organism-enzyme
      combinations in a compressed BAM format. The exact details of the format are described in the software
      manual.<br/><br/>
      <h4 style={{textAlign: "center"}}>Guidescan2 Indices:</h4>
      <br/>
      <table class="table">
      <thead>
      <tr>
      <th scope="col">#</th>
      <th scope="col">Organism</th>
      <th scope="col">Shorthand</th>
      <th scope="col">RefSeq Accession</th>
      <th scope="col">Download</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <th scope="row">1</th>
      <td>Fruit Fly</td>
      <td>dm6</td>
      <td>GCF_000001215.4</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">2</th>
      <td>Human</td>
      <td>hg38</td>
      <td>GCF_000001405.39</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">3</th>
      <td>House Mouse</td>
      <td>mm10</td>
      <td>GCF_000001635.26</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">4</th>
      <td>House Mouse</td>
      <td>mm39</td>
      <td>GCF_000001635.27</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">5</th>
      <td>Baker's Yeast</td>
      <td>sacCer3</td>
      <td>GCF_000146045.2</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">6</th>
      <td>Norway Rat</td>
      <td>rn6</td>
      <td>GCF_015227675.2</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">7</th>
      <td>Nematode</td>
      <td>ce11</td>
      <td>GCF_000002985.6</td>
      <td></td>
      </tr>
      </tbody>
      </table>
      <br/>
      <h4 style={{textAlign: "center"}}>Guidescan2 Databases:</h4>
      <br/>
      <table class="table">
      <thead>
      <tr>
      <th scope="col">#</th>
      <th scope="col">Organism</th>
      <th scope="col">Shorthand</th>
      <th scope="col">Enzyme</th>
      <th scope="col">RefSeq Accession</th>
      <th scope="col">Download</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <th scope="row">1</th>
      <td>Fruit Fly</td>
      <td>dm6</td>
      <td>cas9</td>
      <td>GCF_000001215.4</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">2</th>
      <td>Human</td>
      <td>hg38</td>
      <td>cpf1</td>
      <td>GCF_000001405.39</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">3</th>
      <td>Human</td>
      <td>hg38</td>
      <td>cas9</td>
      <td>GCF_000001405.39</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">4</th>
      <td>House Mouse</td>
      <td>mm10</td>
      <td>cpf1</td>
      <td>GCF_000001635.26</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">5</th>
      <td>House Mouse</td>
      <td>mm10</td>
      <td>cas9</td>
      <td>GCF_000001635.26</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">6</th>
      <td>House Mouse</td>
      <td>mm39</td>
      <td>cas9</td>
      <td>GCF_000001635.27</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">7</th>
      <td>Baker's Yeast</td>
      <td>sacCer3</td>
      <td>cas9</td>
      <td>GCF_000146045.2</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">8</th>
      <td>Norway Rat</td>
      <td>rn6</td>
      <td>cas9</td>
      <td>GCF_015227675.2</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">9</th>
      <td>Nematode</td>
      <td>ce11</td>
      <td>cpf1</td>
      <td>GCF_000002985.6</td>
      <td></td>
      </tr>
      <tr>
      <th scope="row">10</th>
      <td>Nematode</td>
      <td>ce11</td>
      <td>cas9</td>
      <td>GCF_000002985.6</td>
      <td></td>
      </tr>
      </tbody>
      </table>
    </p>
      </Col>
      </Row>
    </Card>
    </Container>
  );
}

export {DownloadsPage};
