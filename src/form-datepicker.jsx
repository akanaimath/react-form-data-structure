/*
 * This class is simply a wrapper for: 
 * https://chmln.github.io/flatpickr/options/
 * 
 * For loading css, see: 
 * https://chmln.github.io/flatpickr/themes/
 * 
 * Time formatting tokents
 * https://chmln.github.io/flatpickr/formatting/
 */


import React, { Component, PropTypes } from 'react';
import { FormElements } from './form-elements.js';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps } from 'react-object-utils';
import flatpickr from "flatpickr";


class FormDatePicker extends React.Component {

    static buildData( props ) {

        const input = props.hasOwnProperty( 'input' ) ? props.input : FormDatePicker.defaultProps.input;
        return input == null ? new Date() : input;
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
        this.fp.destroy();
    }

    componentDidMount() {
        this.props.root.registerSubmitCheck( this.state.dataPath, this.handleSubmitCheck );
        const options = {};
        let input=this.state.input;
        
        if(input==null) {
            input=new Date();
        } 
        Object.assign( options, this.state.options, { defaultDate: input, mode: 'single',onChange: this.handleChange } );
        this.fp=flatpickr(this.input,options);
        
    }

    handleChange( dates, date, picker ) {

        this.state.input = date;
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
                ref={(ref)=> this.input=ref}
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

FormDatePicker.defaultProps = {
    onChange: function( displayPath, dataPath, props ) { },
    input: "",
    options: { enableTime: true, enableSeconds: true, dateFormat: "Y-m-d H:i:S" },
    name: 'default-input',
    label: "Input:",
    required: false,
    displayPath: [],
    dataPath: [],
    validate: function () { return true }
};


FormElements['datepicker'] = FormDatePicker;

Object.assign( FormDatePicker.defaultProps, css );


// end of the package
