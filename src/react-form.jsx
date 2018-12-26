'use strict';
import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { cloneObject, mergeObjects, cloneProps } from 'react-utility';
import { FormElements } from './form-elements.js';
import './form-input.js';
import { List } from './form-container-list.js';
import './form-container-hash.js';
import './form-checkbox.js';
import './form-radio-set.js';
import './form-select.js';
import './form-multi-select.js';
import './form-textarea.js';
import './form-password.js';
import './form-watch.js';
import './form-autocomplete.js';
import './form-datepicker.js';
import './form-quill.js';
import './form-color.js';


/**
 * Root form Container.  Used to contain states and manage configs
 */
class Form extends React.Component {
    static buildStateFromProps( props ) {
        const target = cloneProps( props, ['data'] );

        let data;
        if ( FormElements.hasOwnProperty( props.display.type ) ) {
            const display = cloneObject( props.display );
            display.displayPath = ['display']
            display.dataPath = ['data']
            data = FormElements[target.display.type].buildData( display );
        } else {
            data = {};
        }
        if ( props.hasOwnProperty( 'data' ) ) {
            data = mergeObjects( data, props.data );
        }
        target.data = data;

        return target;
    }

    /**
     * Object constructor
     * @param {Object} props
     */
    constructor( props ) {
        super( props );
        this.state = Form.buildStateFromProps( props );
        this.submitChecks = {};
        this.watch = {};

        this.handleChange = this.handleChange.bind( this );
        this.handleValidate = this.handleValidate.bind( this );

    }

    registerWatch( dataPath, callback ) {
        const key = dataPath.join( '.' );
        this.watch[key] = callback;
    }

    deleteWatch( dataPath ) {
        const key = dataPath.join( '.' );
        delete this.watch[key];
    }

    /**
     * Produces a key for a given path
     * @param {Array} path
     */
    genKey( path ) {
        return this.state.name + '-' + path.join( '-' );
    }

    /**
     * Walks the data object and returns the given dataPath 
     * @param {Object|Array} data
     * @param {Array} dataPath
     */
    getPathValue( data, dataPath ) {
        if ( dataPath.length < 1 ) {
            return data;
        }

        let ref = data;
        for ( let id in dataPath ) {
            const key = dataPath[id];
            ref = ref[key];
        }
        return ref;
    }

    /**
     * Pushes value into data at the last point in path
     * @param {any} data
     * @param {any} path
     * @param {any} value
     */
    pushPathValue( data, path, value ) {
        let ref = data;
        const max = path.length - 1;
        for ( let id = 0; id < path.length; ++id ) {
            const target = path[id];
            if ( max == id ) {
                return ref[target] = value;
            } else {
                ref = ref[target];
            }
        }
    }

    /**
     * Returns an anonymous hash that represents the bount internal handler objects
     */
    defaultHandlers() {
        return {
            onChange: this.handleChange,
            onSubmit: this.handleSubmit,
            onMove: this.handleMove,
            onDelete: this.handleDelete,
            onValidate: this.handleValidate,
        };
    }

    /**
     * Deletes objects from a list container
     *  id: representing which element
     *  dataPath: representing the the object path to the data
     *  displayPath: represetning to object display path
     * @param {any} id
     * @param {any} dataPath
     * @param {any} displayPath
     */
    handleDelete( id, dataPath, displayPath ) {
        const state = cloneObject( this.state );

        const parentDisplayPath = displayPath.slice( 0, displayPath.length - 1 );
        const parentDataPath = dataPath.slice( 0, dataPath.length - 1 );

        const parentData = this.getPathValue( state, parentDataPath );
        const parentDisplay = this.getPathValue( state, parentDisplayPath );

        if ( id == 0 ) {
            parentData.shift();
            parentDisplay.shift();
            this.setState( state );
        } else if ( id + 1 == parentDisplay.length ) {
            parentData.pop();
            parentDisplay.pop();
            this.setState( state );
        } else {
            const sets = [parentDisplay, parentData];
            for ( let x in sets ) {
                const data = sets[x];
                const start = data.slice( 0, id );
                const end = data.slice(( id + 1 ), data.length );
                data.pop();
                let pos = 0;
                for ( let i in start ) {
                    data[pos++] = start[i]
                }
                for ( let i in end ) {
                    data[pos++] = end[i]
                }
            }
            this.setState( state );
        }
        this.props.onChange( cloneObject( state ) );

    }


    /**
     * Handles changes within an event ( submit, group changes etc )
     * @param {any} dataPath
     * @param {any} displayPath
     * @param {any} props
     * @param {any} state
     */
    handleValidate( dataPath, displayPath, props, state ) {
        this.pushPathValue( this.validateState, displayPath, props );
        this.pushPathValue( this.validateState, dataPath, props.input );
        if ( !state ) { ++this.validationFailed }
    }

    /**
     * Handles a single change
     * @param {any} dataPath
     * @param {any} displayPath
     * @param {any} props
     */
    handleChange( dataPath, displayPath, props ) {

        const state = cloneObject( this.state );

        this.pushPathValue( state, displayPath, props );
        this.pushPathValue( state, dataPath, props.input );
        const key = dataPath.join( '.' );


        if ( this.watch.hasOwnProperty( key ) ) {
            this.watch[key]( props.input, state );
        }
        this.setState( state );
        this.props.onChange( cloneObject( state ), dataPath.slice( 0 ), displayPath.slice( 0 ) );
    }

    validatePath( path ) {
        const state = cloneObject( this.state );
        this.validationFailed = 0;
        this.validateState = state;

        const target = path.join( '.' );
        for ( let key in this.submitChecks ) {
            if ( this.submitChecks.hasOwnProperty( key ) && 0 == key.indexOf( target ) ) {
                this.submitChecks[key]();
            }
        }

        const result = {
            state: state,
            ok: this.validationFailed == 0
        };

        delete this.this.validationFailed;
        delete this.validateState;
        return result;
    }

    /**
     * React handler, always returns true!
     * @param {any} nextProps
     * @param {any} nextState
     */
    componentWillUpdate( nextProps, nextState ) {
        return true;
    }

    /**
     * Plugin framework, Registers validation object for a given dataPath 
     * @param {Array} dataPath
     * @param {function} method
     */
    registerSubmitCheck( dataPath, method ) {
        const key = dataPath.join( '.' );
        this.submitChecks[key] = method;
    }

    /**
     * Plugin handler for cleaning up un-used validation objects registered via this.registerSubmitCheck
     * @param {any} dataPath
     */
    deleteSubmitCheck( dataPath ) {
        const key = dataPath.join( '.' );
        delete this.submitChecks[key];
    }

    /**
     * Runs a submit check for a given data path
     * @param {any} dataPath
     */
    runSubmitCheck( dataPath ) {
        const key = dataPath.join( '.' );
        if ( this.submitChecks.hasOwnProperty( key ) ) {
            this.submitChecks[key]();
        }
    }

    /**
     * Swaps the position of 2 container objects
     * @param {any} dataPath
     * @param {any} displayPath
     * @param {any} move
     */
    handleMove( dataPath, displayPath, move ) {
        const parentDataPath = dataPath.slice( 0 );
        parentDataPath.pop();
        const parentDisplayPath = displayPath.slice( 0 );
        const srcId = parseInt( parentDisplayPath.pop(), 10 );
        const dstId = srcId + move;

        const state = cloneObject( this.state );

        const parentData = this.getPathValue( state, parentDataPath );
        const parentDisplay = this.getPathValue( state, parentDisplayPath );

        const srcData = parentData[srcId];
        const srcDisplay = parentDisplay[srcId];

        const dstData = parentData[dstId];
        const dstDisplay = parentDisplay[dstId];

        parentDisplay[dstId] = srcDisplay;
        parentDisplay[srcId] = dstDisplay;

        parentData[dstId] = srcData;
        parentData[srcId] = dstData;

        this.setState( state );
        this.props.onChange( cloneObject( state ) );

    }

    /**
     * Callback used to call the onSubmit function passed into the constructor
     */
    handleSubmit() {
        const state = cloneObject( this.state );
        this.validationFailed = 0;
        this.validateState = state;

        for ( let key in this.submitChecks ) {
            this.submitChecks[key]();
        }

        delete this['validateState'];
        if ( this.validationFailed != 0 ) {
            state.formError = true;
            this.setState( state );
        } else {
            if ( this.props.preSubmit( state.data, state.display ) ) {
                state.formError = false;
                this.setState( state );
                this.props.onSubmit( cloneObject( this.state.data ), cloneObject( this.state.display ) );
            } else {
                state.formError = true;
                this.setState( state );
            }
        }
        delete this['validationFailed'];

    }

    handleReset() {
        const state = Form.buildStateFromProps( this.props );
        this.setState( state );
        this.props.onReset();

    }

    cloneData() {
        return cloneObject( this.state.data );
    }

    componentWillReceiveProps( props ) {
        const state = Form.buildStateFromProps( props );
        this.setState( state );
    }

    renderObject( row, displayPath, dataPath ) {
        const key = displayPath.join( '-' );
        if ( FormElements.hasOwnProperty( row.type ) ) {

            const Target = FormElements[row.type];
            return <Target
                key={key} {...row}
                root={this}
                displayPath={displayPath}
                dataPath={dataPath}
                {...this.defaultHandlers() }
                input={this.getPathValue( this.state, dataPath )}
            />
        } else {
            return <div key={key}>Object Type of [{row.type}] is not yet supported!</div>
        }
    }

    render() {
        const form = this.renderObject( this.state.display, ['display'], ['data'] );
        return (
            <div className={this.state.classNameFormContainer}>
                <div className={this.state.classNameFormHeader}>{this.state.label}</div>
                {this.state.formError ? <div className={this.state.classNameFormError}>{this.state.errorText}</div> : ""}
                <div className={this.state.classNameHeaderLine} />
                <div className={this.state.classNameFormDiv}>{form}</div>

                <div className={this.state.classNameSubmitRow} >
                    {this.state.showReset ? <input disabled={this.state.resetDisabled} className={this.state.classNameButton} onClick={this.handleReset.bind( this )} type="button" value={this.state.resetText} /> : ""}
                    {this.state.showSubmit ? <input disabled={this.state.submitDisabled} onClick={this.handleSubmit.bind( this )} className={this.state.classNameButton} type="button" value={this.state.submitText} /> : ""}
                </div>
            </div> );
    }
}
const css = {
    classNameFormContainer: "rf-form-container",
    classNameFormHeader: "rf-form-header",
    classNameHeaderLine: "",
    classNameSubmitRow: "rf-form-submit-row",
    classNameFormDiv: "",
    classNameButton: "rfFormSubmit",
    classNameFormError: "rf-form-error",
};


Form.defaultProps = {
    display: { type: 'text', label: "I am the default imput object", input: "this is my value!" },
    showSubmit: true,
    showReset: true,
    submitText: "Submit",
    resetText: "Reset",
    formError: false,
    name: "form",
    label: "",
    errorText: "Some fields are not filled out properly",
    inputDisabled: false,
    resetDisabled: false,
    onSubmit: function() { },
    onReset: function() { },
    onChange: function() { },
    preSubmit: function() { return true },
};

Object.assign( Form.defaultProps, css );

module.exports = {
    Form: Form,
    FormElements: FormElements,
};

export default Form;


class FormContainerAdd extends React.Component {

    static buildData( props ) {

        return List.buildData( { display: props.displayList } );
    }
    constructor( props ) {
        super( props );
        const state = cloneProps( props );
        this.state = state;
    }

    handleReset =() => {
        const displayPath = this.state.displayPath.slice( 0 );
        displayPath.push( 'form' );
        const form = this.props.root.getPathValue( this.props.root.props, displayPath );
        const state = cloneObject( this.state );
        state.form = form;

        this.props.onChange( this.state.dataPath, this.state.displayPath, state );
    }
    
    handleSubmit =( data )=> {
        
        const displayPath = this.state.displayPath.slice( 0 );
        displayPath.push( 'list', 'display' );
        const dataPath = this.state.dataPath;

        const id = this.props.root.getPathValue( this.props.root.state, dataPath ).length;
        displayPath.push( id );
        dataPath.push( id );
        if ( this.state.add.constructor == Array ) {
            const display = cloneObject( this.state.chooser[this.props.root.getPathValue( data, this.state.add )] );
            display.input = FormElements.hasOwnProperty( display.type ) ? FormElements[display.type].buildData( display ) : null;
            display.input = mergeObjects( display.input, data );
            this.props.onChange( dataPath, displayPath, display );

        } else if ( FormElements.hasOwnProperty( this.state.add.type ) ) {
            const display = cloneObject( this.state.add );
            display.input = FormElements[this.state.add.type].buildData( display );
            display.input = mergeObjects( display.input, data );
            this.props.onChange( dataPath, displayPath, display );
        }
    }
    
    handleChange =( form, dataPath )=> {
        const state = cloneObject( this.state );

        state.form.data = form.data;
        this.props.onChange( this.state.dataPath, this.state.displayPath, state );
    }
    
    componentWillReceiveProps( props ) {
        this.setState( cloneProps( props ) );
    }

    renderList() {
        const displayPath = this.state.displayPath.slice( 0 );
        const dataPath = this.state.dataPath.slice( 0 );
        displayPath.push( 'list' );
        const args = {};
        Object.assign( args, this.state.list, { type: 'list' } );
        return this.props.root.renderObject( args, displayPath, dataPath );
    }


    renderForm() {
        const args = {};
        Object.assign( args, FormContainerAdd.defaultFormProps, this.state.form );

        return <Form {...args} showReset={false} label={this.state.label} onReset={this.handleReset} onChange={this.handleChnage} onSubmit={this.handleSubmit} />
    }

    render() {
        return (
            <div>
                <div className={this.state.classNameFormContainer}>
                    {this.renderForm()}
                </div>
                <div className={this.state.classNameListContainer}>
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

FormContainerAdd.defaultFormProps = {
        classNameFormContainer: "rf-form-container",
        classNameFormHeader: "rf-subform-header",
        classNameHeaderLine: "",
        classNameSubmitRow: "rf-subform-submit-row",
        classNameFormDiv: "",
        classNameButton: "rfFormSubmit",
        classNameFormError: "rf-form-error",
        submitText: "Add",
        errorText: "Some fields are not filled out properly",
    };

FormContainerAdd.defaultProps = {
    label: "",
    form: {},
    add: {},
    list: { canMove: true, canDelete: true },
    classNameFormContainer: "rf-form-container",
    classNameListContainer: "rf-form-container",
    submitText: "Add",
    errorText: "Some fields are not filled out properly",
};

FormElements['add'] = FormContainerAdd;

// End of the module

