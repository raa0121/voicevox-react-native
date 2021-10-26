import React from 'react';
import {
  Configuration,
} from './services/VoicevoxService';
export const ConfigurationContext = React.createContext({
  config: {} as Configuration,
  setConfig: {} as React.Dispatch<React.SetStateAction<Configuration>>
});
