import {
  AudioQuery,
  DefaultApi as VoicevoxApi,
  Speaker,
  SpeakerStyle,
  Configuration,
} from '../backend';

const getVersion = async (voicevoxApi: VoicevoxApi) => {
  return await voicevoxApi.versionVersionGet();
};

const getSpeakers = async (voicevoxApi: VoicevoxApi) => {
  return await voicevoxApi.speakersSpeakersGet();
};

const postAudioQuery = async (voicevoxApi: VoicevoxApi, text: string, speaker: number) => {
  const param = {text, speaker};
  return await voicevoxApi.audioQueryAudioQueryPost(param);
};

const postSynthesis = async(voicevoxApi: VoicevoxApi, speaker: number, audioQuery: AudioQuery) => {
  const param = {speaker, audioQuery};
  return await voicevoxApi.synthesisSynthesisPost(param);
};

export const VoicevoxService = {
  getVersion,
  getSpeakers,
  postAudioQuery,
  postSynthesis,
  VoicevoxApi,
};

export type { Speaker, SpeakerStyle };
export { Configuration };
