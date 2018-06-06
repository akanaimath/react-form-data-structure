'use strict';
import React, { Component, PropTypes } from 'react';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps  } from 'react-object-utils';
import { FormElements } from './form-elements.js';

class Hash extends React.Component {

    static buildData( props ) {
        const display = props.display;
        const data = {};

        for ( let id in display ) {
            const form = display[id];
            const name=form.hasOwnProperty('name') ? form.name : 'default-' +id;
            data[name] = FormElements.hasOwnProperty( form.type ) ? FormElements[form.type].buildData( form ) : null;
        }

        return data;
    }
    
    constructor (props) {
        super(props);
        this.state=cloneProps(props,['root']);
    }
    

    componentWillReceiveProps(props) {
        this.setState(cloneProps(props));
    }

    renderRow( row, id, baseDisplayPath ) {

        const displayPath = baseDisplayPath.slice( 0 );
        displayPath.push( id );
        const dataPath = this.state.dataPath.slice( 0 );
        const name=row.hasOwnProperty('name') ? row.name : 'default-' +id;
        dataPath.push( name );
        const keyPath=displayPath.slice(0);
        keyPath.push('hashKey',id);
        const key = this.props.root.genKey(keyPath);
        const display = this.props.root.renderObject( row, displayPath, dataPath );
        return (
            <div key={key} className={this.state.classNameHashRow}>
                <div className={this.state.classNameHashCell}>{display}</div>
            </div>
        );
    }

    render() {
        const display = this.state.display;
        let id = -1;
        const instance = this;
        const baseDisplayPath = this.state.displayPath.slice( 0 );
        baseDisplayPath.push( 'display' );

        return (
            <div className={this.state.classNameListContainer}>
                <div className={this.state.classNameHashRow} >
                {this.state.label && <div className={this.state.classNameListHeader}>{this.state.label}</div>}
                </div>
            <div className={this.state.classNameHashRow} >
                {this.state.display.map( function( row ) {
                    ++id;
                    return instance.renderRow( row, id, baseDisplayPath );
                } )}
                </div>
            </div> );
    }
}

Hash.defaultProps = {
    display: [],
};

const css = {
    classNameListContainer: "rf-form-container",
    classNameHashRow: "rf-form-container-hash-row",
    classNameHashCell: "rf-form-container-hash-cell",
    classNameListHeader: "rf-form-container-list-header",
};

Object.assign( Hash.defaultProps, css );
FormElements['hash'] = Hash;

module.exports={
        Hash: Hash,
};
// end of the module