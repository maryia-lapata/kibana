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

import { EuiFieldNumber, EuiFormRow } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { get } from 'lodash';
import React from 'react';
import { AggConfig } from 'ui/vis/agg_config';

interface PercentileRanksProps {
  agg: AggConfig;
  onParamsChange: (
    type: string,
    agg: AggConfig,
    field: any,
    options?: { isValid: boolean }
  ) => void;
}

function PercentileRanks({ agg = {}, onParamsChange }: PercentileRanksProps) {
  const label = i18n.translate('common.ui.aggTypes.valuesLabel', { defaultMessage: 'Values' });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(get(e, 'target.value'), 10);
    onParamsChange('values', agg, value);
  };

  return (
    <EuiFormRow label={label} id={`visEditorPercentileRanksLabel${agg.id}`}>
      <EuiFieldNumber min={-Infinity} max={Infinity} onChange={onChange} />
    </EuiFormRow>
  );
}

export { PercentileRanks };
