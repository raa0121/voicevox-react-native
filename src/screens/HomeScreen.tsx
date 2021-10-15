import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Picker, TextInput, View } from 'react-native';
import { ConfigurationParametersContext, styles } from '../';
import {
  Configuration,
  Speaker,
  SpeakerStyle,
  VoicevoxService
} from '../services/VoicevoxService';

const VoicevoxApi = VoicevoxService.VoicevoxApi;

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
        onValueChange={(itemValue, itemIndex) =>
          props.setSelectedSpeaker(itemValue)
        }
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
        onValueChange={(itemValue, itemIndex) =>
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

export function HomeScreen() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker>({ styles: [] as SpeakerStyle[] } as Speaker);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [text, onChangeText] = useState('');
  const [sound, setSound] = useState<Audio.Sound>();
  const { config } = useContext(ConfigurationParametersContext);

  const [api, setApi] = useState(
    new VoicevoxApi(new Configuration(config)),
  );

  useEffect(() => {
    setApi(new VoicevoxApi(new Configuration(config)));
  }, [config]);


  useEffect(() => {
    VoicevoxService.getSpeakers(api).then(value => {
      setSpeakers(value);
    })
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
          const { sound } = await Audio.Sound.createAsync({ uri: reader.result as string });
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
