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

import React, { useEffect, useState } from 'react';
import {
  EuiTitle,
  EuiDragDropContext,
  EuiDroppable,
  EuiDraggable,
  EuiSpacer,
  EuiPanel,
} from '@elastic/eui';

import { Vis } from '../../../';
import { AggConfig } from '../../../agg_config';
import { aggGroupNameMaps } from '../agg_group_names';
import { DefaultEditorAgg } from './default_editor_agg';
import { DefaultEditorAggAdd } from './default_editor_agg_add';
import { DefaultEditorAggCommonProps } from './default_editor_agg_common_props';
import {
  AggsState,
  isInvalidAggsTouched,
  isAggRemovable,
  calcAggIsTooLow,
} from './default_editor_agg_group_helper';
import { Schema } from '../schemas';

interface DefaultEditorAggGroupProps extends DefaultEditorAggCommonProps {
  vis: Vis;
  addSchema: (schems: Schema) => void;
  reorderAggs: (group: AggConfig[]) => void;
}

function DefaultEditorAggGroup({
  formIsTouched,
  groupName,
  lastParentPipelineAggTitle,
  metricAggs,
  state,
  vis,
  addSchema,
  onAggParamsChange,
  onAggTypeChange,
  onToggleEnableAgg,
  removeAgg,
  reorderAggs,
  setTouched,
  setValidity,
}: DefaultEditorAggGroupProps) {
  const groupNameLabel = aggGroupNameMaps()[groupName];
  const group: AggConfig[] = state.aggs.bySchemaGroup[groupName] || [];

  const schemas = vis.type.schemas[groupName];
  const stats = {
    min: 0,
    max: 0,
    count: group.length,
    deprecate: false,
  };

  if (schemas) {
    schemas.forEach((schema: Schema) => {
      stats.min += schema.min;
      stats.max += schema.max;
      stats.deprecate = schema.deprecate;
    });
  }

  const [aggsState, setAggsState] = useState(
    (): AggsState =>
      group.reduce((newState, item) => {
        newState[item.id] = { touched: false, valid: true };
        return newState;
      }, {})
  );

  useEffect(() => {
    setAggsState(
      group.reduce((newState, item) => {
        newState[item.id] = aggsState[item.id] || { touched: false, valid: true };
        return newState;
      }, {})
    );
  }, [group.length]);

  const isGroupValid = Object.entries(aggsState).every(([, item]) => item.valid);
  const isAllAggsTouched = isInvalidAggsTouched(aggsState);

  useEffect(() => {
    setTouched(isAllAggsTouched);
  }, [isAllAggsTouched]);

  useEffect(() => {
    setValidity(isGroupValid);
  }, [isGroupValid]);

  const onDragEnd = ({ source, destination }: any) => {
    if (source && destination) {
      const orderedGroup = Array.from(group);
      const [removed] = orderedGroup.splice(source.index, 1);
      orderedGroup.splice(destination.index, 0, removed);

      reorderAggs(orderedGroup);
    }
  };

  const setTouchedHandler = (aggId: number, touched: boolean) => {
    const newState = Object.assign({}, aggsState);
    if (newState[aggId]) {
      newState[aggId].touched = touched;
    } else {
      newState[aggId] = { valid: true, touched };
    }

    setAggsState(newState);
  };

  const setValidityHandler = (aggId: number, valid: boolean) => {
    const newState = Object.assign({}, aggsState);
    if (newState[aggId]) {
      newState[aggId].valid = valid;
    } else {
      newState[aggId] = { touched: false, valid };
    }

    setAggsState(newState);
  };

  return (
    <EuiDragDropContext onDragEnd={onDragEnd}>
      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <h2>{groupNameLabel}</h2>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiDroppable droppableId={`agg_group_dnd_${groupName}`}>
          <>
            {group.map((agg: AggConfig, index: number) => (
              <EuiDraggable
                key={agg.id}
                index={index}
                draggableId={`agg_group_dnd_${groupName}_${agg.id}`}
                customDragHandle={true}
              >
                {provided => (
                  <DefaultEditorAgg
                    agg={agg}
                    aggIndex={index}
                    aggIsTooLow={calcAggIsTooLow(agg, index, group)}
                    dragHandleProps={provided.dragHandleProps}
                    formIsTouched={
                      formIsTouched || (aggsState[agg.id] && aggsState[agg.id].touched)
                    }
                    groupName={groupName}
                    isDraggable={stats.count > 1}
                    isLastBucket={index === group.length - 1}
                    isRemovable={isAggRemovable(agg, group)}
                    lastParentPipelineAggTitle={lastParentPipelineAggTitle}
                    metricAggs={metricAggs}
                    state={state}
                    onAggParamsChange={onAggParamsChange}
                    onAggTypeChange={onAggTypeChange}
                    onToggleEnableAgg={onToggleEnableAgg}
                    removeAgg={removeAgg}
                    setTouched={isTouched => setTouchedHandler(agg.id, isTouched)}
                    setValidity={isValid => setValidityHandler(agg.id, isValid)}
                  />
                )}
              </EuiDraggable>
            ))}
          </>
        </EuiDroppable>
        {stats.max > stats.count && (
          <DefaultEditorAggAdd
            group={group}
            groupName={groupName}
            schemas={schemas}
            stats={stats}
            addSchema={addSchema}
          />
        )}
      </EuiPanel>
    </EuiDragDropContext>
  );
}

export { DefaultEditorAggGroup };
