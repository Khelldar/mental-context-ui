import React from 'react';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import Button from 'antd/lib/button';
import { ActivityOptionModel } from './types';
import { useDispatcherContext } from './appStateMachine';

export interface Context {
  activityOption: ActivityOptionModel;
}

export interface StateSchema {
  states: {
    active: {};
    inactive: {};
  };
}

export type Events = {
  type: 'TOGGLE';
};

const machine = Machine<Context, StateSchema, Events>({
  id: 'activity-option',
  initial: 'inactive',
  states: {
    inactive: {
      on: { TOGGLE: { target: 'active', actions: ['activated'] } },
    },
    active: {
      on: { TOGGLE: { target: 'inactive', actions: ['deactivated'] } },
    },
  },
});

export interface Props {
  activityOption: ActivityOptionModel;
}

export const ActivityOption: React.FC<Props> = ({ activityOption }) => {
  const dispatch = useDispatcherContext();

  const [state, send] = useMachine(
    machine.withConfig(
      {
        actions: {
          activated: (ctx, _event) => {
            dispatch({ type: 'ACTIVITY_STARTED', name: ctx.activityOption.name });
          },
          deactivated: (ctx, _event) => {
            dispatch({ type: 'ACTIVITY_STOPPED', name: ctx.activityOption.name });
          },
        },
      },
      { activityOption }
    )
  );

  return (
    <Button
      style={{ margin: '5px' }}
      type="primary"
      ghost={state.matches('active')}
      onClick={() => send('TOGGLE')}
    >
      {state.context.activityOption.name}
    </Button>
  );
};
