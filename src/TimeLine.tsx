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
import { Box } from './Box';

export interface Props {
  activity: ActivityModel;
}

export const TimeLine: React.FC<Props> = props => {
  const minWidth = 700;

  const [width, setAreaWidth] = useState(1500);

  return (
    <div
      style={{
        height: `100%`,
        width: `100%`,
        overflowY: 'hidden',
      }}
    >
      <div
        style={{
          height: `100%`,
          width: `${width}px`,
          border: '1px black solid',
          background: 'rgba(50, 50, 50, 0.5)',
        }}
        onScroll={e => {
          e.stopPropagation();
          e.preventDefault();

          return false;
        }}
        onWheel={e => {
          e.stopPropagation();
          e.preventDefault();

          const delta = e.deltaY;
          setAreaWidth(prev => Math.max(prev - delta, minWidth));
        }}
        onClick={e => {
          setAreaWidth(prev => Math.max(prev - 10, minWidth));
        }}
      >
        <p> width: {width} </p>
        <Box activity={props.activity} areaWidth={width} />
      </div>
    </div>
  );
};
