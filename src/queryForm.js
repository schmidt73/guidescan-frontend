import React from 'react';
import * as R from 'ramda';

import {getInfoSupported, getExamples} from 'jobs/rest';
import {immutableSetState} from 'utils';

import bsCustomFileInput from 'bs-custom-file-input';

import {Popover, OverlayTrigger} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const QuestionPopover = (props) => (
    <Popover id="popover-basic">
        <Popover.Title as="h3">Description</Popover.Title>
        <Popover.Content> 
            {props.description}
        </Popover.Content>
    </Popover>
);

const QuestionCircle = (props) => {
  const style = R.mergeLeft(props.style ? props.style : {}, {"fontSize": "1.3rem", "padding": "0 0.5em 0 0.5em"}); 
  return (
    <OverlayTrigger trigger={["focus", "hover"]} placement="right" overlay={QuestionPopover(props)}>
      <i className="bi-question-circle" style={style}></i>
    </OverlayTrigger>
  );
};

class ItemSelectorInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    if ('predicate' in this.props) {
      this.predicate = this.props.predicate;
    } else {
      this.predicate = (e) => true;
    }
  }

  handleChange(e) {
    if (this.predicate(e.target.value)) this.props.onSelectionChange(e.target.value);
  }

  render() {
    const items = R.map(
      (value) => <option key={value}>{value}</option>,
      this.props.items
    );

    return (
      <Form.Group as={Row} controlId={"itemSelector." + this.props.name}>
        <Form.Label column xs="auto">{this.props.display}</Form.Label>
        <Col>
          <Form.Control as="select" onChange={this.handleChange}
                        value={this.props.selection}custom>
            {items}
          </Form.Control>
        </Col>
      </Form.Group>
    );
  }
}

class ToggledIntegerInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(e) {
    if (e.target.value < 0) {
      return this.props.onValueChange(0);
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
          value={this.props.value}
          disabled={!this.props.checked}
          onChange={this.handleValueChange}/>
        {this.props.tooltip ? <QuestionCircle description={this.props.tooltip}/> : null}
      </Form>
    );
  }
}

class ToggledDecimalInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(e) {
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
          step="0.1"
          min="0"
          max="1"
          value={this.props.value}
          disabled={!this.props.checked}
          onChange={this.handleValueChange}/>
        {this.props.tooltip ? <QuestionCircle description={this.props.tooltip}/> : null}
      </Form>
    );
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTextChange(e.target.value);
  }

  render() {
    return (
      <Form.Group controlId={"textInput" + this.props.name}>
        <Form.Label style={{}}>{this.props.display}</Form.Label>
        <Form.Control as="textarea" rows="3" onChange={this.handleChange}
                      value={this.props.text}/>
      </Form.Group>
    );
  }
}

class CheckboxInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onCheckedChange(e.target.value);
  }

  render() {
    return (
      <Form style={this.props.style} inline>
        <Form.Check
          type={"checkbox"}
          id={"checkbox-" + this.props.name}
          checked={this.props.checked}
          label={this.props.display}
          onChange={this.handleChange}/>
        {this.props.tooltip ? <QuestionCircle description={this.props.tooltip}/> : null}
      </Form>
    );
  }
}

class QueryForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleQueryTextChange = this.handleQueryTextChange.bind(this);
    this.handleFlankingCheckedChange = this.handleFlankingCheckedChange.bind(this);
    this.handleFlankingValueChange = this.handleFlankingValueChange.bind(this);
    this.handleTopNCheckedChange = this.handleTopNCheckedChange.bind(this);
    this.handleTopNValueChange = this.handleTopNValueChange.bind(this);
    this.handleFilterAnnotatedChange = this.handleFilterAnnotatedChange.bind(this);
    this.handleOrganismSelectionChange = this.handleOrganismSelectionChange.bind(this);
    this.handleEnzymeSelectionChange = this.handleEnzymeSelectionChange.bind(this);
    this.handleSpecificityFilterCheckedChange = this.handleSpecificityFilterCheckedChange.bind(this);
    this.handleSpecificityFilterValueChange = this.handleSpecificityFilterValueChange.bind(this);
    this.handleCEFilterCheckedChange = this.handleCEFilterCheckedChange.bind(this);
    this.handleCEFilterValueChange = this.handleCEFilterValueChange.bind(this);

    this.onLoadExamplesSuccess = this.onLoadExamplesSuccess.bind(this);
    this.onLoadExamplesFailure = this.onLoadExamplesFailure.bind(this);

    this.onLoadInfoSuccess = this.onLoadInfoSuccess.bind(this);
    this.onLoadInfoFailure = this.onLoadInfoFailure.bind(this);

    this.loadInfoSupported = () =>
      getInfoSupported(this.onLoadInfoSuccess,
                       this.onLoadInfoFailure,
                       'json');

    this.loadExamples = () =>
      getExamples(this.onLoadExamplesSuccess,
                  this.onLoadExamplesFailure,
                  'json');

    this.available= [{"organism": "ce11", "enzyme": "cas9"}];

    this.state = {
      available: [],
      examples: {},
      organism: this.available[0]["organism"],
      enzyme: this.available[0]["enzyme"],
      query_text: "chrIV:1100-45000",
      specificity_filter: {
        enabled: false,
        value: 0,
      },
      ce_filter: {
        enabled: false,
        value: 0,
      },
      flanking: {
        enabled: false,
        value: 1000
      },
      top_n: {
        enabled: false,
        value: 5,
      },
      filter_annotated_grnas: false,
      fileInput: React.createRef()
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentDidMount() {
    bsCustomFileInput.init();
    this.loadSource = this.loadInfoSupported();
    this.loadExamplesToken = this.loadExamples();
  }

  componentWillUnmount() {
    this.loadSource.cancel();
    this.loadExamplesToken.cancel();
  }

  onLoadExamplesSuccess(response) {
    immutableSetState(
      this, {
        examples: response.data,
        query_text: response.data["coords"][this.state.organism][this.state.enzyme]
    });
  }

  onLoadExamplesFailure(error) {
  }

  onLoadInfoSuccess(response) {
    immutableSetState(this, {available: response.data["available"]});
  }

  onLoadInfoFailure(error) {
  }

  handleOrganismSelectionChange(t) {
    immutableSetState(
      this, {
        organism: t,
        query_text: this.state.examples["coords"][t][this.state.enzyme]
    });
  }

  handleEnzymeSelectionChange(t) {
    immutableSetState(
      this, {
        enzyme: t,
        query_text: this.state.examples[this.state.organism][t]["coords"]
    });
  }

  handleFilterAnnotatedChange(t) {
    this.setState({filter_annotated_grnas: !this.state.filter_annotated_grnas});
  }

  handleQueryTextChange(t) {
    this.setState({query_text: t});
  }

  handleFlankingCheckedChange(t) {
    const flanking = R.assoc("enabled", !this.state.flanking.enabled, this.state.flanking);
    this.setState({flanking: flanking});
  }

  handleFlankingValueChange(t) {
    const flanking = R.assoc("value", t, this.state.flanking);
    this.setState({flanking: flanking});
  }

  handleTopNCheckedChange(t) {
    const top_n = R.assoc("enabled", !this.state.top_n.enabled, this.state.top_n);
    this.setState({top_n: top_n});
  }

  handleTopNValueChange(t) {
    const top_n = R.assoc("value", t, this.state.top_n);
    this.setState({top_n: top_n});
  }

  handleSpecificityFilterCheckedChange(t) {
    const s_filter = R.assoc("enabled",
                             !this.state.specificity_filter.enabled,
                             this.state.specificity_filter);
    this.setState({specificity_filter: s_filter});
  }

  handleSpecificityFilterValueChange(t) {
    const s_filter = R.assoc("value", t, this.state.specificity_filter);
    this.setState({specificity_filter: s_filter});
  }

  handleCEFilterCheckedChange(t) {
    const ce_filter = R.assoc("enabled",
                              !this.state.ce_filter.enabled,
                              this.state.ce_filter);
    this.setState({ce_filter: ce_filter});
  }

  handleCEFilterValueChange(t) {
    const ce_filter = R.assoc("value", t, this.state.ce_filter);
    this.setState({ce_filter: ce_filter});
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
      (m.enzyme == e) && (m.organism = this.state.organism)
    ));

    const organism_predicate = (o) => (this.state.available.some((m) =>
      (m.enzyme == this.state.enzyme) && (m.organism = o)
    ));

    available_enzymes = Array.from(available_enzymes);
    available_organisms = Array.from(available_organisms);

    return (
      <Container>
        <Card style={padding_style("2em")} className="bg-light">
          <h3 style={R.mergeRight(italics_style, margin_style("0 0 0.5em 0"))}>gRNA Design Tool</h3>
          <h5 style={margin_style("0 0 1em 0")}>Finds Guidescan2 vetted gRNAs for genomic regions and genes</h5>
          <Row>
            <Col>
              <ItemSelectorInput
                onSelectionChange={this.handleOrganismSelectionChange}
                selection={this.state.organism}
                predicate={organism_predicate}
                name="organism-selector"
                display="Organism:"
                items={available_organisms}/>
              <ToggledIntegerInput
                style={margin_style("0 0em 0.75em 0")}
                onCheckedChange={this.handleFlankingCheckedChange}
                onValueChange={this.handleFlankingValueChange}
                name="flanking-input"
                tooltip="Searches for gRNAs in a region surrounding the input genomic region on both the left and right sides."
                checked={this.state.flanking.enabled}
                value={this.state.flanking.value}
                display="Flanking:"/>
              <ToggledDecimalInput
                style={margin_style("0 0em 0.85em 0")}
                onCheckedChange={this.handleCEFilterCheckedChange}
                onValueChange={this.handleCEFilterValueChange}
                name="cutting-efficiency-input"
                checked={this.state.ce_filter.enabled}
                value={this.state.ce_filter.value}
                tooltip="Returns only gRNAs with cutting efficiency above this value."
                display="Filter above cutting efficiency:"/>
              <CheckboxInput
                style={margin_style("0 0 0 0")}
                onCheckedChange={this.handleFilterAnnotatedChange}
                name="filter-annotated"
                tooltip="Returns only gRNAs that cut within RefSeq annotated exons."
                checked={this.state.filter_annotated_grnas}
                display="Filter exonic cutting gRNAs"/>
            </Col>
            <Col>
              <ItemSelectorInput
                onSelectionChange={this.handleEnzymeSelectionChange}
                selection={this.state.enzyme}
                predicate={enzyme_predicate}
                name="enzyme-selector"
                display="Enzyme:"
                items={available_enzymes} />
              <ToggledIntegerInput
                style={margin_style("0 1em 0.75em 0")}
                onCheckedChange={this.handleTopNCheckedChange}
                onValueChange={this.handleTopNValueChange}
                name="topn-input"
                tooltip="Returns only the best N gRNAs as ranked by their specificity score."
                checked={this.state.top_n.enabled}
                value={this.state.top_n.value}
                display="Top N gRNAs:" />
              <ToggledDecimalInput
                onCheckedChange={this.handleSpecificityFilterCheckedChange}
                onValueChange={this.handleSpecificityFilterValueChange}
                name="specificty-input"
                tooltip="Returns only gRNAs with specificity above this value."
                checked={this.state.specificity_filter.enabled}
                value={this.state.specificity_filter.value}
                display="Filter above specificity:"/>
            </Col>
          </Row>
          <hr style={margin_style("1.75em 0 1.75em 0")}/>
          <TextInput
            display={"Input genomic coordinates as chromosome:start-end, organism \
                      appropriate gene symbol, or Entrez GeneIDs. Submit one genomic coordinate per line.\
                      Alternatively, one can submit a genome sequence that will be searched within the genome\
                      of interest."}
            onTextChange={this.handleQueryTextChange}
            text={this.state.query_text}/>
          <h2 style={R.merge(italics_style, center_style)}>
            OR
          </h2>
          <div className="custom-file">
            <input id="fileInput" type="file" className="custom-file-input"
                   ref={this.state.fileInput}/>
            <label className="custom-file-label" htmlFor="fileInput">
              Submit BED, GFF/GTF, or TXT files containing genomic coordinates.
            </label>
          </div>
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

export {QueryForm, ItemSelectorInput, TextInput, ToggledDecimalInput, ToggledIntegerInput, CheckboxInput, QuestionCircle};

