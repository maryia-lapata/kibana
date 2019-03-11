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

import { EuiFormRow, EuiIcon, EuiSelect, EuiToolTip } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import { get } from 'lodash';
import React from 'react';
import { AggConfig } from 'ui/vis/agg_config';

interface TopAggregateSelectProps {
  agg: AggConfig;
  aggParam: any;
  vis: any;
  onParamsChange: (
    type: string,
    agg: AggConfig,
    field: any,
    options?: { isValid?: boolean; isSetFormDirty: boolean }
  ) => void;
}

interface AggOption {
  display: string;
  val: string;
  isCompatibleVis: (visName: string) => boolean;
  isCompatibleType: (fieldType: string) => boolean;
}

function TopAggregateSelect({
  agg = {},
  aggParam = { options: [] },
  vis = { type: {} },
  onParamsChange,
}: TopAggregateSelectProps) {
  const label = (
    <>
      <FormattedMessage
        id="common.ui.aggTypes.aggregateWithLabel"
        defaultMessage="Aggregate with"
      />{' '}
      <EuiToolTip
        position="right"
        content={i18n.translate('common.ui.aggTypes.aggregateWithTooltip', {
          defaultMessage:
            'Choose a strategy for combining multiple hits or a multi-valued field into a single metric',
        })}
      >
        <EuiIcon type="questionInCircle" />
      </EuiToolTip>
    </>
  );
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: string = get(e, 'target.value');
    onParamsChange('aggregate', agg, aggParam.options.find((opt: AggOption) => opt.val === value), {
      isSetFormDirty: true,
    });
  };

  const options = aggParam.options
    .filter((option: AggOption) => {
      return (
        option.isCompatibleVis(vis.type.name) &&
        option.isCompatibleType(get(agg, 'params.field.type'))
      );
    })
    .map((opt: AggOption) => ({ text: opt.display, val: opt }));

  return (
    <EuiFormRow label={label} className="form-group">
      <EuiSelect
        id={`visEditorTopHitsAggregate${agg.id}`}
        options={options}
        onChange={onChange}
        hasNoInitialSelection={true}
      />
    </EuiFormRow>
  );
}

export { TopAggregateSelect };
