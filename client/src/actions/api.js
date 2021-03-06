import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

axios.defaults.baseURL = 'https://a.wangriwu.com:4003/';

const deviceId = DeviceInfo.getUniqueID();

const deviceInfo = {
  deviceId,
  deviceName: DeviceInfo.getDeviceName(),
  isDevice: !DeviceInfo.isEmulator(),
  version: DeviceInfo.getVersion(),
  timezone: new Date().getTimezoneOffset(),
  country: DeviceInfo.getTimezone(),
  isTablet: DeviceInfo.isTablet(),
  model: DeviceInfo.getModel(),
};

const get = path => axios.get(path).then(response => response.data);

const [post, patch, put] = ['post', 'patch', 'put'].map(method => (path, data) =>
  axios({
    method,
    url: path,
    data,
  }).then(response => response.data));

export const isDisqualified = () => get(`disqualified/${deviceId}`);
export const disqualify = () => patch('disqualify', { deviceId });
export const postAll = (state, codeType) => put('all', { ...state, device: deviceInfo, codeType });
export const verifyAccess = code => post('/verifyAccess', { code });
