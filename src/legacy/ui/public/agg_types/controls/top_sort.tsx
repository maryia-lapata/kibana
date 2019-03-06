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

import { EuiComboBox, EuiComboBoxOptionProps, EuiFormRow, EuiSelect } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { get } from 'lodash';
import React, { Fragment, useState } from 'react';
import { AggConfig } from 'ui/vis/agg_config';
import { groupAggregationsByType } from '../../vis/editors/default/default_editor_utils';

interface TopSortProps {
  agg: AggConfig;
  aggParam: any;
  indexedFields: any[];
  onParamsChange: (
    type: string,
    agg: AggConfig,
    field: any,
    options?: { isValid?: boolean; isSetFormDirty: boolean }
  ) => void;
}

type ComboBoxGroupedOption = EuiComboBoxOptionProps & {
  label: string;
  options?: EuiComboBoxOptionProps[];
};

function TopSortSelect({ agg = {}, aggParam, onParamsChange, indexedFields = [] }: TopSortProps) {
  const sortOnLabel = i18n.translate('common.ui.aggTypes.topSort.sortOnLabel', {
    defaultMessage: 'Sort on',
  });
  const orderLabel = i18n.translate('common.ui.aggTypes.topSort.orderLabel', {
    defaultMessage: 'Order',
  });
  const initSelection: ComboBoxGroupedOption[] | [] =
    agg.params && agg.params.sortField
      ? [{ label: agg.params.sortField.displayName, value: agg.params.sortField }]
      : [];

  const [selectedOptions, setSelectedOptions] = useState(initSelection);
  const [order, setOrder] = useState(agg.params.sortOrder);

  const onSortOnChange = (options: ComboBoxGroupedOption[]) => {
    const value = get(options, '0.value');

    onParamsChange('sortField', agg, value, { isSetFormDirty: true });
    setSelectedOptions(options);
  };

  const onOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = get(e, 'target.value');
    setOrder(value);
    onParamsChange('sortOrder', agg, aggParam.options.find(opt => opt.val === value), {
      isSetFormDirty: true,
    });
  };

  const orderSortOptions = aggParam.options.map(option => ({
    text: option.display,
    value: option.val,
  }));
  return (
    <Fragment>
      {indexedFields.length ? (
        <EuiFormRow label={sortOnLabel} className="form-group">
          <EuiComboBox
            placeholder={i18n.translate('common.ui.aggTypes.topSort.sortOnPlaceholder', {
              defaultMessage: 'Select a field',
            })}
            options={indexedFields}
            selectedOptions={selectedOptions}
            singleSelection={{ asPlainText: true }}
            isClearable={false}
            onChange={onSortOnChange}
            data-test-subj=""
          />
        </EuiFormRow>
      ) : null}
      <EuiFormRow label={orderLabel} className="form-group">
        <EuiSelect
          id={`visEditorTopSort${agg.id}`}
          value={order}
          options={orderSortOptions}
          onChange={onOrderChange}
        />
      </EuiFormRow>
    </Fragment>
  );
}

export { TopSortSelect };
