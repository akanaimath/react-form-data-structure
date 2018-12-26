'use strict';
import React, { PropTypes } from 'react';
import { FormElements } from './form-elements.js';
import { cloneObject, cloneProps } from 'react-utility';

class Watch extends React.Component {
    constructor( props ) {
        super( props );
        this.state = cloneProps( props );
        this.handleDisplayChange = this.handleDisplayChange.bind( this );

    }
    static buildData( props ) {

        if ( props.setDisplay.length > 0 && props.displays.hasOwnProperty( props.setDisplay ) ) {
            const type = props.displays[props.setDisplay].type;
            if ( FormElements.hasOwnProperty( type ) ) {
                return FormElements[type].buildData( props.displays[props.setDisplay] );
            }
        } else {
            return cloneObject( props.defaultValue );
        }
    }

    handleDisplayChange( setDisplay, state ) {
        if ( this.state.setDisplay == setDisplay ) {
            return;
        }
        
        const display = cloneObject( this.state );
        display.setDisplay = setDisplay;
        const data = Watch.buildData( display );
        this.props.root.pushPathValue( state, this.state.displayPath, display );
        this.props.root.pushPathValue( state, this.state.dataPath, data );

    }

    watchPath() {
        const dataPath = this.state.dataPath.slice( 0 );
        dataPath.pop();
        for ( let id in this.state.watch ) {
            dataPath.push( this.state.watch[id] );
        }
        return dataPath;
    }
    
    componentDidMount() {
        if ( this.state.watch.length > 0 ) {
            const dataPath=this.watchPath();
            this.props.root.registerWatch( dataPath, this.handleDisplayChange );
        }
    }
    
    componentWillUnmount() {
        this.props.root.deleteWatch(this.watchPath());
    }
    
    componentWillReceiveProps( props ) {
        this.props.root.deleteWatch(this.watchPath());
        this.setState( cloneProps( props ) );
        
        const dataPath = props.dataPath.slice( 0 );
        dataPath.pop();
        for ( let id in this.state.watch ) {
            dataPath.push( this.state.watch[id] );
        }
        this.props.root.registerWatch( dataPath, this.handleDisplayChange );
    }

    render() {
        const current = this.state.setDisplay;
        if ( !this.state.displays.hasOwnProperty( current ) ) {
            return "";
        }

        const display = this.state.displays[current];
        const displayPath = this.state.displayPath.slice( 0 );
        displayPath.push( current );
        return this.props.root.renderObject( display, displayPath, this.state.dataPath );
    }

}


Watch.defaultProps = {
    setDisplay: "",
    watch: [],
    displays: {},
};

FormElements['watch']=Watch;

// end of the package