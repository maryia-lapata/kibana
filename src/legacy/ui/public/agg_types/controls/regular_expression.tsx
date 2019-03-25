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

import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { AggParamEditorProps } from '../../vis/editors/default';

function RegexParamEditor({ agg, aggParam, value, setValue }: AggParamEditorProps<string>) {
  const label = (
    <FormattedMessage
      id="common.ui.aggTypes.paramNamePatternLabel"
      defaultMessage="{aggParamName} Pattern"
      values={{ aggParamName: aggParam.displayName || aggParam.name }}
    />
  );

  if (isFunction(aggParam.disabled) && aggParam.disabled(agg)) {
    return null;
  }

  return (
    <EuiFormRow label={label} fullWidth={true} className="visEditorSidebar__aggParamFormRow">
      <EuiFieldText
        id={`visEditorRegexInput${agg.id}${aggParam.name}`}
        value={value || ''}
        onChange={ev => setValue(ev.target.value)}
        fullWidth={true}
      />
    </EuiFormRow>
  );
}

export { RegexParamEditor };
