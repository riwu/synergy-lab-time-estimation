import axios from 'axios';
import { Constants } from 'expo';

const API_BASE_URL = 'http://13.228.235.195:3002/';

const get = path => axios.get(API_BASE_URL + path).then(response => response.data);
const [post] = ['post'].map(method =>
  (path, payload) => axios({
    url: API_BASE_URL + path,
    method,
    data: payload,
  }).catch(e => console.log(e)));

export default {
  postDevice: () => {
    const { deviceId, deviceName, isDevice, linkingUrl, manifest } = Constants;
    return post('device', {
      deviceId,
      deviceName,
      isDevice,
      linkingUrl,
      version: manifest.version,
    });
  },
  postAnswer: answer => post('answer', { ...answer, deviceId: Constants.deviceId }),
  postExperimentAnswer: answer => post('experiment/answer', { ...answer, deviceId: Constants.deviceId }),
  postExperimentRound: answer => post('experiment/round', { ...answer, deviceId: Constants.deviceId }),
  isDisqualified: () => get(`disqualified/${Constants.deviceId}`),
};
