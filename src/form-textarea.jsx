import React, { Component, PropTypes } from 'react';
import { FormElements } from './form-elements.js';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps  } from 'react-object-utils';

class FormTextArea extends React.Component {

    static buildData( props ) {

        const input = props.hasOwnProperty( 'input' ) ? props.input : FormTextArea.defaultProps.input;
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
        const instance=this;
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


    render() {

        return (
            < div className={this.state.classNameInputContainer} >
                <div className={this.state.classNameInputLabel}>{this.state.label}</div>
                
                <textarea
                    ref={(input) => this.input=input}
                    value={this.state.input}
                    disabled={this.state.disabled}
                    className={this.state.classNameInputText}
                    type="text"
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

const css = {
    classNameInputText: "rf-form-textarea",
    classNameInputTextCheckFailed: "rf-form-textarea-error",
    classNameInputLabel: "rf-form-label",
    classNameInputContainer: "rf-form-textarea-container",
    classNameInputTextDefault: "rf-form-textarea-container",
};

FormTextArea.defaultProps = {
    onChange: function( displayPath, dataPath, props ) { },
    input: "",
    name: 'default-input',
    label: "Input:",
    disabled: false,
    displayPath: [],
    dataPath: [],
    required: false,
    validate: function () { return true},
};

Object.assign(FormTextArea.defaultProps,css);

FormElements['textarea'] = FormTextArea;


// end of the package
