import React, { Component, PropTypes } from 'react';
import { FormElements  } from './form-elements.js';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps  } from 'react-object-utils';

class FormAutoComplete extends React.Component {

    static buildData( props ) {

        const input = props.hasOwnProperty( 'input' ) ? props.input : FormAutoComplete.defaultProps.input;
        return input == null ? "" : input;
    }

    constructor( props ) {
        super( props );
        this.state = cloneProps( props );
        this.handleChange = this.handleChange.bind( this );
        this.handleSubmitCheck = this.handleSubmitCheck.bind( this );
    }

    handleSubmitCheck() {
        this.handleValidate();

    }

    handleValidate() {

        const target = cloneObject(this.state);
        if ( (this.state.required && this.state.input.length <= 0) || !this.props.validate(this.state.input) ) {
            target['classNameInputText'] = this.props.classNameInputTextCheckFailed;
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target,false );
        } else {
            target['classNameInputText'] = this.props.classNameInputTextDefault;
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target,true );
        }
    }
    
    componentWillUnmount() {
        this.props.root.deleteSubmitCheck( this.state.dataPath );
    }

    componentDidMount() {
        this.props.root.registerSubmitCheck( this.state.dataPath, this.handleSubmitCheck );
    }

    handleChange( e ) {

        this.state.input = e.target.value;
        this.props.onChange( this.state.dataPath, this.state.displayPath, this.state );
    }

    componentWillReceiveProps( props ) {
        this.props.root.deleteSubmitCheck( this.state.dataPath );
        this.setState( cloneProps( props ) );
        this.props.root.registerSubmitCheck( props.dataPath, this.handleSubmitCheck );
    }

    renderOptions () {
        const list=[];
        for(let id in this.state.data) {
            const path=this.state.displayPath.slice(0);
            path.push('input-opt',id);
            const key=this.props.root.genKey(path);
            list.push(<option key={key} value={this.state.data[id]} />);
        }
        return list;
    }

    render() {

        const idPath=this.state.displayPath.slice(0);
        idPath.push(this.state.name,this.state.label);
        const id=this.props.root.genKey(idPath);
        return (
            < div className={this.state.classNameInputContainer} >
                <div className={this.state.classNameInputLabel}>{this.state.label}</div>
                <input 
                    value={this.state.input}
                    disabled={this.state.disabled}
                    className={this.state.classNameInputText}
                    type="text"
                    onChange={this.handleChange}
                    list={id}
                />
                <datalist id={id}>
                {this.renderOptions()}
                </datalist>
            </div>
        );
    }
}

const css = {
    classNameInputText: "rf-FormDefaultsInputText",
    classNameInputTextCheckFailed: "rf-FormDefaultsInputTextfailed",
    classNameInputLabel: "rf-FormLabel",
    classNameInputContainer: "rf-form-input-container",
    classNameInputTextDefault: "rf-FormDefaultsInputText",
    classNameInputAutoComplete: "rf-auto-complete",
};

FormAutoComplete.defaultProps = {
    onChange: function( displayPath, dataPath, props ) { },
    input: "",
    name: 'default-input',
    label: "Input:",
    disabled: false,
    displayPath: [],
    dataPath: [],
    required: false,
    validate: function () { return true},
    data: [],
};


FormElements['text-autocomplete'] = FormAutoComplete;

Object.assign( FormAutoComplete.defaultProps, css );


// end of the package
