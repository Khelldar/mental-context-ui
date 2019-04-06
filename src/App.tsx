import React, { createContext, useContext } from 'react';

import './App.css';
import { ActivityOption } from './ActivityOption';
import { ActivityOptionModel, ActivityModel } from './types';
import { Machine, assign } from 'xstate';
import Divider from 'antd/lib/divider';
import { useMachine } from '@xstate/react';
import { Activity } from './Activity';

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
  | { type: 'ACTIVITY_STOPPED'; name: string };

export const applicationStateMachine = Machine<Context, StateSchema, Events>({
  id: 'app',
  initial: 'idle',
  context: {
    activityOptions,
    activities: [],
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
      },
    },
  },
});

export const DispatcherContext: React.Context<(event: Events) => void> = createContext(
  (_event: Events) => {}
);

export const useDispatcherContext = () => useContext(DispatcherContext);

export const App: React.FC = _props => {
  const [state, send] = useMachine(
    applicationStateMachine.withConfig({
      actions: {},
    })
  );

  return (
    <div className="App">
      <DispatcherContext.Provider value={send}>
        {state.context.activityOptions.map(activityOption => (
          <ActivityOption key={activityOption.name} activityOption={activityOption} />
        ))}
        <Divider />
        {state.context.activities.map(activity => (
          <Activity key={activity.id} activity={activity} />
        ))}
      </DispatcherContext.Provider>
    </div>
  );
};

export default App;
