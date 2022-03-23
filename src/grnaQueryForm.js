import React from 'react';
import * as R from 'ramda';

import {ItemSelectorInput, TextInput} from './queryForm';

import {getInfoSupported} from './jobs/rest';
import {immutableSetState} from './utils';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

class GrnaQueryForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleQueryTextChange = this.handleQueryTextChange.bind(this);
    this.handleOrganismSelectionChange = this.handleOrganismSelectionChange.bind(this);
    this.handleEnzymeSelectionChange = this.handleEnzymeSelectionChange.bind(this);

    this.onLoadInfoSuccess = this.onLoadInfoSuccess.bind(this);
    this.onLoadInfoFailure = this.onLoadInfoFailure.bind(this);

    this.loadInfoSupported = () =>
      getInfoSupported(this.onLoadInfoSuccess,
                       this.onLoadInfoFailure,
                       'json');

    this.available= [{"organism": "ce11", "enzyme": "cas9"}];

    this.state = {
      available: [],
      organism: this.available[0]["organism"],
      enzyme: this.available[0]["enzyme"],
      query_text: "AACTTTAGTTACACATATGCNGG\nCCTCTATGGTAATTTGGTGTNGG",
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentDidMount() {
    this.loadSource = this.loadInfoSupported();
  }

  componentWillUnmount() {
    this.loadSource.cancel();
  }

  onLoadInfoSuccess(response) {
    immutableSetState(this, {available: response.data["available"]});
  }

  onLoadInfoFailure(error) {
  }

  handleOrganismSelectionChange(t) {
    this.setState({organism: t});
  }

  handleEnzymeSelectionChange(t) {
    this.setState({enzyme: t});
  }

  handleQueryTextChange(t) {
    this.setState({query_text: t});
  }

  onFormSubmit() {
    this.props.handleSubmit(this.state);
  }

  render() {
    const italics_style = {fontStyle: "italic"};
    const center_style = {textAlign: "center"};
    const padding_style = (p) => ({padding: p});
    const margin_style = (m) => ({margin: m});

    let available_enzymes   = new Set();
    let available_organisms = new Set();

    for (const i in this.state.available) {
      available_enzymes.add(this.state.available[i]["enzyme"]);
      available_organisms.add(this.state.available[i]["organism"]);
    }

    const enzyme_predicate = (e) => (this.state.available.some((m) =>
      (m.enzyme == e) && (m.organism == this.state.organism)
    ));

    const organism_predicate = (o) => (this.state.available.some((m) =>
      (m.enzyme == this.state.enzyme) && (m.organism == o)
    ));

    available_enzymes = Array.from(available_enzymes);
    available_organisms = Array.from(available_organisms);



    return (
      <Container>
        <Card style={padding_style("2em")} className="bg-light">
          <h3 style={R.mergeRight(italics_style, margin_style("0 0 0.5em 0"))}>gRNA Search</h3>
          <h5 style={margin_style("0 0 1em 0")}>Search for Guidescan2 vetted gRNAs by their sequence directly</h5>
          <Row>
            <Col>
              <ItemSelectorInput
                onSelectionChange={this.handleOrganismSelectionChange}
                selection={this.state.organism}
                predicate={organism_predicate}
                name="organism-selector"
                display="Organism:"
                items={available_organisms}/>
            </Col>
            <Col>
              <ItemSelectorInput
                onSelectionChange={this.handleEnzymeSelectionChange}
                selection={this.state.enzyme}
                predicate={enzyme_predicate}
                name="enzyme-selector"
                display="Enzyme:"
                items={available_enzymes} />
            </Col>
          </Row>
          <TextInput
            display={
              <h5 style={{padding: "1em 0 0.5em 0"}}>
                Input gRNAs of length 10-30nt to search against in the Guidescan database.
              </h5>
            }
            onTextChange={this.handleQueryTextChange}
            text={this.state.query_text}/>
          <Row className="justify-content-center">
            <Col className="col-auto">
            <Button 
              style={{marginTop: "1em"}}
              variant="primary" onClick={this.onFormSubmit}>
              Submit query
            </Button>
            </Col>
          </Row>
        </Card>
      </Container>
    );
  }
}

export {GrnaQueryForm};
