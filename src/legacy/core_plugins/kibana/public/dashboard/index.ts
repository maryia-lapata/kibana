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

import { FeatureCatalogueRegistryProvider } from 'ui/registry/feature_catalogue';
import { npSetup, npStart } from 'ui/new_platform';
import chrome from 'ui/chrome';
import { IPrivate } from 'ui/private';
import { ShareContextMenuExtensionsRegistryProvider } from 'ui/share';
import { getUnhashableStatesProvider } from 'ui/state_management/state_hashing/get_unhashable_states_provider';
import { FilterBarQueryFilterProvider } from 'ui/filter_manager/query_filter';
import { DashboardPlugin, LegacyAngularInjectedDependencies } from './plugin';
import { start as data } from '../../../data/public/legacy';
import { localApplicationService } from '../local_application_service';
import { start as embeddables } from '../../../embeddable_api/public/np_ready/public/legacy';

/**
 * Get dependencies relying on the global angular context.
 * They also have to get resolved together with the legacy imports above
 */
async function getAngularDependencies(): Promise<LegacyAngularInjectedDependencies> {
  const injector = await chrome.dangerouslyGetActiveInjector();

  const Private = injector.get<IPrivate>('Private');

  const queryFilter = Private(FilterBarQueryFilterProvider);
  const getUnhashableStates = Private(getUnhashableStatesProvider);
  const shareContextMenuExtensions = Private(ShareContextMenuExtensionsRegistryProvider);

  return {
    queryFilter,
    getUnhashableStates,
    shareContextMenuExtensions,
    getFeatureCatalogueRegistryProvider: () => {
      return Private(FeatureCatalogueRegistryProvider as any);
    },
    dashboardConfig: injector.get('dashboardConfig'),
  };
}

(async () => {
  const instance = new DashboardPlugin();
  instance.setup(npSetup.core, {
    __LEGACY: {
      localApplicationService,
      getAngularDependencies,
    },
  });
  instance.start(npStart.core, {
    data,
    embeddables,
  });
})();
