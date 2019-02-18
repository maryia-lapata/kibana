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

import { EuiPanel } from '@elastic/eui';
import React, { Fragment } from 'react';
import { aggGroupNameMaps } from '../agg_group_names';
import { VisEditorAgg } from '../vis_editor_agg';

interface VisEditorAggGroupProps {
  groupName: 'metrics' | 'buckets';
  group: any;
  indexPattern: any;
  vis: any;
  onRemoveAgg: (agg: any) => void;
  onChangeAggType: (agg: any, aggType: any) => void;
  onToggleEnableAgg: (agg: any, isEnable: boolean) => void;
}

class VisEditorAggGroup extends React.Component<VisEditorAggGroupProps> {
  private label: string;

  constructor(props: VisEditorAggGroupProps) {
    super(props);

    this.label = aggGroupNameMaps()[props.groupName];
  }

  public render() {
    const { group, groupName } = this.props;
    const isDraggable = (group ? group.length : 0) > 1;

    return (
      <Fragment>
        <EuiPanel grow={false}>
          {this.label}
          <div>
            {group &&
              group.map((agg: any, index: number) => (
                <VisEditorAgg
                  agg={agg}
                  aggIndex={index}
                  groupName={groupName}
                  isAggEnabled={agg.enabled}
                  vis={this.props.vis}
                  group={group}
                  key={agg.id}
                  indexPattern={this.props.indexPattern}
                  onRemoveAgg={this.props.onRemoveAgg}
                  onToggleEnableAgg={this.onToggleEnableAgg}
                  onChangeAggType={this.onChangeAggType}
                  isDraggable={isDraggable}
                />
              ))}
          </div>
        </EuiPanel>
      </Fragment>
    );
  }

  private onToggleEnableAgg = (agg: any, isEnable: boolean) => {
    this.props.onToggleEnableAgg(agg, isEnable);
    this.forceUpdate();
  };

  private onChangeAggType = (agg: any, aggType: any) => {
    this.props.onChangeAggType(agg, aggType);
    this.forceUpdate();
  };
}

export { VisEditorAggGroup };
