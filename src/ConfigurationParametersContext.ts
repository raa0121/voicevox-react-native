import React from 'react';
import {
  ConfigurationParameters,
} from './services/VoicevoxService';
export const ConfigurationParametersContext = React.createContext({
  config: {} as ConfigurationParameters,
  setConfig: {} as React.Dispatch<React.SetStateAction<ConfigurationParameters>>
});
