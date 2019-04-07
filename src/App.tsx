import React from 'react';
import './App.css';
import { ActivityOption } from './ActivityOption';

import Divider from 'antd/lib/divider';
import { useMachine } from '@xstate/react';
import { Activity } from './Activity';
import { applicationStateMachine, DispatcherContext } from './appStateMachine';
import { Flex } from 'rebass';
import * as lodash from 'lodash';
import { ActivityModel } from './types';

export const App: React.FC = _props => {
  const [state, send] = useMachine(
    applicationStateMachine.withConfig({
      actions: {},
    })
  );

  const activitiesByName = lodash.reduce<ActivityModel, Record<string, ActivityModel[]>>(
    state.context.activities,
    (acc, activity) => {
      if (!acc[activity.name]) {
        acc[activity.name] = [];
      }
      acc[activity.name].push(activity);
      return acc;
    },
    {}
  );

  return (
    <div className="App">
      <DispatcherContext.Provider value={send}>
        {state.context.activityOptions.map(activityOption => (
          <ActivityOption key={activityOption.name} activityOption={activityOption} />
        ))}
        <Divider />

        <Flex
          style={{
            margin: '5px',
            padding: '5px',
            border: '1px black solid',
            width: '700px',
            height: '500px',
          }}
        >
          <Flex flexDirection="column" width={1 / 5}>
            {Object.keys(activitiesByName).map(name => (
              <div style={{ height: '40px' }} key={name}>
                {name}
              </div>
            ))}
          </Flex>

          <Flex width={4 / 5} flexDirection="column">
            {Object.keys(activitiesByName)
              .map(name => activitiesByName[name])
              .map(activities => {
                return (
                  <Flex flexDirection="row" key={activities[0].name}>
                    {activities.map(activity => (
                      <Activity key={activity.id} activity={activity} />
                    ))}
                  </Flex>
                );
              })}
          </Flex>
        </Flex>
      </DispatcherContext.Provider>
    </div>
  );
};

export default App;
