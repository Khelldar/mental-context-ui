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
  areaWidth: number;
  activity: ActivityModel;
}

export const Box: React.FC<Props> = ({ activity, areaWidth }) => {
  const dispatch = useDispatcherContext();
  const [state, send] = useMachine(
    machine.withConfig({
      actions: {},
    })
  );

  const now = new Date();

  const minViewTime = subHours(now, 1);
  const maxtViewime = addHours(now, 0.5);
  const secondsPerPX = differenceInSeconds(maxtViewime, minViewTime) / areaWidth;

  const start = activity.start;
  const end = activity.end ? activity.end : now;

  const top = 20;
  const left = 0;
  const height = 60;
  const width = differenceInSeconds(end, start) / secondsPerPX;

  return (
    <div
      style={{
        position: 'relative',
        top: `${top}px`,
        left: `${left}px`,
        height: `${height}px`,
        width: `${width}px`,
        border: '1px black solid',
        background: 'rgba(125, 25, 100, 0.5)',
      }}
    >
      <p> width: {width} </p>
      <p> secondsPerPX: {secondsPerPX} </p>
    </div>
  );
};
