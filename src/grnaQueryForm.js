import React from 'react';
import * as R from 'ramda';

import {ItemSelectorInput, TextInput} from 'queryForm';

import {getInfoSupported} from 'jobs/rest';
import {immutableSetState} from 'utils';

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

    this.available_organisms = ["ce11"];
    this.available_enzymes = ["cas9"];

    this.state = {
      available_organisms: [],
      available_enzymes: [],
      organism: this.available_organisms[0],
      enzyme: this.available_enzymes[0],
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
    immutableSetState(this, {available_organisms: response.data["available-organisms"],
                             available_enzymes: response.data["available-enzymes"]});
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
                name="organism-selector"
                display="Organism:"
                items={this.state.available_organisms}/>
            </Col>
            <Col>
              <ItemSelectorInput
                onSelectionChange={this.handleEnzymeSelectionChange}
                selection={this.state.enzyme}
                name="enzyme-selector"
                display="Enzyme:"
                items={this.state.available_enzymes} />
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
          <Row className="justify-content-md-center">
            <Button 
              style={{marginTop: "1em"}}
              variant="primary" onClick={this.onFormSubmit}>
              Submit query
            </Button>
          </Row>
        </Card>
      </Container>
    );
  }
}

export {GrnaQueryForm};
