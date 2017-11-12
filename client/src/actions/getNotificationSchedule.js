import Notifications from 'react-native-push-notification';
import { Alert, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import timeOptions from '../questionnaire/timeOptions';

function getRandom(min, max) {
  return (Math.random() * (max - min)) + min;
}

function getHourDiff(h1, h2) {
  return Math.min(Math.abs(h1 - h2), Math.abs((h1 + 24) - h2), Math.abs(h1 - (h2 + 24)));
}

const TIME_OUT = 0.5;

const getSchedule = (partner, wakeup, sleep) => {
  const partnerSchedule = [];
  if (partner.length <= 5) {
    partner.forEach(time => partnerSchedule.push(time + 0.5));
  }
  const awakeHours = [];
  const notNearSchedule = hr => partnerSchedule.every(time => getHourDiff(time, hr) > 1.6);
  for (let i = wakeup; i < (wakeup + 24); i += 1) {
    const hr = i % 24;
    if (hr === sleep) break;
    if (notNearSchedule(hr)) {
      awakeHours.push(hr);
    }
  }
  const notiLeft = 7 - partnerSchedule.length;

  const exceededSleep = (start, end) => {
    for (let i = Math.trunc(start); i <= end; i += 1) {
      if (i % 24 === sleep) {
        return true;
      }
    }
    return false;
  };

  const frequency = awakeHours.length / notiLeft;
  let freq = frequency;
  let nonPartnerSchedule = [];
  while (freq > 0) {
    const currentSchedule = [];
    for (let i = wakeup; i < (wakeup + 24); i += freq) {
      const maxHr = (i + freq) % 24;
      let upperLimit = i + freq;
      const exceeded = exceededSleep(i, i + freq, sleep);
      if (exceeded) {
        upperLimit = sleep + (i > sleep ? 24 : 0);
      }
      if (notNearSchedule(i) && notNearSchedule(maxHr)) {
        const minNext = (currentSchedule.length === 0)
          ? i
          : Math.max(currentSchedule[currentSchedule.length - 1] + 0.5 + TIME_OUT, i);
        if (upperLimit <= minNext) {
          break;
        }
        const randHr = getRandom(minNext, upperLimit);
        currentSchedule.push(randHr);
      }
      if (exceeded || currentSchedule.length === notiLeft) {
        break;
      }
    }
    if (currentSchedule.length === notiLeft) {
      nonPartnerSchedule = currentSchedule.map(hr => hr % 24);
      break;
    }
    freq -= 0.1;
  }

  return [...partnerSchedule, ...nonPartnerSchedule];
};

export const scheduleNotification = (schedule) => {
  schedule.forEach((time) => {
    Notifications.localNotificationSchedule({
      vibrate: true,
      vibration: 2000,

      title: 'Complete your task now',
      message: 'Click here to access your time estimation task',
      number: '1',

      id: String(Math.floor(time / 1000)),
      userInfo: {
        id: String(Math.floor(time / 1000)),
      },

      date: new Date(time),
      smallIcon: '../icon.png',
      largeIcon: '../icon.png',
    });
  });
};

Notifications.configure({
  onNotification: (notification) => {
    console.log('received', notification);
    if (notification.foreground && Platform.OS === 'ios') {
      console.log('showing alert');
      Alert.alert('Complete your task now');
    }
    Actions.replace('RoutingScreen');
  },

  popInitialNotification: false,
  requestPermissions: false,
});

// to change: i from 0 to 1, remove the temp if statement, remove the 2 moments
const getNotificationSchedule = (answers) => {
  console.log('schedule ans', answers);

  const hoursMap = timeOptions.map(time => moment(time, 'h a').hours());
  const weekdayWakeUp = hoursMap[(answers['QUESTION 5'] || {}).index];
  const weekdaySleep = hoursMap[(answers['QUESTION 6'] || {}).index];
  const weekendWakeup = hoursMap[(answers['QUESTION 7'] || {}).index];
  const weekendSleep = hoursMap[(answers['QUESTION 8'] || {}).index];

  const getHours = question => Object.entries(answers[question] || {})
    .filter(([index, value]) => value === true)
    .map(([index, value]) => hoursMap[index]);
  const weekdayPartner = getHours('QUESTION 9');
  const weekendPartner = getHours('QUESTION 10');

  const finalSchedule = [+moment().add(15, 's')];
  for (let i = 0; i < 8; i += 1) {
    const day = moment().add(i, 'd');
    const daySchedule = [0, 6].includes(day.day())
      ? getSchedule(weekendPartner, weekendWakeup, weekendSleep)
      : getSchedule(weekdayPartner, weekdayWakeUp, weekdaySleep);
    daySchedule.forEach((time) => {
      const hr = Math.floor(time);
      const newHour = moment().add(i, 'd').hour(hr).minute(Math.round((time - hr) * 60));
      if ((+newHour - +moment()) > 60 * 60000) { // temp
        finalSchedule.push(+newHour);
      }
    });
  }

  console.log('final schedule', finalSchedule.slice().sort().map(t => [t, moment(t).toDate().toString()]));
  scheduleNotification(finalSchedule);
  return finalSchedule;
};

export default getNotificationSchedule;