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

/**
 * Components using the react-intl module require access to the intl context. This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid, English-locale intl context around them.
 */

import React from 'react';
import { ReactI18n } from '@kbn/i18n';
const { IntlProvider, intlShape } = ReactI18n;
import { mount } from 'enzyme';

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'en', messages: {} }, {});

const { intl } = intlProvider.getChildContext();

// When using React-Intl `injectIntl` on components, props.intl is required.
function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

export function mountWithIntl(node, { context, childContextTypes, ...additionalOptions } = {}) {
  return mount(
    nodeWithIntlProp(node),
    {
      context: { ...context, intl },
      childContextTypes: { intl: intlShape, ...childContextTypes },
      ...additionalOptions
    }
  );
}
