import React, { useCallback, useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Machine, Activity } from 'xstate';
import { ActivityModel } from './types';
import {
  format,
  differenceInMinutes,
  differenceInSeconds,
  subHours,
  addHours,
  endOfDay,
  startOfDay,
  getSeconds,
} from 'date-fns';
import Icon from 'antd/lib/icon';
import { useDispatcherContext } from './appStateMachine';

export interface Context {}

export interface StateSchema {
  states: {
    idle: {};
  };
}

export type Events = {
  type: 'STOP';
};

const machine = Machine<Context, StateSchema, Events>({
  id: 'box',
  initial: 'idle',
  states: {
    idle: {
      on: {},
    },
  },
});

export interface Props {
  top: number;
  secondsPerPX: number;
  activity: ActivityModel;
}

export const Box: React.FC<Props> = ({ activity, secondsPerPX, top }) => {
  const dispatch = useDispatcherContext();
  const [state, send] = useMachine(
    machine.withConfig({
      actions: {},
    })
  );

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const start = activity.start;
  const end = activity.end ? activity.end : now;

  const left = differenceInSeconds(start, startOfDay(start)) / secondsPerPX;
  const height = 60;
  const width = Math.max(10, differenceInSeconds(end, start) / secondsPerPX);

  return (
    <div
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        height: `${height}px`,
        width: `${width}px`,
        border: '1px black solid',
        borderRight: activity.end ? '1px black solid' : 'none',
        background: 'rgba(125, 25, 100, 0.5)',
      }}
    >
      {activity.name}
      <p> width: {width} </p>
    </div>
  );
};
