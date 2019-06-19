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

export enum AGG_TYPE_ACTION_KEYS {
  TOUCHED = 'aggTypeTouched',
  VALIDITY = 'aggTypeValidity',
}

export interface AggTypeState {
  touched: boolean;
  validity: boolean;
}

export interface AggTypeAction {
  type: AGG_TYPE_ACTION_KEYS;
  touched?: boolean;
  validity?: boolean;
}

function aggTypeReducer(state: AggTypeState, action: AggTypeAction): AggTypeState {
  switch (action.type) {
    case AGG_TYPE_ACTION_KEYS.TOUCHED:
      return { ...state, touched: action.touched };
    case AGG_TYPE_ACTION_KEYS.VALIDITY:
      return { ...state, validity: action.validity };
    default:
      throw new Error();
  }
}

export enum AGG_PARAMS_ACTION_KEYS {
  TOUCHED = 'aggParamsTouched',
  VALIDITY = 'aggParamsValidity',
  RESET = 'aggParamsReset',
}

export interface AggParamsItem {
  touched: boolean;
  validity: boolean;
}

export interface AggParamsAction {
  type: AGG_PARAMS_ACTION_KEYS;
  touched?: boolean;
  validity?: boolean;
  paramName?: string;
}

export interface AggParamsState {
  [key: string]: AggParamsItem;
}

function aggParamsReducer(
  state: AggParamsState,
  { type, paramName = '', touched, validity }: AggParamsAction
): AggParamsState {
  const targetParam = state[paramName] || {
    validity: true,
    touched: false,
  };
  switch (type) {
    case AGG_PARAMS_ACTION_KEYS.TOUCHED:
      return {
        ...state,
        [paramName]: {
          ...targetParam,
          touched,
        },
      } as AggParamsState;
    case AGG_PARAMS_ACTION_KEYS.VALIDITY:
      return {
        ...state,
        [paramName]: {
          ...targetParam,
          validity,
        },
      } as AggParamsState;
    case AGG_PARAMS_ACTION_KEYS.RESET:
      return {};
    default:
      throw new Error();
  }
}

function initAggParamsState(params: object[]): AggParamsState {
  const state = {};
  params.forEach((param: any) => {
    state[param.aggParam.name] = {
      validity: true,
      touched: false,
    } as AggParamsItem;
  });

  return state;
}

export { aggTypeReducer, aggParamsReducer, initAggParamsState };
