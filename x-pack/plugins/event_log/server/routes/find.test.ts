/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { findRoute } from './find';
import { mockRouter, RouterMock } from '../../../../../src/core/server/http/router/router.mock';
import { mockHandlerArguments, fakeEvent } from './_mock_handler_arguments';
import { eventLogClientMock } from '../event_log_client.mock';

const eventLogClient = eventLogClientMock.create();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('find', () => {
  it('finds events with proper parameters', async () => {
    const router: RouterMock = mockRouter.create();

    findRoute(router);

    const [config, handler] = router.get.mock.calls[0];

    expect(config.path).toMatchInlineSnapshot(`"/api/event_log/{type}/{id}/_find"`);

    const events = [fakeEvent(), fakeEvent()];
    const result = {
      page: 0,
      per_page: 10,
      total: events.length,
      data: events,
    };
    eventLogClient.findEventsBySavedObject.mockResolvedValueOnce(result);

    const [context, req, res] = mockHandlerArguments(
      eventLogClient,
      {
        params: { id: '1', type: 'action' },
      },
      ['ok']
    );

    await handler(context, req, res);

    expect(eventLogClient.findEventsBySavedObject).toHaveBeenCalledTimes(1);

    const [type, id] = eventLogClient.findEventsBySavedObject.mock.calls[0];
    expect(type).toEqual(`action`);
    expect(id).toEqual(`1`);

    expect(res.ok).toHaveBeenCalledWith({
      body: result,
    });
  });

  it('supports optional pagination parameters', async () => {
    const router: RouterMock = mockRouter.create();

    findRoute(router);

    const [, handler] = router.get.mock.calls[0];
    eventLogClient.findEventsBySavedObject.mockResolvedValueOnce({
      page: 0,
      per_page: 10,
      total: 0,
      data: [],
    });

    const [context, req, res] = mockHandlerArguments(
      eventLogClient,
      {
        params: { id: '1', type: 'action' },
        query: { page: 3, per_page: 10 },
      },
      ['ok']
    );

    await handler(context, req, res);

    expect(eventLogClient.findEventsBySavedObject).toHaveBeenCalledTimes(1);

    const [type, id, options] = eventLogClient.findEventsBySavedObject.mock.calls[0];
    expect(type).toEqual(`action`);
    expect(id).toEqual(`1`);
    expect(options).toMatchObject({});

    expect(res.ok).toHaveBeenCalledWith({
      body: {
        page: 0,
        per_page: 10,
        total: 0,
        data: [],
      },
    });
  });
});
