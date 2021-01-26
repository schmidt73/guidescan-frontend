import React from 'react';
import * as R from 'ramda';

import {ItemSelectorInput, TextInput, CheckboxInput} from 'queryForm';

import {getInfoSupported} from 'jobs/rest';
import {immutableSetState} from 'utils';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

class ToggledBoundIntegerInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(e) {
    if (e.target.value > this.props.max) {
      return this.props.onValueChange(this.props.max);
    } else if (e.target.value < this.props.min) {
      return this.props.onValueChange(this.props.min);
    }

    this.props.onValueChange(e.target.value);
  }

  handleCheckedChange(e) {
    this.props.onCheckedChange(e.target.value);
  }

  render() {
    return (
      <Form style={this.props.style} inline>
        <Form.Check
          type={"checkbox"}
          id={"toggledNumericInputCheckbox-" + this.props.name}
          checked={this.props.checked}
          label={this.props.display}
          onChange={this.handleCheckedChange}/>
        <input
          style={{marginLeft: "0.5em"}}
          type="number"
          step="1"
          min={this.props.min}
          max={this.props.max}
          value={this.props.value}
          disabled={!this.props.checked}
          onChange={this.handleValueChange}/>
      </Form>
    );
  }
}

class LibraryQueryForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleQueryTextChange = this.handleQueryTextChange.bind(this);
    this.handleOrganismSelectionChange = this.handleOrganismSelectionChange.bind(this);
    this.handleNumPoolsCheckedChange = this.handleNumPoolsCheckedChange.bind(this);
    this.handleNumPoolsValueChange = this.handleNumPoolsValueChange.bind(this);
    this.handleNumEssentialCheckedChange = this.handleNumEssentialCheckedChange.bind(this);
    this.handleNumEssentialValueChange = this.handleNumEssentialValueChange.bind(this);
    this.handleNumControlCheckedChange = this.handleNumControlCheckedChange.bind(this);
    this.handleNumControlValueChange = this.handleNumControlValueChange.bind(this);
    this.handleSaturationCheckedChange = this.handleSaturationCheckedChange.bind(this);
    this.handleSaturationValueChange = this.handleSaturationValueChange.bind(this);
    this.handlePrime5CheckedChange = this.handlePrime5CheckedChange.bind(this);

    this.available_organisms = ["b6", "hg38"];

    this.state = {
      available_organisms: ["b6", "hg38"],
      organism: this.available_organisms[0],
      query_text: "Ccl5\nTrp53",
      num_pools: {
        enabled: false,
        value: 1
      },
      num_control: {
        enabled: false,
        value: 0
      },
      num_essential: {
        enabled: false,
        value: 0
      },
      saturation: {
        enabled: false,
        value: 6
      },
      prime5_g: false,
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleOrganismSelectionChange(t) {
    this.setState({organism: t});
  }

  handleQueryTextChange(t) {
    this.setState({query_text: t});
  }

  onFormSubmit() {
    this.props.handleSubmit(this.state);
  }

  handlePrime5CheckedChange(t) {
    this.setState({prime5_g: !this.state.prime5_g});
  }

  handleNumEssentialCheckedChange(t) {
    const num_essential = R.assoc("enabled",
                              !this.state.num_essential.enabled,
                              this.state.num_essential);
    this.setState({num_essential: num_essential});
  }

  handleNumEssentialValueChange(t) {
    const num_essential = R.assoc("value", t, this.state.num_essential);
    this.setState({num_essential: num_essential});
  }

  handleNumControlCheckedChange(t) {
    const num_control = R.assoc("enabled",
                              !this.state.num_control.enabled,
                              this.state.num_control);
    this.setState({num_control: num_control});
  }

  handleNumControlValueChange(t) {
    const num_control = R.assoc("value", t, this.state.num_control);
    this.setState({num_control: num_control});
  }

  handleSaturationCheckedChange(t) {
    const saturation = R.assoc("enabled",
                              !this.state.saturation.enabled,
                              this.state.saturation);
    this.setState({saturation: saturation});
  }

  handleSaturationValueChange(t) {
    const saturation = R.assoc("value", t, this.state.saturation);
    this.setState({saturation: saturation});
  }

  handleNumPoolsCheckedChange(t) {
    const num_pools = R.assoc("enabled",
                              !this.state.num_pools.enabled,
                              this.state.num_pools);
    this.setState({num_pools: num_pools});
  }

  handleNumPoolsValueChange(t) {
    const num_pools = R.assoc("value", t, this.state.num_pools);
    this.setState({num_pools: num_pools});
  }

  render() {
    const italics_style = {fontStyle: "italic"};
    const center_style = {textAlign: "center"};
    const padding_style = (p) => ({padding: p});
    const margin_style = (m) => ({margin: m});

    return (
      <Container>
        <Card style={padding_style("2em")} className="bg-light">
          <h3 style={R.mergeRight(italics_style, margin_style("0 0 1em 0"))}>Library Design Tool</h3>
          <ItemSelectorInput
                onSelectionChange={this.handleOrganismSelectionChange}
                selection={this.state.organism}
                name="organism-selector"
                display="Organism:"
                items={this.state.available_organisms}/>
          <Row>
            <Col>
              <ToggledBoundIntegerInput
                style={margin_style("0.1em 0em 0.75em 0")}
                onCheckedChange={this.handleNumPoolsCheckedChange}
                onValueChange={this.handleNumPoolsValueChange}
                name="num-pools-input"
                min={1}
                max={36}
                checked={this.state.num_pools.enabled}
                value={this.state.num_pools.value}
                display="Number of Pools:"/>
              <ToggledBoundIntegerInput
                style={margin_style("0 0em 0.75em 0")}
                onCheckedChange={this.handleNumEssentialCheckedChange}
                onValueChange={this.handleNumEssentialValueChange}
                name="num-essential-input"
                min={0}
                max={250}
                checked={this.state.num_essential.enabled}
                value={this.state.num_essential.value}
                display="Number of Essential Genes (Per Pool):"/>
              <CheckboxInput
                style={margin_style("0 0 0 0")}
                onCheckedChange={this.handlePrime5CheckedChange}
                name="prime5-g-annotated"
                checked={this.state.prime5_g}
                display="Append 5' G to gRNA"/>
            </Col>
            <Col>
              <ToggledBoundIntegerInput
                style={margin_style("0.1em 0em 0.75em 0")}
                onCheckedChange={this.handleSaturationCheckedChange}
                onValueChange={this.handleSaturationValueChange}
                name="saturation-input"
                min={1}
                max={20}
                checked={this.state.saturation.enabled}
                value={this.state.saturation.value}
                display="Number of Guides Per Gene:"/>
              <ToggledBoundIntegerInput
                style={margin_style("0 0em 0.75em 0")}
                onCheckedChange={this.handleNumControlCheckedChange}
                onValueChange={this.handleNumControlValueChange}
                name="control-input"
                min={0}
                max={25000}
                checked={this.state.num_control.enabled}
                value={this.state.num_control.value}
                display="Number of Control Guides (Per Pool):"/>
            </Col>
          </Row>
          <TextInput
            display={
              <h5 style={{padding: "1em 0 0.5em 0"}}>
                Input genes to design gRNA library against:
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

export {LibraryQueryForm};
