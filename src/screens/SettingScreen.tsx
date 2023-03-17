import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { CheckIcon, Select } from "native-base";
import { ConfigurationContext, styles } from '../';
import { Configuration, VoicevoxService } from '../services/VoicevoxService';

const VoicevoxApi = VoicevoxService.VoicevoxApi;

const useVersion = (): { version: string } => { // {{{
  const [version, setVersion] = useState('');
  const { config } = useContext(ConfigurationContext);

  const [api, setApi] = useState(
    new VoicevoxApi(config),
  );

  useEffect(() => {
    setApi(new VoicevoxApi(config));
  }, [config]);

  useEffect(() => {
    if(Object.keys(api.configuration).length > 0) {
      VoicevoxService.getVersion(api).then((v) => {
        setVersion(v);
      });
    }
  }, [config, api]);

  return { version };
}; // }}}

function Version() { // {{{
  const fontSize = 18;
  const paddingVertical = 6;
  useContext(ConfigurationContext);

  const version = useVersion().version;
  return (
    <Text style={{ fontSize, paddingVertical, fontFamily: 'NotoSansJP_400Regular' }}>
      {'VOICEVOX Version: '+ version}
    </Text>
  );
} // }}}

export function SettingScreen() {
  const [text, onChangeText] = useState('');
  const context = useContext(ConfigurationContext);

  const fontSize = 18;
  const paddingVertical = 6;
  return (
    <View style={styles.container}>
      <Text style={{
        fontSize,
          paddingVertical,
          fontFamily: 'NotoSansJP_400Regular'
      }}>URLを入力してください</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder='http://192.168.1.XXX:50021'
      />
      <Button title='保存' onPress={async () => {
        const config = new Configuration({ basePath: text });
        context.setConfig(config);
      }} />
      <Version />
      <StatusBar style='auto' />
    </View>
  );
}
