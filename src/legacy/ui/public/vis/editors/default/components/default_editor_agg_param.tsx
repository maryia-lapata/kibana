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

import _ from 'lodash';
import React, { Fragment } from 'react';
import { AggConfig } from 'ui/vis/agg_config';

interface DefaultEditorAggParamProps {
  agg: AggConfig;
  aggParam: any;
  config: any;
  editor: any;
  onChange: any;
  onFieldTypeChange: any;
  indexedFields: any;
}

function DefaultEditorAggParam({
  agg,
  aggParam,
  onChange,
  onFieldTypeChange,
  config,
  editor,
  indexedFields,
}: DefaultEditorAggParamProps) {
  const optionEnabled = (option: any) => {
    if (option && _.isFunction(option.enabled)) {
      return option.enabled(agg);
    }

    return true;
  };
  const Component = editor;

  return (
    <Fragment>
      {Component && (
        <Component
          agg={agg}
          aggParam={aggParam}
          onChange={onChange}
          onFieldTypeChange={onFieldTypeChange}
          config={config}
          optionEnabled={optionEnabled}
          indexedFields={indexedFields}
        />
      )}
    </Fragment>
  );
}

export { DefaultEditorAggParam };
