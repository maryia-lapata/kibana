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

import { EuiConfirmModal } from '@elastic/eui';
import { IModule } from 'angular';
import { i18nDirective, i18nFilter, I18nProvider } from '@kbn/i18n/src/angular';

import { IPrivate } from 'ui/private';
import { configureAppAngularModule } from 'ui/legacy_compat';
// @ts-ignore
import { GlobalStateProvider } from 'ui/state_management/global_state';
// @ts-ignore
import { StateManagementConfigProvider } from 'ui/state_management/config_provider';
// @ts-ignore
import { AppStateProvider } from 'ui/state_management/app_state';
// @ts-ignore
import { PrivateProvider } from 'ui/private/private';
// @ts-ignore
import { EventsProvider } from 'ui/events';
// @ts-ignore
import { PersistedState } from 'ui/persisted_state';
// @ts-ignore
import { createTopNavDirective, createTopNavHelper } from 'ui/kbn_top_nav/kbn_top_nav';
// @ts-ignore
import { PromiseServiceCreator } from 'ui/promises/promises';
// @ts-ignore
import { KbnUrlProvider, RedirectWhenMissingProvider } from 'ui/url';
// @ts-ignore
import { confirmModalFactory } from 'ui/modals/confirm_modal';

import {
  AppMountContext,
  ChromeStart,
  DocLinksStart,
  LegacyCoreStart,
  SavedObjectsClientContract,
  ToastsStart,
  UiSettingsClientContract,
} from 'kibana/public';
import { Storage } from '../../../../../plugins/kibana_utils/public';
import {
  createApplyFiltersPopoverDirective,
  createApplyFiltersPopoverHelper,
  createFilterBarDirective,
  createFilterBarHelper,
  DataStart,
} from '../../../data/public';
import { SavedQueryService } from '../../../data/public/search/search_bar/lib/saved_query_service';
import { EmbeddablePublicPlugin } from '../../../../../plugins/embeddable/public';
import { NavigationStart } from '../../../navigation/public';
import { VisualizationsStart } from '../../../visualizations/public';
import { DataPublicPluginStart as NpDataStart } from '../../../../../plugins/data/public';

// @ts-ignore
import { initVisualizeApp } from './app';
import { DocTitle } from './kibana_services';

export interface RenderDeps {
  addBasePath: (path: string) => string;
  angular: any;
  chrome: ChromeStart;
  config: any;
  core: LegacyCoreStart;
  dataStart: DataStart;
  docLinks: DocLinksStart;
  docTitle: DocTitle;
  embeddables: ReturnType<EmbeddablePublicPlugin['start']>;
  FeatureCatalogueRegistryProvider: any;
  getBasePath: () => string;
  getInjected: (name: string, defaultValue?: any) => unknown;
  getUnhashableStates: any;
  indexPatterns: DataStart['indexPatterns']['indexPatterns'];
  indexPatternService: any;
  localStorage: Storage;
  npDataStart: NpDataStart;
  navigation: NavigationStart;
  queryFilter: any;
  savedObjectRegistry: any;
  savedDashboards: any;
  savedObjectsClient: SavedObjectsClientContract;
  savedQueryService: SavedQueryService;
  shareContextMenuExtensions: any;
  toastNotifications: ToastsStart;
  uiCapabilities: any;
  uiSettings: UiSettingsClientContract;
  visualizeCapabilities: any;
  visualizations: VisualizationsStart;
  wrapInI18nContext: any;
}

let angularModuleInstance: IModule | null = null;

export const renderApp = async (element: HTMLElement, appBasePath: string, deps: RenderDeps) => {
  if (!angularModuleInstance) {
    angularModuleInstance = createLocalAngularModule(deps.core, deps.navigation, deps.angular);
    // global routing stuff
    configureAppAngularModule(angularModuleInstance, deps.core as LegacyCoreStart);
    // custom routing stuff
    initVisualizeApp(angularModuleInstance, deps);
  }
  const $injector = mountVisualizeApp(appBasePath, element, deps.angular);
  return () => $injector.get('$rootScope').$destroy();
};

const mainTemplate = (basePath: string) => `<div style="height: 100%">
  <base href="${basePath}" />
  <div ng-view style="height: 100%;"></div>
</div>
`;

const moduleName = 'app/visualize';

const thirdPartyAngularDependencies = ['ngSanitize', 'ngRoute', 'react'];

function mountVisualizeApp(appBasePath: string, element: HTMLElement, angular: any) {
  const mountpoint = document.createElement('div');
  mountpoint.setAttribute('style', 'height: 100%');
  // eslint-disable-next-line
  mountpoint.innerHTML = mainTemplate(appBasePath);
  // bootstrap angular into detached element and attach it later to
  // make angular-within-angular possible
  const $injector = angular.bootstrap(mountpoint, [moduleName]);
  // initialize global state handler
  // $injector.get('globalState');
  element.appendChild(mountpoint);
  return $injector;
}

function createLocalAngularModule(
  core: AppMountContext['core'],
  navigation: NavigationStart,
  angular: any
) {
  createLocalI18nModule(angular);
  createLocalPrivateModule(angular);
  createLocalPromiseModule(angular);
  createLocalConfigModule(core, angular);
  createLocalKbnUrlModule(angular);
  createLocalStateModule(angular);
  createLocalPersistedStateModule(angular);
  createLocalTopNavModule(navigation, angular);
  createLocalConfirmModalModule(angular);
  createLocalFilterBarModule(angular);

  const visualizeAngularModule: IModule = angular.module(moduleName, [
    ...thirdPartyAngularDependencies,
    'app/visualize/Config',
    'app/visualize/I18n',
    'app/visualize/Private',
    'app/visualize/PersistedState',
    'app/visualize/TopNav',
    'app/visualize/State',
    'app/visualize/ConfirmModal',
    'app/visualize/FilterBar',
  ]);
  return visualizeAngularModule;
}

function createLocalConfirmModalModule(angular: any) {
  angular
    .module('app/visualize/ConfirmModal', ['react'])
    .factory('confirmModal', confirmModalFactory)
    .directive('confirmModal', (reactDirective: any) => reactDirective(EuiConfirmModal));
}

function createLocalStateModule(angular: any) {
  angular
    .module('app/visualize/State', [
      'app/visualize/Private',
      'app/visualize/Config',
      'app/visualize/KbnUrl',
      'app/visualize/Promise',
      'app/visualize/PersistedState',
    ])
    .factory('AppState', function(Private: any) {
      return Private(AppStateProvider);
    })
    .service('getAppState', function(Private: any) {
      return Private(AppStateProvider).getAppState;
    })
    .service('globalState', function(Private: any) {
      return Private(GlobalStateProvider);
    });
}

function createLocalPersistedStateModule(angular: any) {
  angular
    .module('app/visualize/PersistedState', ['app/visualize/Private', 'app/visualize/Promise'])
    .factory('PersistedState', (Private: IPrivate) => {
      const Events = Private(EventsProvider);
      return class AngularPersistedState extends PersistedState {
        constructor(value: any, path: any) {
          super(value, path, Events);
        }
      };
    });
}

function createLocalKbnUrlModule(angular: any) {
  angular
    .module('app/visualize/KbnUrl', ['app/visualize/Private', 'ngRoute'])
    .service('kbnUrl', (Private: IPrivate) => Private(KbnUrlProvider))
    .service('redirectWhenMissing', (Private: IPrivate) => Private(RedirectWhenMissingProvider));
}

function createLocalConfigModule(core: AppMountContext['core'], angular: any) {
  angular
    .module('app/visualize/Config', ['app/visualize/Private'])
    .provider('stateManagementConfig', StateManagementConfigProvider)
    .provider('config', () => {
      return {
        $get: () => ({
          get: core.uiSettings.get.bind(core.uiSettings),
        }),
      };
    });
}

function createLocalPromiseModule(angular: any) {
  angular.module('app/visualize/Promise', []).service('Promise', PromiseServiceCreator);
}

function createLocalPrivateModule(angular: any) {
  angular.module('app/visualize/Private', []).provider('Private', PrivateProvider);
}

function createLocalTopNavModule(navigation: NavigationStart, angular: any) {
  angular
    .module('app/visualize/TopNav', ['react'])
    .directive('kbnTopNav', createTopNavDirective)
    .directive('kbnTopNavHelper', createTopNavHelper(navigation.ui));
}

function createLocalFilterBarModule(angular: any) {
  angular
    .module('app/visualize/FilterBar', ['react'])
    .directive('filterBar', createFilterBarDirective)
    .directive('filterBarHelper', createFilterBarHelper)
    .directive('applyFiltersPopover', createApplyFiltersPopoverDirective)
    .directive('applyFiltersPopoverHelper', createApplyFiltersPopoverHelper);
}

function createLocalI18nModule(angular: any) {
  angular
    .module('app/visualize/I18n', [])
    .provider('i18n', I18nProvider)
    .filter('i18n', i18nFilter)
    .directive('i18nId', i18nDirective);
}
