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

import { EuiComboBox, EuiForm, EuiFormRow, EuiLink } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import _ from 'lodash';
import React from 'react';
import { documentationLinks } from '../../../../documentation_links/documentation_links';

interface VisEditorAggSelectProps {
  agg: any;
  label: string;
  aggTypeOptions: any;
  onChangeAggType: (agg: any, aggType: any) => void;
}

interface VisEditorAggSelectState {
  isInvalid: boolean;
}

class VisEditorAggSelect extends React.Component<VisEditorAggSelectProps, VisEditorAggSelectState> {
  constructor(props: VisEditorAggSelectProps) {
    super(props);
    this.state = { isInvalid: false };
  }

  public render() {
    const { agg, aggTypeOptions, label } = this.props;

    const selectedOptions = agg.type ? [{ label: agg.type.title, value: agg.type }] : [];
    let aggHelpLink = null;

    if (_.has(agg, 'type.name')) {
      aggHelpLink = _.get(documentationLinks, ['aggs', agg.type.name]);
    }

    const labelNode = (
      <div className="eui-displayInline">
        {label}
        {aggHelpLink && (
          <EuiLink href={aggHelpLink} target="_blank" rel="noopener" className="pull-right">
            <FormattedMessage
              id="common.ui.vis.editors.aggSelect.helpLinkLabel"
              defaultMessage="{aggTitle} help"
              values={{ aggTitle: agg.type.title }}
            />
          </EuiLink>
        )}
      </div>
    );

    return (
      <EuiForm>
        <EuiFormRow label={labelNode}>
          <EuiComboBox
            placeholder={i18n.translate('common.ui.vis.editors.aggSelect.selectAggPlaceholder', {
              defaultMessage: 'Select an aggregation',
            })}
            id="agg"
            options={this.getGroupedOptions(aggTypeOptions)}
            selectedOptions={selectedOptions}
            singleSelection={{ asPlainText: true }}
            onChange={this.onChangeAggType}
            data-test-subj="visEditorAggSelect"
            isClearable={false}
            isInvalid={this.state.isInvalid}
          />
        </EuiFormRow>
      </EuiForm>
    );
  }

  private onChangeAggType = (selectedOptions: any) => {
    this.setState({
      isInvalid: selectedOptions.length === 0,
    });
    this.props.onChangeAggType(this.props.agg, _.get(selectedOptions, '0.value'));
  };

  private getGroupedOptions(aggTypeOptions: any) {
    const groupedOptions = aggTypeOptions.reduce((array: any[], type: any) => {
      const group = array.find(element => element.label === type.subtype);
      const option = {
        label: type.title,
        value: type,
      };

      if (group) {
        group.options.push(option);
      } else {
        array.push({ label: type.subtype, options: [option] });
      }

      return array;
    }, []);

    groupedOptions.sort(this.sortByLabel);

    groupedOptions.forEach((group: any) => {
      group.options.sort(this.sortByLabel);
    });

    return groupedOptions;
  }

  private sortByLabel(a: any, b: any) {
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  }
}

export { VisEditorAggSelect };
