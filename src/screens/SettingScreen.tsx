import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { ConfigurationParametersContext, styles } from '../';
import {
  Configuration,
  ConfigurationParameters,
  VoicevoxService
} from '../services/VoicevoxService';

const VoicevoxApi = VoicevoxService.VoicevoxApi;

const useVersion = (): { version: string } => { // {{{
  const [version, setVersion] = useState("");
  const { config } = useContext(ConfigurationParametersContext);

  const [api, setApi] = useState(
    new VoicevoxApi(new Configuration(config)),
  );

  useEffect(() => {
    setApi(new VoicevoxApi(new Configuration(config)));
  }, [config]);

  useEffect(() => {
    VoicevoxService.getVersion(api).then((v) => {
      setVersion(v);
    });
  }, [api]);

  return { version };
}; // }}}

type versionProps = {
  text: string
}
function Version(props: versionProps) { // {{{
  const fontSize = 18;
  const paddingVertical = 6;
  const { config } = useContext(ConfigurationParametersContext);
  let message = 'URLを入れてください';
  if (props.text != '') {
    const version = useVersion().version;
    message = 'VOICEVOX Version:' + version; 
  }
  return (
    <Text style={{ fontSize, paddingVertical, fontFamily: 'NotoSansJP_400Regular' }}>
      {message}
    </Text>
  );
} // }}}

export function SettingScreen() {
  const [text, onChangeText] = useState('');
  const context = useContext(ConfigurationParametersContext)
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder='http://192.168.1.XXX:50021'
      />
      <Button title='保存' onPress={async () => {
        const config = new Configuration({ basePath: text } as ConfigurationParameters);
        context.setConfig(config);
      }} />
      <Version text={text} />
      <StatusBar style='auto' />
    </View>
  );
}
