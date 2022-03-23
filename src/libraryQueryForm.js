import React from 'react';
import * as R from 'ramda';

import {ItemSelectorInput, TextInput, CheckboxInput, QuestionCircle} from './queryForm';

import {getInfoSupported, getExamples} from './jobs/rest';
import {immutableSetState} from './utils';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

class ToggledBoundNumericInput extends React.Component {
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
      <Form style={this.props.style} >
        <Row className="justify-content-md-left">
        <Col className="col-md-auto">
        <Form.Check
          style={{paddingTop: "0.35em"}}
          type={"checkbox"}
          id={"toggledNumericInputCheckbox-" + this.props.name}
          checked={this.props.checked}
          label={this.props.display}
          onChange={this.handleCheckedChange}/>
        </Col>
        <Col className="col-sm-2">
        <Form.Control
          style={{marginLeft: "-0.3em"}}
          type="number"
          step={this.props.step}
          min={this.props.min}
          max={this.props.max}
          value={this.props.value}
          disabled={!this.props.checked}
          onChange={this.handleValueChange}/>
        </Col>
        <Col className="col-md-auto" style={{marginLeft: "-1.5em", paddingTop: "0.2em"}}> {this.props.tooltip ? <QuestionCircle description={this.props.tooltip}/> : null} </Col>
        </Row>
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

    this.onLoadExamplesSuccess = this.onLoadExamplesSuccess.bind(this);
    this.onLoadExamplesFailure = this.onLoadExamplesFailure.bind(this);

    this.loadExamples = () =>
      getExamples(this.onLoadExamplesSuccess,
                  this.onLoadExamplesFailure,
                  'json');

    this.available_organisms = ["mm39", "hg38"];

    this.state = {
      available_organisms: ["mm39", "hg38"],
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

  componentWillUnmount() {
    this.loadExamplesToken.cancel();
  }
  
  componentDidMount() {
    this.loadExamplesToken = this.loadExamples();
    
    const to_bool = (s) => s ? (s === "true") : false; 

    const query_text = localStorage.getItem('lib_query_text');
    if (query_text) this.setState({query_text: query_text});

    const organism = localStorage.getItem('lib_organism');
    if (organism) this.setState({organism: organism});

    const fivepg = to_bool(localStorage.getItem('5pG'));
    if (fivepg) this.setState({prime5_g: fivepg});

    const num_control_enabled = to_bool(localStorage.getItem('num_control_enabled'));
    const num_control_value = localStorage.getItem('num_control_value');
    if (num_control_enabled && num_control_value) {
        this.setState({num_control: {enabled: num_control_enabled, value: num_control_value}});
    }

    const num_essential_enabled = to_bool(localStorage.getItem('num_essential_enabled'));
    const num_essential_value = localStorage.getItem('num_essential_value');
    if (num_essential_enabled && num_essential_value) {
        this.setState({num_essential: {enabled: num_essential_enabled, value: num_essential_value}});
    }

    const saturation_enabled = to_bool(localStorage.getItem('saturation_enabled'));
    const saturation_value = localStorage.getItem('saturation_value');
    if (saturation_enabled && saturation_value) {
        this.setState({saturation: {enabled: saturation_enabled, value: saturation_value}});
    }

    const num_pools_enabled = to_bool(localStorage.getItem('num_pools_enabled'));
    const num_pools_value = localStorage.getItem('num_pools_value');
    if (num_pools_enabled && num_pools_value) {
        this.setState({num_pools: {enabled: num_pools_enabled, value: num_pools_value}});
    }
  }

  handleOrganismSelectionChange(t) {
    immutableSetState(
      this, {
        organism: t,
        query_text: this.state.examples["library"][t]
    });
    
    localStorage.setItem('lib_organism', t);
  }

  handleQueryTextChange(t) {
    this.setState({query_text: t});
    localStorage.setItem('lib_query_text', t);
  }

  onFormSubmit() {
    this.props.handleSubmit(this.state);
  }

  handlePrime5CheckedChange(t) {
    const new_bool = !this.state.prime5_g;
    this.setState({prime5_g: new_bool});
    localStorage.setItem('5pG', new_bool);
  }

  handleNumEssentialCheckedChange(t) {
    const new_bool = !this.state.num_essential.enabled;
    const num_essential = R.assoc("enabled",
                              new_bool,
                              this.state.num_essential);
    this.setState({num_essential: num_essential});
    localStorage.setItem('num_essential_enabled', new_bool);
    localStorage.setItem('num_essential_value', this.state.num_essential.value);
  }

  onLoadExamplesFailure(error) {
  }

  onLoadExamplesSuccess(response) {
    immutableSetState(
      this, {
        examples: response.data,
        query_text: response.data["library"][this.state.organism]
    });

    const query_text = localStorage.getItem('lib_query_text');
    if (query_text) this.setState({query_text: query_text});
  }

  handleNumEssentialValueChange(t) {
    const num_essential = R.assoc("value", t, this.state.num_essential);
    this.setState({num_essential: num_essential});
    localStorage.setItem('num_essential_value', t);
  }

  handleNumControlCheckedChange(t) {
    const new_bool = !this.state.num_control.enabled;
    const num_control = R.assoc("enabled",
                              new_bool,
                              this.state.num_control);
    this.setState({num_control: num_control});
    localStorage.setItem('num_control_enabled', new_bool);
    localStorage.setItem('num_control_value', this.state.num_control.value);
  }

  handleNumControlValueChange(t) {
    const num_control = R.assoc("value", t, this.state.num_control);
    this.setState({num_control: num_control});
    localStorage.setItem('num_control_value', t);
  }

  handleSaturationCheckedChange(t) {
    const new_bool = !this.state.saturation.enabled;
    const saturation = R.assoc("enabled",
                              new_bool,
                              this.state.saturation);
    this.setState({saturation: saturation});
    localStorage.setItem('saturation_enabled', new_bool);
    localStorage.setItem('saturation_value', this.state.saturation.value);
  }

  handleSaturationValueChange(t) {
    const saturation = R.assoc("value", t, this.state.saturation);
    this.setState({saturation: saturation});
    localStorage.setItem('saturation_value', t);
  }

  handleNumPoolsCheckedChange(t) {
    const new_bool = !this.state.num_pools.enabled;
    const num_pools = R.assoc("enabled",
                              new_bool,
                              this.state.num_pools);
    this.setState({num_pools: num_pools});
    localStorage.setItem('num_pools_enabled', new_bool);
    localStorage.setItem('num_pools_value', this.state.num_pools.value);
  }

  handleNumPoolsValueChange(t) {
    const num_pools = R.assoc("value", t, this.state.num_pools);
    this.setState({num_pools: num_pools});
    localStorage.setItem('num_pools_value', t);
  }

  render() {
    const italics_style = {fontStyle: "italic"};
    const center_style = {textAlign: "center"};
    const padding_style = (p) => ({padding: p});
    const margin_style = (m) => ({margin: m});

    return (
      <Container>
        <Card style={padding_style("2em")} className="bg-light">
          <h3 style={R.mergeRight(italics_style, margin_style("0 0 0.5em 0"))}>Gene-targeting Library</h3>
          <h5 style={margin_style("0 0 1em 0")}>
            Search within GuideScan2 pre-constructed experimentally validated gene-targeting library for mouse or human
          </h5>
          <ItemSelectorInput
                onSelectionChange={this.handleOrganismSelectionChange}
                selection={this.state.organism}
                name="organism-selector"
                display="Organism:"
                items={this.state.available_organisms}/>
          <Row>
            <Col>
              <ToggledBoundNumericInput
                style={margin_style("1.75em 0em 0.75em 0")}
                onCheckedChange={this.handleNumPoolsCheckedChange}
                onValueChange={this.handleNumPoolsValueChange}
                name="num-pools-input"
                step={1}
                min={1}
                max={36}
                tooltip="Split genes across different pools each flanked by a different barcode for easy identification. NEED REAL INFO HERE."
                checked={this.state.num_pools.enabled}
                value={this.state.num_pools.value}
                display="Number of Pools:"/>
              <ToggledBoundNumericInput
                style={margin_style("1.4em 0em 0.75em 0")}
                onCheckedChange={this.handleNumEssentialCheckedChange}
                onValueChange={this.handleNumEssentialValueChange}
                name="num-essential-input"
                min={0}
                max={1}
                step={0.05}
                tooltip="Creates a set of essential control genes. The number of essential genes is expressed as a fraction of total library size."
                checked={this.state.num_essential.enabled}
                value={this.state.num_essential.value}
                display="Percentage of Essential Genes (Per Pool):"/>
              <CheckboxInput
                style={margin_style("0 0 0 0")}
                onCheckedChange={this.handlePrime5CheckedChange}
                name="prime5-g-annotated"
                tooltip="Replace 5' nucleotide of gRNAs with G for U6 promoter compatibility."
                checked={this.state.prime5_g}
                display="Append 5' G to gRNA"/>
            </Col>
            <Col>
              <ToggledBoundNumericInput
                style={margin_style("1.75em 0em 0.75em 0")}
                onCheckedChange={this.handleSaturationCheckedChange}
                onValueChange={this.handleSaturationValueChange}
                name="saturation-input"
                min={1}
                step={1}
                max={6}
                tooltip="Number of gRNAs that target each gene. The value must be between 1 and 6 as the Guidescan2 library saturates each gene with 6 guides."
                checked={this.state.saturation.enabled}
                value={this.state.saturation.value}
                display="Number of Guides Per Gene:"/>
              <ToggledBoundNumericInput
                style={margin_style("1.4em 0em 0.75em 0")}
                onCheckedChange={this.handleNumControlCheckedChange}
                onValueChange={this.handleNumControlValueChange}
                name="control-input"
                min={0}
                max={1}
                tooltip="Creates a set of non-targeting and safe-targeting control guides. The number of control guides is expressed as a fraction of total library size."
                step={0.05}
                checked={this.state.num_control.enabled}
                value={this.state.num_control.value}
                display="Percentage of Control Guides (Per Pool):"/>
            </Col>
          </Row>
          <hr style={{marginBottom: "-0.2em"}}/>
          <TextInput
            display={
              <h5 style={{padding: "1em 0 0.5em 0"}}>
                Input genes to design gRNA library against:
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

export {LibraryQueryForm};
