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

import { EuiFieldNumber, EuiFormRow, EuiIcon, EuiToolTip } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import { get } from 'lodash';
import React, { useState } from 'react';
import { AggConfig } from 'ui/vis/agg_config';

interface SizeSelectProps {
  agg: AggConfig;
  onParamsChange: (
    type: string,
    agg: AggConfig,
    field: any,
    options?: { isValid?: boolean; isSetFormDirty: boolean }
  ) => void;
}

function SizeSelect({ agg = { params: {} }, onParamsChange }: SizeSelectProps) {
  const [size, setSize] = useState(agg.params.size);

  const label = (
    <>
      <FormattedMessage id="common.ui.aggTypes.sizeLabel" defaultMessage="Size" />{' '}
      <EuiToolTip
        position="right"
        content={i18n.translate('common.ui.aggTypes.sizeTooltip', {
          defaultMessage:
            "Request top-K hits. Multiple hits will be combined via 'aggregate with'.",
        })}
      >
        <EuiIcon type="questionInCircle" />
      </EuiToolTip>
    </>
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(get(e, 'target.value'), 10);
    onParamsChange('size', agg, value, { isSetFormDirty: true });
    setSize(value);
  };

  return (
    <EuiFormRow label={label} className="form-group">
      <EuiFieldNumber
        id={`visEditorTopHitsSize${agg.id}`}
        value={size}
        onChange={onChange}
        min={1}
      />
    </EuiFormRow>
  );
}

export { SizeSelect };
