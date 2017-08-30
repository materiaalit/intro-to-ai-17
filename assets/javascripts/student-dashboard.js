import TmcClient from 'tmc-client-js';
import * as store from 'store';

const client = new TmcClient();

function getCourseName() {
  return store.get('tmc.course');
}

function getOhpeOhjaKesa17Config() {
  return {
    courseId: '214',
    courseName: 'Ohjelmoinnin perusteet ja jatkokurssi',
    exerciseGroups: {
      'Osa 1': ['01.05.2017 16:00', '16.05.2017 23:59', 'osa01-']
    },
  }
}

function getOhjaConfig() {
  return {
    courseId: '208',
    courseName: 'Ohjelmoinnin jatkokurssi',
    exerciseGroups: {
      'Osa 8': ['10.03.2017 05:00', '17.03.2017 12:05', 'osa08-'],
      'Osa 9': ['13.03.2017 18:00', '24.03.2017 12:05', 'osa09-'],
      'Osa 10': ['20.03.2017 18:00', '31.03.2017 12:05', 'osa10-'],
      'Osa 11': ['27.03.2017 20:00', '07.04.2017 12:05', 'osa11-'],
      'Osa 12': ['03.04.2017 22:00', '21.04.2017 12:05', 'osa12-'],
      'Osa 13': ['11.04.2017 10:00', '28.04.2017 12:05', 'osa13-'],
      'Osa 14': ['18.04.2017 10:00', '05.05.2017 12:05', 'osa14-']
    }
  };
}

function getHyConfig() {
  return {
    courseId: '198',
    courseName: 'Ohjelmoinnin perusteet',
    exerciseGroups: {
      'Osa 1': ['16.01.2017 01:00', '22.01.2017 20:05', 'osa01-'],
      'Osa 2': ['22.01.2017 07:00', '27.01.2017 12:05', 'osa02-'],
      'Osa 3': ['29.01.2017 07:00', '03.02.2017 12:05', 'osa03-'],
      'Osa 4': ['04.02.2017 07:00', '10.02.2017 12:05', 'osa04-'],
      'Osa 5': ['10.02.2017 07:00', '17.02.2017 12:05', 'osa05-'],
      'Osa 6': ['17.02.2017 07:00', '24.02.2017 12:05', 'osa06-'],
      'Osa 7': ['23.02.2017 16:00', '03.03.2017 12:05', 'osa07-']
    }
  };
}

function getMoocConfig() {
  return {
    courseId: '199',
    courseName: 'Ohjelmoinnin MOOC',
    exerciseGroups: {
      'Osa 1': ['16.01.2017 01:00', '26.02.2017 21:59', 'osa01-'],
      'Osa 2': ['23.01.2017 01:00', '26.02.2017 21:59', 'osa02-'],
      'Osa 3': ['30.01.2017 01:00', '26.02.2017 21:59', 'osa03-'],
      'Osa 4': ['06.02.2017 01:00', '26.02.2017 21:59', 'osa04-'],
      'Osa 5': ['10.02.2017 07:00', '05.03.2017 21:59', 'osa05-'],
      'Osa 6': ['17.02.2017 07:00', '12.03.2017 21:59', 'osa06-'],
      'Osa 7': ['23.02.2017 16:00', '19.03.2017 21:59', 'osa07-'],
      'Osa 8': ['06.03.2017 22:00', '26.03.2017 21:59', 'osa08-'],
      'Osa 9': ['13.03.2017 18:00', '02.04.2017 21:59', 'osa09-'],
      'Osa 10': ['20.03.2017 18:00', '09.04.2017 21:59', 'osa10-'],
      'Osa 11': ['27.03.2017 20:00', '16.04.2017 21:59', 'osa11-'],
      'Osa 12': ['03.04.2017 22:00', '23.04.2017 21:59', 'osa12-'],
      'Osa 13': ['11.04.2017 10:00', '30.04.2017 21:59', 'osa13-'],
      'Osa 14': ['18.04.2017 10:00', '07.05.2017 21:59', 'osa14-']
    }
  };
}

function getConfig() {
  const courseName = getCourseName();

  switch(courseName) {
    case 'k2017-ohpe':
      return getHyConfig();
      break;
    case '2017-ohjelmointi':
      return getMoocConfig();
      break;
    case 'ohja-k2017':
      return getOhjaConfig();
      break;
    case 'hy-ohpe-ja-ohja-kesa2017':
      return getOhpeOhjaKesa17Config();
      break;
    default:
      return getMoocConfig();
  }
}

function init() {
  const courseName = getCourseName();

  if(courseName === '2017-ohjelmointi-nodl') {
    return;
  }

  const user = client.getUser();

  const config = Object.assign({}, getConfig(), { accessToken: user.accessToken, userId: user.username });

  window.StudentDashboard.initialize(config);
}

function initStudentDashboard() {
  if(!window._STUDENT_DASHBOARD_ENABLED) {
    return;
  }

  if(window.StudentDashboard) {
    init();
  } else {
    document.addEventListener('studentDashboardLoaded', init);
  }
}

export default initStudentDashboard;
