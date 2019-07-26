/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import { FieldParamType } from '../';
import { FieldParamEditor, FieldParamEditorProps } from './field';
import { AggConfig } from '../../vis';

describe('FieldParamEditor component', () => {
  let setValue: jest.Mock;
  let setValidity: jest.Mock;
  let setTouched: jest.Mock;
  let onChange: jest.Mock;
  let defaultProps: FieldParamEditorProps;
  let field: FieldParamType;

  beforeEach(() => {
    setValue = jest.fn();
    setValidity = jest.fn();
    setTouched = jest.fn();
    onChange = jest.fn();

    field = {
      label: 'Field',
      options: [{ label: 'bytes', value: { displayName: 'bytes' } }],
    };

    defaultProps = {
      agg: {},
      aggParam: {
        name: 'field',
        type: 'field',
        editorComponent: null as any,
        onChange,
      },
      value: undefined,
      editorConfig: {},
      indexedFields: [field],
      showValidation: false,
      setValue,
      setValidity,
      setTouched,
      state: {} as any,
      metricAggs: [] as AggConfig[],
      subAggParams: {} as any,
    };
  });

  it('should disable combo box when indexedFields is empty', () => {
    defaultProps.indexedFields = [];
    const comp = shallow(<FieldParamEditor {...defaultProps} />);

    expect(comp.find('EuiComboBox').prop('isDisabled')).toBeTruthy();
  });

  it('should set field option value if only one available', () => {
    mount(<FieldParamEditor {...defaultProps} />);

    expect(setValue).toHaveBeenCalledWith(field.options[0].value);
  });

  // this is the case when field options do not have groups
  it('should set field value if only one available', () => {
    defaultProps.indexedFields = [field.options[0]];
    mount(<FieldParamEditor {...defaultProps} />);

    expect(setValue).toHaveBeenCalledWith(field.options[0].value);
  });

  it('should set validity as true', () => {
    defaultProps.value = field.options[0].value;
    mount(<FieldParamEditor {...defaultProps} />);

    expect(setValidity).toHaveBeenCalledWith(true);
  });

  it('should set validity as false when value is not defined', () => {
    mount(<FieldParamEditor {...defaultProps} />);

    expect(setValidity).toHaveBeenCalledWith(false);
  });

  it('should set validity as false when there are errors', () => {
    defaultProps.indexedFields = [];
    mount(<FieldParamEditor {...defaultProps} />);

    expect(setValidity).toHaveBeenCalledWith(false);

    defaultProps.customError = 'customError';
    mount(<FieldParamEditor {...defaultProps} />);

    expect(setValidity).toHaveBeenCalledWith(false);
  });

  it('should call setTouched when the control is invalid', () => {
    defaultProps.value = field.options[0].value;
    const comp = mount(<FieldParamEditor {...defaultProps} />);
    expect(setTouched).not.toHaveBeenCalled();
    comp.setProps({ customError: 'customError' });

    expect(setTouched).toHaveBeenCalled();
  });

  it('should call onChange when a field selected', () => {
    const comp = shallow(<FieldParamEditor {...defaultProps} />);
    act(() => {
      comp
        .children()
        .props()
        .onChange(field.options[0].value);
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('should call setValue when nothing selected and field is not required', () => {
    defaultProps.aggParam.required = false;
    defaultProps.indexedFields = [field, field];
    const comp = mount(<FieldParamEditor {...defaultProps} />);
    expect(setValue).toHaveBeenCalledTimes(0);

    act(() => {
      (comp.find('EuiComboBox').props() as any).onChange([] as any);
    });

    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenCalledWith(undefined);
  });

  it('should not call setValue when nothing selected and field is required', () => {
    defaultProps.aggParam.required = true;
    const comp = mount(<FieldParamEditor {...defaultProps} />);
    expect(setValue).toHaveBeenCalledTimes(1);

    act(() => {
      (comp.find('EuiComboBox').props() as any).onChange([] as any);
    });

    expect(setValue).toHaveBeenCalledTimes(1);
  });
});
