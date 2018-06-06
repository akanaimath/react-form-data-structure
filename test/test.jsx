var test = require( 'unit.js' );
const util = require( 'util' );

import { React } from 'react';
import { FormElements, FormCss } from '../build/form-elements.js';

import '../build/form-autocomplete.js';
import '../build/form-input.js';

describe( 'Basic Data Build', function () {
  it('Make sure the object was exported!', function () {
    test.assert(FormElements.constructor==Object);
  });

  it('make sure we loaded some plugins', function () {
    let count=0;
    for( let key in FormElements) {
      if(FormElements.hasOwnProperty(key)) { ++count; }
    }
    test.assert(count!=0);

  });
});
