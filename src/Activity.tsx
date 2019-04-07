import React, { useCallback, useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { ActivityModel } from './types';
import { format, differenceInMinutes, differenceInSeconds } from 'date-fns';
import Icon from 'antd/lib/icon';
import { useDispatcherContext } from './appStateMachine';

export interface Context {
  activity: ActivityModel;
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
  const dispatch = useDispatcherContext();
  const [state, send] = useMachine(
    machine.withConfig({
      actions: {},
    })
  );

  const [now, setNow] = useState(new Date().toISOString());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().toISOString());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const deleteActivity = useCallback(() => {
    dispatch({ type: 'ACTIVITY_DELETED', id: activity.id });
  }, [send, activity.id]);

  const { start } = activity;
  const end = activity.end ? activity.end : now;

  return (
    <div
      style={{
        height: '30px',
        margin: '5px 0px',
        width: `${differenceInSeconds(end, start) / 30}px`,
        borderLeft: '1px black solid',
        borderRight: '1px black solid',
        background: 'rgba(125, 25, 100, 0.5)',
      }}
    >
      {differenceInSeconds(end, start)}
    </div>
  );
};
