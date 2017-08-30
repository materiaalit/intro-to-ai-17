import TmcClient from 'tmc-client-js';
import * as store from 'store';

import initQuiznator from './quiznator';
import initStudentDashboard from './student-dashboard';
import pheromones from './pheromones';
import jsLogger from './js-logger';

const client = new TmcClient();

class LoginModal {
  mount() {
    this.loginErrorNode = $('#tmc-login-error');
    this.loginFormNode = $('#tmc-login-form');
    this.loginModalToggleNode = $('#tmc-login-toggle');
    this.loginModalNode = $('#tmc-login-modal');
    this.loginUsernameNode = $('#tmc-login-username');
    this.loginPasswordNode = $('#tmc-login-password');

    this.updateLoginButtonText();

    if(client.getUser()) {
      this.afterLogin();
    } else if(window.location.pathname !== '/' && window.location.pathname !== '/intro-to-ai-17/') {
      this.loginModalNode.modal('show');
    }

    this.loginModalToggleNode.on('click', this.onToggleLoginModal.bind(this));
    this.loginFormNode.on('submit', this.onSubmitLoginForm.bind(this));
  }

  afterLogin() {
    initQuiznator();
    initStudentDashboard();

    this.initPheromones();
    this.initLogger();
  }

  initPheromones(){
    const { username } = client.getUser();

    pheromones.init({
      apiUrl: 'https://data.pheromones.io/',
      username,
      submitAfter: 20
    });
  }

  initLogger() {
    const { username } = client.getUser();

    jsLogger.setUser(username);
    jsLogger.setApiUrl('https://data.pheromones.io/');
    jsLogger.init();
  }

  getLoginText() {
    return 'Log in';
  }

  getLogOutText({ username }) {
    return `Log out ${username}`;
  }

  showError(message) {
    this.loginErrorNode.text(message);
    this.loginErrorNode.show();
  }

  hideError() {
    this.loginErrorNode.hide();
  }

  updateLoginButtonText() {
    if(client.getUser()) {
      this.loginModalToggleNode.text(this.getLogOutText({ username: client.getUser().username }));
    } else {
      this.loginModalToggleNode.text(this.getLoginText());
    }
  }

  onToggleLoginModal(e) {
    e.preventDefault();

    if(client.getUser()) {
      client.unauthenticate();

      try {
        window.StudentDashboard.destroy();
        window.Quiznator.removeUser();
      } catch(e) {}
    } else {
      this.loginModalNode.modal('show');
    }

    this.updateLoginButtonText();
  }

  onSubmitLoginForm(e) {
    e.preventDefault();

    this.hideError();

    const username = this.loginUsernameNode.val();
    const password = this.loginPasswordNode.val();
    const courseNode = this.loginFormNode.find('input[name="tmcLoginCourse"]:checked');

    if(courseNode.length === 0) {
      this.showError('You did not select a course.');
    } else if(!username || !password) {
      this.showError('Username or password missing');
    } else {
      const course = courseNode.val();

      store.set('tmc.course', course);

      client.authenticate({ username: username, password: password })
        .then(response => {
          this.loginModalNode.modal('hide');
          this.loginUsernameNode.val('');
          this.loginPasswordNode.val('');

          this.updateLoginButtonText();
          this.afterLogin();
        })
        .catch(() => {
          if(username.indexOf('@') > 0) {
            this.showError("Username or password was incorrect. Please remember that you're supposed to login with your username, NOT your email.")
          } else {
            this.showError('Username or password was incorrect');
          }
        });
    }
  }
}

export default LoginModal;
