import React, { Component, PropTypes } from 'react';
import { FormElements  } from './form-elements.js';
import { cloneObject, cloneProps  } from 'react-utility';

class FormTextInput extends React.Component {

    static buildData( props ) {

        const input = props.hasOwnProperty( 'input' ) ? props.input : FormTextInput.defaultProps.input;
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


    render() {

        return (
            < div className={this.state.classNameInputContainer} >
                <div className={this.state.classNameInputLabel}>{this.state.label}</div>
                <input
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
    classNameInputText: "rfFormDefaultsInputText",
    classNameInputTextCheckFailed: "rfFormDefaultsInputTextfailed",
    classNameInputLabel: "rfFormLabel",
    classNameInputContainer: "rf-form-input-container",
    classNameInputTextDefault: "rfFormDefaultsInputText",
};

FormTextInput.defaultProps = {
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


FormElements['text'] = FormTextInput;

Object.assign( FormTextInput.defaultProps, css );


// end of the package
