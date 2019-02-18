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

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiText,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { NewVisEditorVisOptions } from '../new_vis_editor_vis_options';
import { VisEditorAggGroup } from '../vis_editor_agg_group';

interface VisEditorSidebarProps {
  state: any;
  indexPattern: any;
  visType: any;
  onRemoveAgg: (agg: any) => void;
  onToggleEnableAgg: (agg: any, isEnable: boolean) => void;
  onChangeAggType: (agg: any, aggType: any) => void;
  aggs: any;
  stats: any;
  vis: any;
}

interface VisEditorSidebarState {
  selectedTab: TabProps;
}

interface TabProps {
  id: string;
  name: string;
}

class NewVisEditorSidebar extends React.Component<VisEditorSidebarProps, VisEditorSidebarState> {
  // public static propTypes = PropTypes.shape({
  //   state: PropTypes.object,
  //   indexPatternTitle: PropTypes.string.isRequired,
  //   visType: PropTypes.object,
  //   onRemoveAgg: PropTypes.func.isRequired,
  //   aggs: PropTypes.object,
  // });

  public state: any = {
    selectedTab: {},
  };
  private firstTab: any;

  public onSelectedTabChanged = (tab: TabProps) => {
    this.setState({
      selectedTab: tab,
    });
  };

  public render() {
    return (
      <EuiFlexGroup
        direction="column"
        gutterSize="none"
        alignItems="center"
        justifyContent="spaceBetween"
      >
        <EuiFlexItem>
          <EuiForm id="visEditorSidebarForm">
            <EuiSpacer size="s" />
            <EuiText size="m" textAlign="center">
              {this.props.indexPattern && this.props.indexPattern.title}
            </EuiText>

            <EuiTabs size="s">{this.renderTabs()}</EuiTabs>
            <EuiSpacer size="s" />
            {this.renderTab()}
          </EuiForm>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  private renderTab() {
    const { selectedTab } = this.state;
    const { visType } = this.props;
    const bucketsgroup = this.props.aggs.bySchemaGroup.buckets;
    const metricsgroup = this.props.aggs.bySchemaGroup.metrics;

    if (selectedTab.id === 'data') {
      return (
        <Fragment>
          {visType.schemas.metrics && (
            <VisEditorAggGroup
              data-test-subj="metricsAggGroup"
              groupName="metrics"
              group={metricsgroup}
              vis={this.props.vis}
              indexPattern={this.props.indexPattern}
              onRemoveAgg={this.props.onRemoveAgg}
              onToggleEnableAgg={this.props.onToggleEnableAgg}
              onChangeAggType={this.props.onChangeAggType}
            />
          )}
          <EuiSpacer size="s" />
          {visType.schemas.buckets && (
            <VisEditorAggGroup
              data-test-subj="bucketsAggGroup"
              groupName="buckets"
              group={bucketsgroup}
              vis={this.props.vis}
              indexPattern={this.props.indexPattern}
              onRemoveAgg={this.props.onRemoveAgg}
              onToggleEnableAgg={this.props.onToggleEnableAgg}
              onChangeAggType={this.props.onChangeAggType}
            />
          )}
        </Fragment>
      );
    }
    return (
      <Fragment>
        {/* <NewVisEditorVisOptions
          class="visEditorSidebar__options"
          editorState="state"
          vis="vis"
          visData="visData"
          uiState="uiState"
          visualize-editor="visualizeEditor"
          editor="tab.editor"
        /> */}
      </Fragment>
    );
  }
  private renderTabs() {
    const tabs: TabProps[] = [];
    const { visType } = this.props;
    const showData = visType.schemas.buckets || visType.schemas.metrics;

    if (showData) {
      tabs.push({
        id: 'data',
        name: i18n.translate('common.ui.vis.editors.sidebar.tabs.dataLabel', {
          defaultMessage: 'Data',
        }),
      });
    }

    if (_.has(visType, 'editorConfig.optionTabs')) {
      visType.editorConfig.optionTabs.reduce((array: TabProps[], tab: any) => {
        array.push({
          id: tab.name,
          name: tab.title,
        });

        return array;
      }, tabs);
    }

    if (!this.state.selectedTab.id) {
      this.firstTab = tabs[0];
    }
    return tabs.map(tab => (
      <EuiTab
        onClick={() => this.onSelectedTabChanged(tab)}
        isSelected={tab.id === (this.state.selectedTab.id || this.firstTab.id)}
        key={tab.id}
        data-test-subj={`${tab.id}Tab`}
      >
        {tab.name}
      </EuiTab>
    ));
  }
}

export { NewVisEditorSidebar };
