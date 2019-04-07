import React, { createContext, useContext } from 'react';

import './App.css';
import { ActivityOptionModel, ActivityModel } from './types';
import { Machine, assign } from 'xstate';
import { subHours } from 'date-fns';

import * as uuid from 'uuid';

const activityOptions: ActivityOptionModel[] = [
  {
    name: 'code',
  },
  {
    name: 'meeting',
  },
  {
    name: 'assiting others',
  },
  {
    name: 'interview',
  },
];

const now = new Date();
const activities: ActivityModel[] = [
  {
    id: uuid.v4(),
    name: 'code',
    start: subHours(now, 8).toISOString(),
    end: subHours(now, 6).toISOString(),
  },
  {
    id: uuid.v4(),
    name: 'code',
    start: subHours(now, 5).toISOString(),
    end: subHours(now, 4).toISOString(),
  },
  {
    id: uuid.v4(),
    name: 'code',
    start: subHours(now, 3.5).toISOString(),
    end: subHours(now, 4).toISOString(),
  },

  {
    id: uuid.v4(),
    name: 'meeting',
    start: subHours(now, 4).toISOString(),
    end: subHours(now, 3).toISOString(),
  },
  {
    id: uuid.v4(),
    name: 'code',
    start: subHours(now, 2).toISOString(),
  },
];

export interface Context {
  activityOptions: ActivityOptionModel[];
  activities: ActivityModel[];
}

export interface StateSchema {
  states: {
    idle: {};
  };
}

export type Events =
  | {
      type: 'ACTIVITY_STARTED';
      name: string;
    }
  | { type: 'ACTIVITY_STOPPED'; name: string }
  | { type: 'ACTIVITY_DELETED'; id: string };

export const applicationStateMachine = Machine<Context, StateSchema, Events>({
  id: 'app',
  initial: 'idle',
  context: {
    activityOptions,
    activities,
  },
  states: {
    idle: {
      on: {
        ACTIVITY_STARTED: {
          actions: [
            assign((ctx, event) => {
              return {
                activities: [
                  ...ctx.activities,
                  { id: uuid.v4(), name: event.name, start: new Date().toISOString() },
                ],
              };
            }),
          ],
        },
        ACTIVITY_STOPPED: {
          actions: [
            assign((ctx, event) => {
              const activities = ctx.activities;
              const activity = activities.find(
                ({ name, end }) => name === event.name && !end
              );
              if (!activity) return { activities };
              activity.end = new Date().toISOString();
              return { activities };
            }),
          ],
        },
        ACTIVITY_DELETED: {
          actions: [
            assign((ctx, event) => {
              return { activities: ctx.activities.filter(({ id }) => id !== event.id) };
            }),
          ],
        },
      },
    },
  },
});

export const DispatcherContext: React.Context<(event: Events) => void> = createContext(
  (_event: Events) => {}
);

export const useDispatcherContext = () => useContext(DispatcherContext);
