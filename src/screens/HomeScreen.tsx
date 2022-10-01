import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { CheckIcon, Select } from "native-base";
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
  const fontSize = 18;
  const paddingVertical = 6;

  const onChangeSpearker = (itemValue: string) => {
    const newSelectedSpearker = props.speakers.find(spearker => spearker.speakerUuid === itemValue)
    if(newSelectedSpearker) {
      props.setSelectedSpeaker(newSelectedSpearker);
      props.setSelectedStyle(newSelectedSpearker.styles[0].id);
    }
  }

  return (
    <View>
      <Text style={{ fontSize, paddingVertical, fontFamily: 'NotoSansJP_400Regular' }}>
        話者
      </Text>
      <Select
        minWidth="200"
        selectedValue={props.selectedSpeaker.speakerUuid}
        onValueChange={onChangeSpearker}
        _selectedItem={{ endIcon: <CheckIcon size={5} /> }}
        >
        {props.speakers.map((speaker: Speaker) => {
          return (
            <Select.Item
              key={speaker.speakerUuid}
              label={speaker.name}
              value={speaker.speakerUuid}
            />
          );
        })}
      </Select>
      <Text style={{ fontSize, paddingVertical, fontFamily: 'NotoSansJP_400Regular' }}>
        スタイル
      </Text>
      <Select
        minWidth="200"
        selectedValue={props.selectedStyle}
        onValueChange={(itemValue) =>
          props.setSelectedStyle(itemValue)
        }
        _selectedItem={{ endIcon: <CheckIcon size={5} /> }}
        >
        {props.selectedSpeaker.styles.map((style: SpeakerStyle) => {
          return (
            <Select.Item
              key={style.id}
              label={style.name}
              value={style.id}
            />
          );
        })}
      </Select>
    </View>
  );
}// }}}

async function save(data: string) {
  data = data.replace("data:application/octet-stream;base64,", "").replace("data:audio/wav;base64,", "");
  await FileSystem.writeAsStringAsync(OutputPath, data, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

export function HomeScreen() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker>({ styles: [] as SpeakerStyle[] } as Speaker);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [text, onChangeText] = useState('');
  const [sound, setSound] = useState<Audio.Sound>();
  const { config } = useContext(ConfigurationContext);

  const [configuration, setConfiguracion] = useState(
    new Configuration(config),
  );

  useEffect(() => {
    setConfiguracion(new Configuration(config));
  }, [config]);

  const [api, setApi] = useState(
    new VoicevoxApi({} as Configuration),
  );

  useEffect(() => {
    setApi(new VoicevoxApi(configuration));
  }, [configuration]);


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
