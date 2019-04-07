import React, { useCallback, useState, useEffect, createRef } from 'react';
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
  activities: ActivityModel[];
}

export const TimeLine: React.FC<Props> = props => {
  const minWidth = 700;
  const maxWith = 3000;

  const [width, setAreaWidth] = useState(1500);

  const secondsPerPX = 86400 / width;

  const ref = createRef<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        height: `100%`,
        width: `100%`,
        overflowY: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
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

          const delta = e.deltaY;

          setAreaWidth(prev => Math.min(Math.max(prev - delta, minWidth), maxWith));
        }}
      >
        <p> width: {width} </p>
        <p> secondsPerPX: {secondsPerPX} </p>
        {props.activities.map(activity => (
          <Box
            key={activity.id}
            activity={activity}
            top={20}
            secondsPerPX={secondsPerPX}
          />
        ))}
      </div>
    </div>
  );
};
