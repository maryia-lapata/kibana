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
import React, { Fragment } from 'react';

interface VisEditorAggParamProps {
  aggParam: any;
  config: any;
  editor: any;
  agg: any;
}

class VisEditorAggParam extends React.Component<VisEditorAggParamProps> {
  public render() {
    const { aggParam, config } = this.props;
    const Component = this.props.editor;

    return (
      <Fragment>
        {/* <Component aggParam={aggParam} config={config} optionEnabled={this.optionEnabled} /> */}
      </Fragment>
    );
  }

  private optionEnabled = (option: any) => {
    if (option && _.isFunction(option.enabled)) {
      return option.enabled(this.props.agg);
    }

    return true;
  };
}

export { VisEditorAggParam };
