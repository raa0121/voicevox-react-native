import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import React, { useContext, useEffect, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfigurationContext, styles } from '../';
import {
  Configuration,
  Speaker,
  SpeakerStyle,
  VoicevoxService
} from '../services/VoicevoxService';

const VoicevoxApi = VoicevoxService.VoicevoxApi;
const OutputPath = FileSystem.documentDirectory + 'output.wav';

type SpeakerPickerProps = { // {{{
  speakers: Speaker[];
  setSpeakers: React.Dispatch<React.SetStateAction<Speaker[]>>;
  selectedSpeaker: Speaker;
  setSelectedSpeaker: React.Dispatch<React.SetStateAction<Speaker>>;
  selectedStyle: number;
  setSelectedStyle: React.Dispatch<React.SetStateAction<number>>;
}// }}}

function SpeakerPicker(props: SpeakerPickerProps) { // {{{
  return (
    <View>
      <Picker
        selectedValue={props.selectedSpeaker}
        onValueChange={(itemValue) => {
          props.setSelectedSpeaker(itemValue);
          props.setSelectedStyle(itemValue.styles[0].id);
        }}
        style={{ height: 50, width: 150 }}>
        {props.speakers.map((speaker: Speaker) => {
          return (
            <Picker.Item
              key={speaker.speakerUuid}
              label={speaker.name}
              value={speaker}
            />
          );
        })}
      </Picker>
      <Picker
        selectedValue={props.selectedStyle}
        onValueChange={(itemValue) =>
          props.setSelectedStyle(itemValue)
        }
        style={{ height: 50, width: 150 }}>
        {props.selectedSpeaker.styles.map((style: SpeakerStyle) => {
          return (
            <Picker.Item
              key={style.id}
              label={style.name}
              value={style.id}
            />
          );
        })}
      </Picker>
    </View>
  );
}// }}}

async function save(data: string) {
  data = data.replace("data:application/octet-stream;base64,", "").replace("data:audio/wav;base64,", "");
  await FileSystem.writeAsStringAsync(OutputPath, data, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

async function openFile() {
}

export function HomeScreen() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker>({ styles: [] as SpeakerStyle[] } as Speaker);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [text, onChangeText] = useState('');
  const [sound, setSound] = useState<Audio.Sound>();
  const { config } = useContext(ConfigurationContext);

  const [api, setApi] = useState(
    new VoicevoxApi(new Configuration(config)),
  );

  useEffect(() => {
    setApi(new VoicevoxApi(new Configuration(config)));
  }, [config]);


  useEffect(() => {
    VoicevoxService.getSpeakers(api).then(value => {
      setSpeakers(value);
    });
  }, [api]);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      } : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Button title='再生' onPress={async () => {
        const audioQuery = await VoicevoxService.postAudioQuery(api, text, selectedStyle);
        const wavfile = await VoicevoxService.postSynthesis(api, selectedStyle, audioQuery);
        const reader = new FileReader();
        reader.onload = async () => {
          await save(reader.result as string);
          const { sound } = await Audio.Sound.createAsync({ uri: OutputPath });
          setSound(sound);
          await sound.playAsync();
        };
        reader.readAsDataURL(wavfile);
      }} />
      <SpeakerPicker
        speakers={speakers}
        setSpeakers={setSpeakers}
        selectedSpeaker={selectedSpeaker}
        setSelectedSpeaker={setSelectedSpeaker}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />
      <StatusBar style='auto' />
    </View>
  );
}
