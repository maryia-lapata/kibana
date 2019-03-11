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

import { isFunction } from 'lodash';
import React from 'react';
import { AggConfig } from 'ui/vis/agg_config';

interface DefaultEditorAggParamProps {
  agg: AggConfig;
  aggParam: any;
  config: any;
  editor: any;
  vis: any;
  isAdvanced: boolean;
  onChange: (agg: AggConfig) => void;
  onParamsChange: (type: string, agg: AggConfig, value: any) => void;
  setFormDirty: (type: string) => void;
  setFormValidity: (type: string, options?: { isValid: boolean; isSetFormDirty: boolean }) => void;
  indexedFields: any[];
}

function DefaultEditorAggParam({
  agg,
  aggParam,
  onChange,
  onParamsChange,
  setFormDirty,
  setFormValidity,
  config,
  editor,
  vis,
  indexedFields,
}: DefaultEditorAggParamProps) {
  const optionEnabled = (option: any) => {
    if (option && isFunction(option.enabled)) {
      return option.enabled(agg);
    }

    return true;
  };
  const updateParam = (
    type: string,
    aggObject: AggConfig,
    value: any,
    options?: { isValid: boolean; isSetFormDirty: boolean }
  ) => {
    onParamsChange(type, aggObject, value);

    if (options && options.isSetFormDirty) {
      setFormDirty(type);
    }

    if (options && typeof options.isValid === 'boolean') {
      setFormValidity(type, options);
    }
  };
  const Component = editor;

  if (Component) {
    return (
      <Component
        agg={agg}
        vis={vis}
        aggParam={aggParam}
        onChange={onChange}
        onParamsChange={updateParam}
        config={config}
        optionEnabled={optionEnabled}
        indexedFields={indexedFields}
      />
    );
  }

  return null;
}

export { DefaultEditorAggParam };
