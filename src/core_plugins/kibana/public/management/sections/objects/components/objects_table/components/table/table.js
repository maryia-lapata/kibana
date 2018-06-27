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

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  EuiSearchBar,
  EuiBasicTable,
  EuiButton,
  EuiIcon,
  EuiLink,
  EuiSpacer,
  EuiToolTip
} from '@elastic/eui';
import { ReactI18n } from '@kbn/i18n';
import { getSavedObjectLabel, getSavedObjectIcon } from '../../../../lib';

const { FormattedMessage, I18nContext } = ReactI18n;

export class Table extends PureComponent {
  static propTypes = {
    selectedSavedObjects: PropTypes.array.isRequired,
    selectionConfig: PropTypes.shape({
      selectable: PropTypes.func,
      selectableMessage: PropTypes.func,
      onSelectionChange: PropTypes.func.isRequired,
    }).isRequired,
    filterOptions: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired,
    getEditUrl: PropTypes.func.isRequired,
    goInApp: PropTypes.func.isRequired,

    pageIndex: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    itemId: PropTypes.oneOfType([
      PropTypes.string, // the name of the item id property
      PropTypes.func    // (item) => string
    ]),
    totalItemCount: PropTypes.number.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onTableChange: PropTypes.func.isRequired,
    isSearching: PropTypes.bool.isRequired,

    onShowRelationships: PropTypes.func.isRequired,
  };

  render() {
    const {
      pageIndex,
      pageSize,
      itemId,
      items,
      totalItemCount,
      isSearching,
      filterOptions,
      selectionConfig: selection,
      onDelete,
      onExport,
      selectedSavedObjects,
      onQueryChange,
      onTableChange,
      goInApp,
      getEditUrl,
      onShowRelationships,
    } = this.props;

    const pagination = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      totalItemCount: totalItemCount,
      pageSizeOptions: [5, 10, 20, 50],
    };

    const getFilters = intl => [
      {
        type: 'field_value_selection',
        field: 'type',
        name: intl.formatMessage({
          id: 'kbn.management.savedObjects.table.filters.type.name',
          defaultMessage: 'Type'
        }),
        multiSelect: 'or',
        options: filterOptions,
      },
      // Add this back in once we have tag support
      // {
      //   type: 'field_value_selection',
      //   field: 'tag',
      //   name: intl.formatMessage({
      //     id: 'kbn.management.savedObjects.table.filters.tags.name',
      //     defaultMessage: 'Tags'
      //   }),
      //   multiSelect: 'or',
      //   options: [],
      // },
    ];

    const getColumns = intl => [
      {
        field: 'type',
        name: intl.formatMessage({
          id: 'kbn.management.savedObjects.table.columns.type.name',
          defaultMessage: 'Type'
        }),
        description: intl.formatMessage({
          id: 'kbn.management.savedObjects.table.columns.type.description',
          defaultMessage: 'Type of the saved object'
        }),
        width: '50px',
        align: 'center',
        sortable: false,
        render: type => {
          return (
            <EuiToolTip
              position="top"
              content={getSavedObjectLabel(type)}
            >
              <EuiIcon
                aria-label={getSavedObjectLabel(type)}
                type={getSavedObjectIcon(type)}
                size="s"
              />
            </EuiToolTip>
          );
        },
      },
      {
        field: 'title',
        name: intl.formatMessage({
          id: 'kbn.management.savedObjects.table.columns.title.name',
          defaultMessage: 'Title'
        }),
        description: intl.formatMessage({
          id: 'kbn.management.savedObjects.table.columns.title.description',
          defaultMessage: 'Title of the saved object'
        }),
        dataType: 'string',
        sortable: false,
        render: (title, object) => (
          <EuiLink href={getEditUrl(object.id, object.type)}>{title}</EuiLink>
        ),
      },
      {
        name: intl.formatMessage({
          id: 'kbn.management.savedObjects.table.columns.actions.name',
          defaultMessage: 'Actions'
        }),
        actions: [
          {
            name: intl.formatMessage({
              id: 'kbn.management.savedObjects.table.columns.actions.viewObjects.name',
              defaultMessage: 'In app'
            }),
            description: intl.formatMessage({
              id: 'kbn.management.savedObjects.table.columns.actions.viewObjects.description',
              defaultMessage: 'View this saved object within Kibana'
            }),
            icon: 'eye',
            onClick: object => goInApp(object.id, object.type),
          },
          {
            name: intl.formatMessage({
              id: 'kbn.management.savedObjects.table.columns.actions.viewRelationships.name',
              defaultMessage: 'Relationships'
            }),
            description: intl.formatMessage({
              id: 'kbn.management.savedObjects.table.columns.actions.viewRelationships.description',
              defaultMessage: 'View the relationships this saved object has to other saved objects'
            }),
            icon: 'kqlSelector',
            onClick: object =>
              onShowRelationships(object.id, object.type, object.title),
          },
        ],
      },
    ];

    return (
      <I18nContext>
        {
          intl => (
            <Fragment>
              <EuiSearchBar
                filters={getFilters(intl)}
                onChange={onQueryChange}
                toolsRight={[
                  <EuiButton
                    key="deleteSO"
                    iconType="trash"
                    color="danger"
                    onClick={onDelete}
                    isDisabled={selectedSavedObjects.length === 0}
                  >
                    <FormattedMessage
                      id="kbn.management.savedObjects.table.controlButtons.delete"
                      defaultMessage="Delete"
                    />
                  </EuiButton>,
                  <EuiButton
                    key="exportSO"
                    iconType="exportAction"
                    onClick={onExport}
                    isDisabled={selectedSavedObjects.length === 0}
                  >
                    <FormattedMessage
                      id="kbn.management.savedObjects.table.controlButtons.export"
                      defaultMessage="Export"
                    />
                  </EuiButton>,
                ]}
              />
              <EuiSpacer size="s" />
              <div data-test-subj="savedObjectsTable">
                <EuiBasicTable
                  loading={isSearching}
                  itemId={itemId}
                  items={items}
                  columns={getColumns(intl)}
                  pagination={pagination}
                  selection={selection}
                  onChange={onTableChange}
                />
              </div>
            </Fragment>
          )
        }
      </I18nContext>
    );
  }
}
