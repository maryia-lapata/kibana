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

import { EuiAccordion, EuiForm } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import React, { Fragment } from 'react';
import { aggTypes } from '../../../../agg_types';
import { aggTypeFilters } from '../../../../agg_types/filter';
import { aggTypeFieldFilters } from '../../../../agg_types/param_types/filter';
import { editorConfigProviders } from '../../config/editor_config_providers';
import { VisEditorAggSelect } from '../vis_editor_agg_select';
import { VisEditorAggParam } from '../vis_editor_agg_param';

interface VisEditorAggParamsProps {
  id?: string;
  agg: any;
  vis: any;
  aggIndex: number;
  aggIsTooLow: boolean;
  groupName: string;
  indexPattern: any;
  onChangeAggType: (agg: any, aggType: any) => void;
}

interface VisEditorAggParamsState {
  editorConfig: any;
}

class VisEditorAggParams extends React.Component<VisEditorAggParamsProps, VisEditorAggParamsState> {
  public state = {
    editorConfig: editorConfigProviders.getConfigForAgg(
      aggTypes.byType[this.props.groupName],
      this.props.indexPattern,
      this.props.agg
    ),
  };
  private editorConfig: any;

  public render() {
    const { agg, indexPattern, groupName } = this.props;
    const aggTypeOptions = aggTypeFilters.filter(aggTypes.byType[groupName], indexPattern, agg);
    const SchemaEditorComponent = agg.schema.editor;
    const params = this.getParams();

    return (
      <EuiForm>
        {this.getErrorMessages()}

        {SchemaEditorComponent && <SchemaEditorComponent />}
        <VisEditorAggSelect
          agg={agg}
          label={this.getAggSelectLabel()}
          aggTypeOptions={aggTypeOptions}
          onChangeAggType={this.onChangeAggType}
        />

        {params.basic.map((param: any) => (
          <VisEditorAggParam editor={param.editor} agg={agg} {...param.attrs} />
        ))}

        {params.advanced && (
          <EuiAccordion
            id="advancedAccordion"
            buttonContent={i18n.translate(
              'common.ui.vis.editors.advancedToggle.advancedLinkLabel',
              {
                defaultMessage: 'Advanced',
              }
            )}
            paddingSize="l"
          >
            {params.advanced.map((param: any) => 
              <VisEditorAggParam editor={param.editor} agg={agg} {...param.attrs} />
            )}
          </EuiAccordion>
        )}
      </EuiForm>
    );
  }

  private getParams() {
    const { agg, vis } = this.props;
    const params: any = {
      basic: [],
      advanced: [],
    };
    const aggParamHTML: any = {
      basic: [],
      advanced: [],
    };
    const aggParamEditorsScope: any = {};

    agg.type.params
      .filter((param: any) => !_.get(this.state.editorConfig, [param.name, 'hidden'], false))
      .forEach((param: any, i: number) => {
        let indexedFields;

        if (agg.schema.hideCustomLabel && param.name === 'customLabel') {
          return;
        }
        // if field param exists, compute allowed fields
        if (param.type === 'field') {
          const availableFields = param.getAvailableFields(agg.getIndexPattern().fields);
          indexedFields = aggTypeFieldFilters.filter(availableFields, param.type, agg, vis);
          aggParamEditorsScope[`${param.name}Options`] = indexedFields;
        }

        if (indexedFields) {
          const hasIndexedFields = indexedFields.length > 0;
          const isExtraParam = i > 0;
          if (!hasIndexedFields && isExtraParam) {
            // don't draw the rest of the options if there are no indexed fields.
            return;
          }
        }

        const type = param.advanced ? 'advanced' : 'basic';

        const aggParam = this.getAggParamHTML(param, i);

        if (aggParam) {
          aggParamHTML[type].push(aggParam);
        }
      });

    return aggParamHTML;
  }
  private onChangeAggType = (agg: any, aggType: any) => {
    this.props.onChangeAggType(agg, aggType);

    this.setState({
      editorConfig: editorConfigProviders.getConfigForAgg(
        aggTypes.byType[this.props.groupName],
        this.props.indexPattern,
        this.props.agg
      ),
    });
  };

  // build HTML editor given an aggParam and index
  private getAggParamHTML(param: any, idx: number) {
    // don't show params without an editor
    if (!param.editor) {
      return;
    }

    const attrs: any = {
      'agg-param': 'agg.type.params[' + idx + ']',
    };

    if (param.advanced) {
      attrs['ng-show'] = 'advancedToggled';
    }

    return {
      attrs,
      editor: param.editor,
    };
  }

  private updateEditorConfig(property = 'fixedValue') {
    const { agg } = this.props;

    Object.keys(this.state.editorConfig).forEach(param => {
      const config = this.editorConfig[param];
      const paramOptions = agg.type.params.find((paramOption: any) => paramOption.name === param);

      // If the parameter has a fixed value in the config, set this value.
      // Also for all supported configs we should freeze the editor for this param.
      if (config.hasOwnProperty(property)) {
        if (paramOptions && paramOptions.deserialize) {
          agg.params[param] = paramOptions.deserialize(config[property]);
        } else {
          agg.params[param] = config[property];
        }
      }
    });
  }

  private getErrorMessages() {
    const { agg, aggIsTooLow } = this.props;

    return (
      <Fragment>
        {aggIsTooLow && (
          <div>
            <p className="visEditorAggParam__error">
              <FormattedMessage
                id="common.ui.vis.editors.aggParams.errors.aggWrongRunOrderErrorMessage"
                defaultMessage='"{schema}" aggs must run before all other buckets!'
                values={{ schema: agg.schema.title }}
              />
            </p>
          </div>
        )}

        {agg.error && (
          <div>
            <p className="visEditorAggParam__error">{agg.error}</p>
          </div>
        )}

        {agg.schema.deprecate && (
          <div>
            <p className="visEditorAggParam__error">
              {agg.schema.deprecateMessage ? (
                agg.schema.deprecateMessage
              ) : (
                <FormattedMessage
                  id="common.ui.vis.editors.aggParams.errors.schemaIsDeprecatedErrorMessage"
                  defaultMessage='"{schema}" has been deprecated.'
                  values={{ schema: agg.schema.title }}
                />
              )}
            </p>
          </div>
        )}
      </Fragment>
    );
  }

  private getAggSelectLabel() {
    const { groupName, aggIndex } = this.props;
    let aggSelectLabel = '';

    if (aggIndex < 1 || groupName !== 'buckets') {
      aggSelectLabel = i18n.translate('common.ui.vis.editors.aggSelect.aggregationLabel', {
        defaultMessage: 'Aggregation',
      });
    }
    if (aggIndex >= 1 && groupName === 'buckets') {
      aggSelectLabel = i18n.translate('common.ui.vis.editors.aggSelect.subAggregationLabel', {
        defaultMessage: 'Sub Aggregation',
      });
    }

    return aggSelectLabel;
  }
}

export { VisEditorAggParams };
