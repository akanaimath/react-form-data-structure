# React form builder
  `react-form` was created to manage complex data structures.  A single configuration is used to describe both the data structure and the form.  The configuration is designed have a minimal feel/code footprint, with the ability to tune or change almost anything.  The idea is to be able to create an manage an infinitly scaling form/data structure that is only limited by browser resources.

## Install

```
yarn add react-form
```

## Basic use case

```
import { Form } from 'react-form';
import 'react-form/form.css';  // to load the css

render( <Form  label="I am a form!" 
  display={{ 
    type: 'hash', 
    display: [ 
      {type: 'text', label: 'Email Address', name: "email", required: true}, 
      {type: 'password', label: "password", name: "password", required: true} ] }}/>, 
      document.getElementById( 'app' ) 
); 
```

# Mindset
Objects are typically displayed in containers; Containers represent data structures.  Example: if you want the form to manage a list ( Array Object ) the first container would be a `type: list`,  and the display contents would then represent list elements. 


# Terms

* **path** Path(s) are a list that represent where in the object structure this thing exists.
* **dataPath** An Array Object `path` that refers to an object that exists in Form this.state.data
* **displayPath** An Array Object `path` that refers to an object that exists in Form this.state.display
* **scalar** primitive data value


## Form Options

* **Arguments**

| option | description |
| ------ | ----------- |
| data | data structure to be displayed |
| display | form/data structure configuration |
|    showSubmit | default: true, show or hide the submit button |
|    showReset | default: true, show or hide the reset button |
|    submitText | default "Submit", submit button text |
|    resetText | default "Rest", submit button reset |
|    formError | default: false, State for the form ( error: true\|false ) |
|    name | default "form", used for internal key geneation ( recommended this be set to something unique ) |
|    label | default "", header text of the form |
|    errorText | default "Some fields are not filled out properly" |


# Getting Data out

`Form` provides a collection of callback handlers that return a semi deep copy of the the internal data.

* **Event Handlers**

| name | When its called | Arguments |
| ---- | --------------- | --------- |
| onChange | when a field changes | (data,dataPath,displayPath) |
| onSubmit | when the submit button is pressed | (data,display) |
| onReset  | when the reset button is pressed  | () |
| preSubmit | when onSubmit would be called this function is called, if it returns onSubmit will be called | (data,display) |

* ** Getting the default state

The Form object allows for generation of the default state based on the following:


```
const state=Form.buildStateFromProps(props);
```

Given: props state will contain state.data and state.display


* **Css Options**

Form uses the following CSS Classes, and each class can be passed in as an argument.

| option | default value |
| ------ | ------------- |
|    classNameFormContainer | rf-form-container |
|    classNameFormHeader | rf-form-header |
|    classNameHeaderLine | "" |
|    classNameSubmitRow | rf-form-submit-row |
|    classNameFormDiv | "" |
|    classNameButton | rfFormSubmit |
|    classNameFormError | rf-form-error |


# Default Plugins

Each plugin has its on css, and each css class can be passed in as an argument.

| Plugin      |       Type           |
| ----------- | -------------------- |
| text        | input                |
| quill | Ebmbeded html editor, ( wrapper for quill ) |
| datepicker | Date Time picker |
| color | Color picker |
| text-autocomplete | input, with autocomplete     |
| password    | password             |
| textarea    | textarea             |
| select      | select               |
| multiselect | select multiple      |
| radio       | radio                |
| checkbox    | checkbox             |
| add         | subform add          |
| hash        | container for hashes |
| list        | container for lists  |
| watch       | chooses a configuration based on an item being watched |

## Input Examples

### input text box ( text plugin )

* **Example**

This example shows how to manage a scalar value with a text input.

```
<Form display={
  { 
    type: 'text', 
    input: "", 
    required: true, 
    label: "input test", 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| input  | default value |
| required | true\|false determines if this field is required |
| validate | function(currentValue), must return true if the value is valid false if it is not |
| disabled | true\|false determines if the field is disabled |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameInputText | rfFormDefaultsInputText |
|    classNameInputTextCheckFailed | rfFormDefaultsInputTextfailed |
|    classNameInputLabel | rfFormLabel |
|    classNameInputContainer | rf-form-input-container |
|    classNameInputTextDefault | rfFormDefaultsInputText |

### Html Editor ( quill plugin )

* **Example**

This plugin is really a wrapper for: https://www.npmjs.com/package/react-quill .This example shows how to manage editable html input.

```
import 'react-quill/dist/quill.snow.css';
<Form display={
  { 
    type: 'quill', 
    input: "", 
    required: true, 
    label: "input test", 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| input  | default value |
| required | true\|false determines if this field is required |
| validate | function(currentValue), must return true if the value is valid false if it is not |
| disabled | true\|false determines if the field is disabled |
| toolbarOptions| default: [ [{'background': []}, 'bold', { font: []}, {color: []}, 'code', 'italic', 'link', 'strike', 'underline'], ['blockquote', { 'header': [1, 2, 3, 4, 5, 6, false] }, { 'indent': '-1' }, { 'indent': '+1' }, { 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }, { 'direction': 'rtl' }, 'code-block'], ['formula', 'image', 'video'] ] | 


* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameInputText | rfFormDefaultsInputText |
|    classNameInputTextCheckFailed | rfFormDefaultsInputTextfailed |
|    classNameInputLabel | rfFormLabel |
|    classNameInputContainer | rf-form-input-container |
|    classNameInputTextDefault | rfFormDefaultsInputText |

### Date Picker ( datepicker plugin ) 

* **Example**

This plugin is wrapper for: https://chmln.github.io/flatpickr/
This example shows how to manage a scalar value with a text input.

```
import 'flatpickr/dist/themes/material_blue.css';
<Form display={
  { 
    type: 'datepicker', 
    input: "", 
    required: true, 
    label: "input test", 
    options: { enableTime: true, enableSeconds: true, dateFormat: "Y-m-d H:i:S" }
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| input  | default value |
| required | true\|false determines if this field is required |
| validate | function(currentValue), must return true if the value is valid false if it is not |
| disabled | true\|false determines if the field is disabled |
| options | default: { enableTime: true, enableSeconds: true, dateFormat: "Y-m-d H:i:s" } see: https://chmln.github.io/flatpickr/options/ |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameInputText | rfFormDefaultsInputText |
|    classNameInputTextCheckFailed | rfFormDefaultsInputTextfailed |
|    classNameInputLabel | rfFormLabel |
|    classNameInputContainer | rf-form-input-container |
|    classNameInputTextDefault | rfFormDefaultsInputText |


### input text box ( text-autocomplete plugin )

* **Example**

This example shows how to manage a scalar value with a text input.

```
<Form display={
  { 
    type: 'text-autocomplete ', 
    input: "", 
    required: true, 
    label: "input test", 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| input  | default value |
| required | true\|false determines if this field is required |
| validate | function(currentValue), must return true if the value is valid false if it is not |
| disabled | true\|false determines if the field is disabled |
| data | Array, each value represents an auto complete option |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameInputText | rfFormDefaultsInputText |
|    classNameInputTextCheckFailed | rfFormDefaultsInputTextfailed |
|    classNameInputLabel | rfFormLabel |
|    classNameInputContainer | rf-form-input-container |
|    classNameInputTextDefault | rfFormDefaultsInputText |
|    classNameInputAutoComplete | "rf-auto-complete" |

### Password ( password plugin )

* **Example**

This example shows how to manage a scalar value with a text input.

```
<Form display={
  { 
    type: 'password', 
    input: "", 
    required: true, 
    label: "password test", 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| input  | default value |
| required | true\|false determines if this field is required |
| validate | function(currentValue), must return true if the value is valid false if it is not |
| disabled | true\|false determines if the field is disabled |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameInputText | rfFormDefaultsInputText |
|    classNameInputTextCheckFailed | rfFormDefaultsInputTextfailed |
|    classNameInputLabel | rfFormLabel |
|    classNameInputContainer | rf-form-input-container |
|    classNameInputTextDefault | rfFormDefaultsInputText |

### Textarea ( textarea plugin )

* **Example**

This example shows how to manage a scalar value with a textarea.

```
<Form display={
  { 
    type: 'textarea', 
    input: "", 
    required: true, 
    label: "password test", 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| input  | default value |
| required | true\|false determines if this field is required |
| validate | function(currentValue), must return true if the value is valid false if it is not |
| disabled | true\|false determines if the field is disabled |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameInputText | rf-form-textarea |
|    classNameInputTextCheckFailed | rf-form-textarea-error |
|    classNameInputLabel | rf-form-label |
|    classNameInputContainer | rf-form-textarea-container |
|    classNameInputTextDefault | rf-form-textarea-container |

### Color picker ( color plugin )

* **Example**

This example shows how to manage a scalar value with a color picker.

```
<Form display={
  { 
    type: 'color', 
    input: "", 
    required: true, 
    label: "password test", 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| input  | default value |
| required | true\|false determines if this field is required |
| validate | function(currentValue), must return true if the value is valid false if it is not |
| disabled | true\|false determines if the field is disabled |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameInputText | rf-form-textarea |
|    classNameInputTextCheckFailed | rf-form-textarea-error |
|    classNameInputLabel | rf-form-label |
|    classNameInputContainer | rf-form-textarea-container |
|    classNameInputTextDefault | rf-form-textarea-container |

### Select box ( select plugin )

* **Example**

This example shows how to manage a scalar value with a select box.

```
<Form display={
  { 
    type: 'select', 
    input: "", 
    required: true, 
    label: "Select Test", 
    data: [
      { value: "one", label: "Option one" }, 
      { value: 'two', label: "Option two" }
    ] 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| data | Array of Objects: { value: "value", label: "display text } |
| input | The default selected value "" if you don't want anything selected |
| required | true\|false, denotes if the field is required for the onSubmit action to be called |
| label | display text |
| disabled | true\|false, denotes if this field is disabled |

* **CSS Options**

The select plugin has the following css options

| option | default value |
| ------ | ------------- |
| classNameSelectRow | rfFormSelectRow |
| classNameSelectHeader | rfFormSelectHeader  | 
| classNameSelectCell | rf-form-select-cell  | 
| classNameSelectCellDefault | rf-form-select-cell  | 
| classNameSelectCellError | rf-form-select-cell-error  | 
| classNameSelect | rfFormSelect  | 
| classNameSelectDefault | rfFormSelect  | 
| classNameSelectError | rfFormSelectError  | 
| classNameSelectOption | rf-form-select-option  | 
| classNameSelectOptionDefault | rf-form-select-option  | 
| classNameSelectOptionError | rf-form-select-option-error |

### Radio Set ( radio plugin )

* **Example**

This example shows how to manage a scalar value with a radio set.

```
<Form display={
  { 
    type: 'radio', 
    input: "", 
    required: true, 
    label: "Raidio Test", 
    data: [
      { value: "one", label: "Option one" }, 
      { value: 'two', label: "Option two" }
    ] 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| data | Array of Objects: { value: "value", label: "display text } |
| input | The default selected value "" if you don't want anything selected |
| required | true\|false, denotes if the field is required for the onSubmit action to be called |
| label | display text |
| disabled | true\|false, denotes if this field is disabled |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|        classNameInputRaidio | rfFormDefaultsInputRaidio |
|        classNameRadioCellIndent | rf-form-radio-indent |
|        classNameRadioHeader | rfFormRadioHeader |
|        classNameRaidoRow | rf-form-raidio-row |
|        classNameRaidioRowContainer | rf-form-raidio-row-container |
|        classNameRadioButtonCell | rf-form-radio-button-cell |
|        classNameRadioButtonCellDefault | rf-form-radio-button-cell |
|        classNameRadioButtonCellFailed | rf-form-radio-button-cell-failed |

### Multiple Select ( multiselect plugin )

* **Example**

This example shows how to manage a scalar value with a multiple select.

```
<Form display={
  { 
    type: 'multiselect', 
    input: [], 
    required: true, 
    label: "Milti Select Test", 
    data: [
      { value: "one", label: "Option one" }, 
      { value: 'two', label: "Option two" }
    ] 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| data | Array of Objects: { value: "value", label: "display text } |
| input | Array of selected values, [] if you don't want anything selected |
| required | true\|false, denotes if the field is required for the onSubmit action to be called |
| label | display text |
| disabled | true\|false, denotes if this field is disabled |
| size| default: 5, sets how many records will be shown |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameSelectRow | rfFormSelectRow |
|    classNameSelectHeader | rfFormSelectHeader |
|    classNameSelectCell | rf-form-select-cell |
|    classNameSelectCellDefault | rf-form-select-cell |
|    classNameSelectCellError | rf-form-select-cell-error |
|    classNameSelect | rf-form-select-multi |
|    classNameSelectOption | rf-form-select-option |
|    classNameSelectOptionDefault | rf-form-select-option |
|    classNameSelectOptionError | rf-form-select-option-error |
    
### CheckBox ( checbox plugin )

* **Example**

This example shows how to manage a scalar value with a multiple select.

```
<Form display={
  { 
    type: 'checkbox', 
    label: "Label Example", 
  }
}/>
```

* **Options**

| option | description |
| ------ | ----------- |
| input | true\|false, if not set defaults to false |
| required | true\|false, denotes if the field is required for the onSubmit action to be called |
| label | display text |
| disabled | true\|false, denotes if this field is disabled |

* **CSS Options**

| option | default value |
| ------ | ------------- |
|    classNameFormCheckboxLeft | rf-form-label-right |
|    classNameFormCheckboxRight | rf-form-element-left |
|    classNameFormCheckboxContainer | rf-form-input-container |
|    classNameFormCheckBox | rf-form-input-checkbox |
|    classNameFormCheckBoxDefault | rf-form-input-checkbox |
|    classNameFormCheckBoxError | rf-form-input-checkbox-error |
|    classNameFormCheckboxRightError | rf-form-label-right-error |
|    classNameFormCheckBoxRightDefault | rf-form-label-right |

## Container Examples

Containers represent Data structures of type Array or Object.  Containers make it possible to move beyond a scalar value.

### list ( list plugin )

* **Example**

This example shows how to manage a list of text inputs.

```
<Form display={{
  "type": "list",
  "label": "Test Set 1",
  "canMove": true,
  "canDelete": true,
  "display": [
    {
      "type": "text",
      "label": "test One",
      "required": true
    },
    {
      "type": "text",
      "label": "Test Two",
      "required": true
    }]
    }}
/>
```

* **Options**

| option | description |
| ------ | ----------- |
|    deleteText | default "Delete", text of the delete button |
|    moveUpText | default value "^", text of the move up button |
|    moveDownText | default value "v", text of the move down button |
|    canMove | false, enables or disables the move option  |
|    canDelete | false, enables or disables the delete option |
|    headerText | default "I am a list", sets the header text for the list block |
| display | Array that contains the plugins options to display |



* **CSS Options**

| option | default value |
| ------ | ------------- |    
|    classNameListContainer | rf-form-container |
|    classNameListRow | rf-form-container-list-row |
|    classNameListButton | rfFormSubmit |
|    classNameListCell | rf-form-container-list-cell |
|    classNameListButtonContainer | rf-form-container-list-cell-buttons |
|    classNameHidden | rfFormHidden |
|    classNameSmallerWidth | rf-form-container-smaller-row |
|    classNameListHeader | rf-form-container-list-header |

### hash

* **Example**

This example shows how to manage a hash of text and password inputs. 

**Note Note Note** All objects in a hash container require an additional argument `name`, the name represents the key in the data structure.

```
<Form display={{
        label: "Simple Hash example",
        display: {
            type: 'hash',
            display: [
                { type: 'text', label: 'Email Address', name: "email", required: true },
                { type: 'password', label: "password", name: "password", required: true }
            ]
        }
    }}
/>
```


* **Options**

| option | description |
| ------ | ----------- |
| display | Array that contains the plugins options to display |

* **CSS Options**

| option | default value |
| ------ | ------------- |    
|    classNameListContainer | rf-form-container | 
|    classNameHashRow | rf-form-container-hash-row | 
|    classNameHashCell | rf-form-container-hash-cell | 
|    classNameListHeader | rf-form-container-list-header | 

### Add Elements ( add plugin )


* **Basic Example**

```
<Form display={{
        label: "Add to list",
        display: {
            type: 'add',
            add: {
            type: 'hash',
            display: [
              { name: 'label', type: 'text', label: "label", required: true },
              { name: 'value', type: 'text', label: "value", required: true }
            ]
          },
          form: {
                display: {
                    type: 'hash', display: [
                      { name: 'label', type: 'text', label: "label", required: true },
                      { name: 'value', type: 'text', label: "value", required: true }
                    ]
                }
        },
        list: {
            canMove: true,
            canDelete: true,
            label: 'sets added', 
            display: [],
        }
    }}
/>
```

* **Comlpex Example**

The following is an example of how to use the add plugin.  

```
<Form display={{
        label: "Add to list",
        display: {
            type: 'add',
            add: ['forms'],
            form: {
                display: {
                    type: 'hash', display: [
                        { name: 'label', type: 'text', label: "label", required: true },
                        { name: 'value', type: 'text', label: "value", required: true }
                        {
                            name: 'forms', 
                            type: 'select', 
                            label: "Choose the subform", 
                            data: [
                              { value: 'Informal', label: 'informal' }, 
                              { value: 'Formal', label: 'formal' }
                            ]
                        }
                    ]
                }
        },
        list: {
            canMove: true,
            canDelete: true,
            label: 'sets added', 
            display: [],
        },
        chooser: {
            Informal: {
                label: 'Form One',
                type: 'hash',
                display: [
                    { name: 'label', type: 'text', label: "label", required: true },
                    { name: 'value', type: 'text', label: "value", required: true }
                ]
            },
            Formal: {
              label: 'Form Two',
              type: 'hash',
              display: [
                  { name: 'label', type: 'text', label: "Nomenclature", required: true },
                  { name: 'value', type: 'text', label: "Assignment", required: true },
                  { name: 'select', type: 'select', label: 'Choose One', required: true, 
                    data: [{ label: 'one', value: 'one' }, { label: 'two', value: 'two' }] }
                    ]
              }
            },

        }
    }}
/>
```


* **Options**

| option | description |
| ------ | ----------- |
| display | Array that contains the plugins options to display |
| add | Array, path representing the current most display container element to watch |
| add | Object, display object to add |
| list | ignored if add.constructor==Object, all objects added exist in a "list" plugin object, this is where those options are set |
| chooser | Object, of display Objects, when a user clicks the add button, the option matching the chooser will be used |
| submitText | default "Add", the submit button text |
| errorText | default "Some fields are not filled out properly", error show when validation fails |


* **CSS Options**

| option | default value |
| ------ | ------------- |   
| classNameFormContainer | rf-form-container |
| classNameListContainer | rf-form-container |

## Watch example(s)

* **Example**

THe following example shows how to use watch in a hash container.

Note Note Note! Unlike other plugins, watch does not contain what it is watching.

```
<Form display={{
  "type": "hash",
  "display": [
    {
      "type": "select",
      "label": "choose a subform",
      "input": "one",
      "name": "choose",
      "data": [
        {
          "value": "one",
          "label": "Form One"
        },
        {
          "value": "two",
          "label": "Form Two"
        }
      ]
    },
    {
      "type": "watch",
      "name": "subform",
      "watch": [
        "choose"
      ],
      "setDisplay": "one",
      "displays": {
        "one": {
          "type": "text",
          "label": "test"
        },
        "two": {
          "type": "checkbox",
          "label": "subform checkbox"
        }
      }
    }
  ]
}} 
/>
```

* **Options**

| option | description |
| ------ | ----------- |
| watch  | path to the parent container value to watch |
| setDisplay | which display to use from "displays" |
| displays | Object of Objects, each key should map to the `watch` `path` value. |


## Creating plugins

The plugin API is very flexible and powerful, it was designed to allow the encapsulation of any plugin within any plugin.  This means a list can contain a list, hash, add and and any other assortment of plugins.  Any plugin created must follow this mind set.

When creating a plugin the static buildData(props) method must be implemented.  The buildData(props) provides the default data structure for a given dataPath.

* **Example from the text plugin**

```
    static buildData( props ) {

        const input = props.hasOwnProperty( 'input' ) ? 
          props.input 
            : 
          FormTextInput.defaultProps.input;
        return input == null ? "" : input;
    }
```


* **Plugin intantiation arguments**

Plugins are rendered with the following arguments
```
  <Plugin
    key={key} {...displayArguments}
    root={root}
    displayPath={displayPath}
    dataPath={dataPath}
    {...root.defaultHandlers() }
    input={root.getPathValue( this.state, dataPath )}
  />
    
```

* **Plugin Options**

| option | description |
| ------ | ----------- |
| key    | required by the react api |
| root   | the top level Form object instance |
| displayArguments | a copy of the prop arguments for this plugin |
| displayPath | a **path** array representing the display configuration in the root.state data structure |
| dataPath | a **path** array representing the stored in root.state |
| root.defaultHandlers() | object event handlers |
| input | the default data structure for this object |

** **root.defaultHandelers()** 


| name | description | arguments |
| ---- | ----------- | --------- |
| onChange | the function used to push state into the `root` | (dataPath,displayPath,newProps) |
| onSubmit | allows the plugin to call the submit method of `root` | () |
| onMove | called by a plugin to move itself within a list plugin | ( dataPath, displayPath, +1\|-1 ) |
| onDelete | called by a plugin to delete a plugin from a list plugin | ( list_id, dataPath, displayPath ) | 
| onValidate | used to call validation for a given plugin | ( dataPath, displayPath, props, state ) |

** **Registering a plugin for events**

The `root` object offers the following event handler registration methods, and clean up methods.

| name | description | where to initialize | arguments |
| ---- | ----------- | ----- | --------- |
| registerSubmitCheck| registers a pre-submit check | componentDidMount,componentWillReceiveProps | (dataPath,function) |
| registerWatch | registers the monitoring of a value | componentDidMount,componentWillReceiveProps | (dataPath,function) |
| deleteWatch | deletes a callback for dataPath | componentWillReceiveProps,componentWillUnmount | (dataPath) |
| deleteSubmitCheck | deletes a submit check | componentWillUnmount,componentWillReceiveProps | (dataPath) |


* **Registering your plugin**

Import the module registry.

```
import { FormElements } from 'react-form/build/form-elements.jsx';
```

Register your module

```
FormElements['your-plugin']=YourPluginClass;
```


# Built in demo

The project contains a very basic demo which can be accessed by by issuing the following command, in the project folder.

```
npm run demo
```

From there the demo/index.html can be viewed locally.