import React, { Component, PropTypes } from 'react';
import { FormElements } from './form-elements.js';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps } from 'react-object-utils';
import ReactQuill, { Quill, Mixin, Toolbar } from 'react-quill';


class FormQuill extends React.Component {

    static buildData( props ) {

        const input = props.hasOwnProperty( 'input' ) ? props.input : FormQuill.defaultProps.input;
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

        const target = cloneObject( this.state );
        if ( ( this.state.required && this.state.input.length <= 0 ) || !this.props.validate( this.state.input ) ) {
            target['classNameInputText'] = this.props.classNameInputTextCheckFailed;
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target, false );
        } else {
            target['classNameInputText'] = this.props.classNameInputTextDefault;
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target, true );
        }
    }

    componentWillUnmount() {
        this.props.root.deleteSubmitCheck( this.state.dataPath );
    }

    componentDidMount() {
        this.props.root.registerSubmitCheck( this.state.dataPath, this.handleSubmitCheck );
    }

    handleChange( e ) {


        this.state.input = e;

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
                    <ReactQuill theme="snow" modules={{ toolbar: this.state.toolbarOptions }} ref={( ref ) => this.quill = ref} value={this.state.input} onChange={this.handleChange} />
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


FormQuill.defaultProps = {
    onChange: function( displayPath, dataPath, props ) { },
    input: "",
    name: 'default-input',
    label: "Input:",
    disabled: false,
    displayPath: [],
    dataPath: [],
    required: false,
    validate: function() { return true },
    toolbarOptions: [
        [{'background': []},
            'bold',
            { font: []},
            {color: []},
            'code',
            'italic',
            'link',
            'strike',
            'underline'],
        ['blockquote',
            { 'header': [1, 2, 3, 4, 5, 6, false] },
            { 'indent': '-1' }, { 'indent': '+1' },
            { 'list': 'ordered' }, { 'list': 'bullet' },
            { 'align': [] },
            { 'direction': 'rtl' },
            'code-block'],
        ['formula',
            'image',
            'video']
    ],
};


FormElements['quill'] = FormQuill;

Object.assign( FormQuill.defaultProps, css );


// end of the package
