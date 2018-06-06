'use strict';
import React, { Component, PropTypes } from 'react';
import { cloneObject, mergeObjects, objectsDiffer, cloneProps  } from 'react-object-utils';
import { FormElements} from './form-elements.js';


class List extends React.Component {

    static buildData( props ) {
        const display = props.display;
        const data = [];

        for ( let id in display ) {
            const form = display[id];
            data[id] = FormElements.hasOwnProperty( form.type ) ? FormElements[form.type].buildData( form ) : null;
        }

        return data;
    }

    constructor( props ) {
        super( props );

        this.state=cloneProps(props);
        this.handleMoveUp = this.handleMoveUp.bind( this );
    }

    componentWillReceiveProps(props) {
 
        this.setState(cloneProps(props));
    }

    handleMoveUp( record, dataPath, displayPath, e ) {
        this.props.root.handleMove( dataPath, displayPath, -1 );
    }

    handleMoveDown( record, dataPath, displayPath, e ) {
        this.props.root.handleMove( dataPath, displayPath, 1 );
    }

    handleDelete( record, dataPath, displayPath, e ) {
        this.props.root.handleDelete( record, dataPath,displayPath );
    }

    renderRow( row, id, baseDisplayPath ) {

        const displayPath = baseDisplayPath.slice( 0 );
        displayPath.push( id );
        const dataPath = this.state.dataPath.slice( 0 );
        dataPath.push( id );
        const keyPath=displayPath.slice(0);
        keyPath.push('listItem',id);
        const key = this.props.root.genKey(keyPath);
        const display = this.props.root.renderObject( row, displayPath, dataPath );
        const canMoveUp = !( id > 0 );
        const canMoveDown = !( id < this.state.display.length - 1 );
        return (
            <div key={key} className={this.state.classNameListRow}>

                <div className={this.state.classNameListCell}>{display}</div>
                <div className={this.state.classNameListCell}>
                <div className={this.state.classNameListButtonContainer}>
                    <input className={this.state.canMove ? this.state.classNameListButton : this.state.classNameHidden} disabled={canMoveUp} type="button" onClick={this.handleMoveUp.bind( this, id, dataPath, displayPath )} value={this.state.moveUpText} />
                    <input className={this.state.canMove ? this.state.classNameListButton : this.state.classNameHidden} disabled={canMoveDown} type="button" onClick={this.handleMoveDown.bind( this, id, dataPath, displayPath )} value={this.state.moveDownText} />
                    <input className={this.state.canDelete ? this.state.classNameListButton : this.state.classNameHidden} type="button" onClick={this.handleDelete.bind( this, id, dataPath, displayPath )} value={this.state.deleteText} />
                </div>
                </div>
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
                <div className={this.state.classNameListRow} >
                {this.state.label && <div className={this.state.classNameListHeader}>{this.state.label}</div>}
                </div>
            <div className={this.state.classNameListRow} >
                {this.state.display.map( function( row ) {
                    ++id;
                    return instance.renderRow( row, id, baseDisplayPath );
                } )}
                </div>
            </div> );
    }
}

const css = {
    classNameListContainer: "rf-form-container",
    classNameListRow: "rf-form-container-list-row",
    classNameListButton: "rfFormSubmit",
    classNameListCell: "rf-form-container-list-cell",
    classNameListButtonContainer: "rf-form-container-list-cell-buttons",
    classNameHidden: "rf-FormHidden",
    classNameSmallerWidth: "rf-form-container-smaller-row",
    classNameListHeader: "rf-form-container-list-header",
};

List.defaultProps = {
    displayPath: [],
    dataPath: [],
    display: [],
    deleteText: "Delete",
    moveUpText: "^",
    moveDownText: "v",
    canMove: false,
    canDelete: false,
    headerText: "I am a list",
};

Object.assign( List.defaultProps, css );
FormElements['list'] = List;


module.exports={ List: List, FormElements: FormElements };

// end of the module