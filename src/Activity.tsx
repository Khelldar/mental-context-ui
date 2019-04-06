import React from 'react';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { ActivityModel } from './types';
import { format } from 'date-fns';

export interface Context {
  id: string;
  name: string;
  start: string;
  end: string;
}

export interface StateSchema {
  states: {
    active: {};
    complete: {};
  };
}

export type Events = {
  type: 'STOP';
};

const machine = Machine<Context, StateSchema, Events>({
  id: 'activity-option',
  initial: 'active',
  states: {
    active: {
      on: { STOP: 'complete' },
    },
    complete: {
      on: {},
    },
  },
});

export interface Props {
  activity: ActivityModel;
}

export const Activity: React.FC<Props> = ({ activity }) => {
  const [state, send] = useMachine(
    machine.withConfig({
      actions: {},
    })
  );
  const { name } = activity;
  const start = format(activity.start, 'H:m:s');
  const end = activity.end ? format(activity.end, 'H:m:s') : '';
  return (
    <div style={{ width: '400px', height: '20px' }}>
      [{start}] {name} [{end}]
    </div>
  );
};
