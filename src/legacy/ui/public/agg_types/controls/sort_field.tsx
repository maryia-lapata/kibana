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

import { EuiComboBox, EuiComboBoxOptionProps, EuiFormRow } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { get } from 'lodash';
import React, { useState } from 'react';
import { AggConfig } from 'ui/vis/agg_config';

interface SortFieldSelectProps {
  agg: AggConfig;
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

function SortFieldSelect({ agg = {}, indexedFields = [], onParamsChange }: SortFieldSelectProps) {
  const sortOnLabel = i18n.translate('common.ui.aggTypes.sortField.sortOnLabel', {
    defaultMessage: 'Sort on',
  });
  const initSelection: ComboBoxGroupedOption[] | [] =
    agg.params && agg.params.sortField
      ? [{ label: agg.params.sortField.displayName, value: agg.params.sortField }]
      : [];

  const [selectedOptions, setSelectedOptions] = useState(initSelection);

  const onSortOnChange = (options: ComboBoxGroupedOption[]) => {
    if (options.length !== 0) {
      onParamsChange('sortField', agg, get(options, '0.value'), { isSetFormDirty: true });
      setSelectedOptions(options);
    }
  };

  if (indexedFields.length) {
    return (
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
        />
      </EuiFormRow>
    );
  }
  return null;
}

export { SortFieldSelect };
