import React, { Component, PropTypes } from 'react';
import { FormElements  } from './form-elements.js';
import { cloneObject, cloneProps  } from 'react-utility';
import { CompactPicker } from 'react-color';


class FormColorPicker extends React.Component {

    static buildData( props ) {

        const input = props.hasOwnProperty( 'input' ) ? props.input : FormColorPicker.defaultProps.input;
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

    handleChange( color,e ) {

        this.state.input = color.hex;
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
                <div className={this.state.classNameInputText}>
                <CompactPicker color={this.state.input} onChangeComplete={this.handleChange} />
                </div>
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

FormColorPicker.defaultProps = {
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


FormElements['color'] = FormColorPicker;


Object.assign( FormColorPicker.defaultProps, css );


// end of the package
