import React, { Component, PropTypes } from 'react';
import { FormElements } from './form-elements.js';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps  } from 'react-object-utils';

class FormSelect extends React.Component {
    

    static buildData( props ) {
        let input;
        if ( props.hasOwnProperty( 'input' ) && typeof props.input!='undefined' && props.input.length >0 ) {
            input = props.input;
        } else if(props.hasOwnProperty('data') && props.data.length >0) {
            input=props.data[0].value;
        }

        return input;
    }

    constructor( props ) {
        super( props );
        this.state = cloneProps(props);
        this.handleChange = this.handleChange.bind( this );
        this.handleSubmitCheck=this.handleSubmitCheck.bind(this);
    }

    handleSubmitCheck() {
        this.handleValidate();
    }

    matchOptions( input ) {
        for (let id in this.state.data) {
            if ( input == this.state.data[id].value ) {
                return true;
            }
        }
        return false;
    }

    handleValidate() {

        const target = cloneObject( this.state );
        if ( this.state.required && !this.matchOptions( this.state.input ) ) {
            target['classNameSelectCell'] = this.state.classNameSelectCellError
            target['classNameSelectOption'] = this.state.classNameSelectOptionError;
            target['classNameSelect']=this.state.classNameSelectError;
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target, false );
        } else {
            target['classNameSelectCell'] = this.state.classNameSelectCellefault;
            target['classNameSelectOption'] = this.state.classNameSelectOptionDefault;
            target['classNameSelect']=this.state.classNameSelectDefault;
            this.props.onValidate( this.state.dataPath, this.state.displayPath, target, true );
        }
    }
    
    componentWillReceiveProps( props ) {
        this.props.root.deleteSubmitCheck( this.state.dataPath );
        this.setState( cloneProps( props ) );
        this.props.root.registerSubmitCheck( props.dataPath, this.handleSubmitCheck );
    }
    
    componentWillUnmount() {
        this.props.root.deleteSubmitCheck( this.state.dataPath );
    }

    componentDidMount() {
        this.props.root.registerSubmitCheck( this.state.dataPath, this.handleSubmitCheck );
    }

    handleChange( e ) {
        const state=cloneObject(this.state);
        state.input=e.target.value;
        this.setState(state);
        this.props.onChange( this.state.dataPath, this.state.displayPath, state );
    }

    renderFields() {
        const instance=this;
        let id=0;
        return this.state.data.map(function (opt) {
            const key=instance.state.displayPath.join('-') + '-option-' + id++;
            return (<option key={key} className={instance.state.classNameSelectOption} defaultValue={instance.state.input === opt.value} value={opt.value}>{opt.label}</option>)
        });
    }


    render() {
        
        const value=this.state.input==null ? "" : this.state.input;
        return (
            < div className={this.state.classNameSelectRow} >
                {this.state.label != "" ? <div className={this.state.classNameSelectHeader} >{this.state.label}</div> : ""}
                <div className={this.state.classNameSelectCell}><select disabled={this.state.disabled} className={this.state.classNameSelect} value={value} onChange={this.handleChange}>
                {this.renderFields()}
                </select>
                </div>
            </div>
        );
    }
}

const css={
    classNameSelectRow: "rfFormSelectRow",
    classNameSelectHeader: "rfFormSelectHeader",
    classNameSelectCell: "rf-form-select-cell",
    classNameSelectCellDefault: "rf-form-select-cell",
    classNameSelectCellError: "rf-form-select-cell-error",
    classNameSelect: "rfFormSelect",
    classNameSelectDefault: "rfFormSelect",
    classNameSelectError: "rfFormSelectError",
    classNameSelectOption: "rf-form-select-option",
    classNameSelectOptionDefault: "rf-form-select-option",
    classNameSelectOptionError: "rf-form-select-option-error",
};

FormSelect.defaultProps = {
    handleUpdate: function( state ) { },
    input: "",
    data: [],
    label: "",
    disabled: false,
    name: 'default-select',
};

Object.assign(FormSelect.defaultProps,css);
FormElements['select'] = FormSelect;