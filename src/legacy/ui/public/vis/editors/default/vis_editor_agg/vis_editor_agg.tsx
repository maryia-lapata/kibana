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

import { EuiAccordion, EuiButtonIcon, EuiSpacer, EuiToolTip } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React from 'react';
import { VisEditorAggParams } from '../vis_editor_agg_params';

interface VisEditorAggProps {
  groupName: 'metrics' | 'buckets';
  agg: any;
  aggIndex: number;
  group: any;
  vis: any;
  isDraggable: boolean;
  isAggEnabled: boolean;
  indexPattern: any;
  onRemoveAgg: (agg: any) => void;
  onToggleEnableAgg: (agg: any, isEnable: boolean) => void;
  onChangeAggType: (agg: any, aggType: any) => void;
}

interface VisEditorAggState {
  aggEnabled: boolean;
}

class VisEditorAgg extends React.Component<VisEditorAggProps, VisEditorAggState> {
  constructor(props: VisEditorAggProps) {
    super(props);
    this.state = { aggEnabled: props.agg.enabled };
  }

  public renderEditor = () => {
    const { agg, groupName, indexPattern, aggIndex } = this.props;
    const aggIsTooLow = this.calcAggIsTooLow();

    return (
      <VisEditorAggParams
        id={'visAggEditorParams${agg.id}'}
        agg={agg}
        vis={this.props.vis}
        aggIndex={aggIndex}
        groupName={groupName}
        indexPattern={indexPattern}
        onChangeAggType={this.props.onChangeAggType}
        aggIsTooLow={aggIsTooLow}
      />
    );
  };

  public render() {
    return (
      <EuiAccordion
        id="visEditorAggAccordion"
        buttonContent={this.props.agg.schema.title}
        paddingSize="m"
        buttonContentClassName=""
        extraAction={this.renderEditorButtons()}
        className=""
      >
        <EuiSpacer size="s" />
        {this.renderEditor()}
      </EuiAccordion>
    );
  }

  private renderEditorButtons() {
    const { agg, isAggEnabled, isDraggable } = this.props;
    const actionIcons: any[] = [];

    if (isAggEnabled && this.canRemove(agg)) {
      actionIcons.push({
        id: 'disableAggregation',
        color: 'text',
        type: 'eye',
        onClick: () => this.props.onToggleEnableAgg(agg, false),
        ariaLabel: i18n.translate('common.ui.vis.editors.agg.disableAggButtonAriaLabel', {
          defaultMessage: 'Disable aggregation',
        }),
        tooltip: i18n.translate('common.ui.vis.editors.agg.disableAggButtonTooltip', {
          defaultMessage: 'Disable aggregation',
        }),
        dataTestSubj: 'disableAggregationBtn',
      });
    }

    if (!isAggEnabled) {
      actionIcons.push({
        id: 'enableAggregation',
        color: 'text',
        type: 'eyeClosed',
        onClick: () => this.props.onToggleEnableAgg(agg, true),
        ariaLabel: i18n.translate('common.ui.vis.editors.agg.enableAggButtonAriaLabel', {
          defaultMessage: 'Enable aggregation',
        }),
        tooltip: i18n.translate('common.ui.vis.editors.agg.enableAggButtonTooltip', {
          defaultMessage: 'Enable aggregation',
        }),
        dataTestSubj: 'disableAggregationBtn',
      });
    }

    if (isDraggable) {
      // directive draggable-handle
      actionIcons.push({
        id: 'dragHandle',
        color: 'text',
        type: 'sortable',
        onClick: () => 'onPriorityReorder(direction)',
        ariaLabel: i18n.translate('common.ui.vis.editors.agg.modifyPriorityButtonAriaLabel', {
          defaultMessage:
            'Use up and down key on this button to move this aggregation up and down in the priority order.',
        }),
        tooltip: i18n.translate('common.ui.vis.editors.agg.modifyPriorityButtonTooltip', {
          defaultMessage: 'Modify priority by dragging',
        }),
        dataTestSubj: 'dragHandleBtn',
      });
    }

    if (this.canRemove(agg)) {
      actionIcons.push({
        id: 'removeDimension',
        color: 'danger',
        type: 'cross',
        onClick: () => this.props.onRemoveAgg(agg),
        ariaLabel: i18n.translate('common.ui.vis.editors.agg.removeDimensionButtonAriaLabel', {
          defaultMessage: 'Remove dimension',
        }),
        tooltip: i18n.translate('common.ui.vis.editors.agg.removeDimensionButtonTooltip', {
          defaultMessage: 'Remove dimension',
        }),
        dataTestSubj: 'removeDimensionBtn',
      });
    }

    return (
      <div>
        {actionIcons.map(icon => (
          <EuiToolTip key={icon.id} position="bottom" content={icon.tooltip}>
            <EuiButtonIcon
              iconType={icon.type}
              color={icon.color}
              onClick={icon.onClick}
              aria-label={icon.ariaLabel}
              data-test-subj={icon.dataTestSubj}
            />
          </EuiToolTip>
        ))}
      </div>
    );
  }

  private canRemove = (aggregation: any) => {
    const metricCount = _.reduce(
      this.props.group,
      (count, agg) => {
        return agg.schema.name === aggregation.schema.name ? ++count : count;
      },
      0
    );

    // make sure the the number of these aggs is above the min
    return metricCount > aggregation.schema.min;
  };

  private calcAggIsTooLow() {
    const { agg, group, aggIndex } = this.props;

    if (!agg.schema.mustBeFirst) {
      return false;
    }

    const firstDifferentSchema = _.findIndex(group, aggObj => {
      return aggObj.schema !== agg.schema;
    });

    if (firstDifferentSchema === -1) {
      return false;
    }

    return aggIndex > firstDifferentSchema;
  }
}

export { VisEditorAgg };
