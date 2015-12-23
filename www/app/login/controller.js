(function() {
  'use strict';

  angular
    .module('musicHack.login')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['AuthService', '$state', '$ionicPopup', '$localStorage'];

  /* @ngInject */
  function LoginCtrl(AuthService, $state, $ionicPopup, $localStorage) {
    var vm = this;

    vm.user = {};

    vm.authenticate = authenticate;

    function authenticate() {
      AuthService.authWithPassword(vm.user)
        .then(handleAuthSuccess)
        .catch(handleAuthError);
    }

    function handleAuthSuccess(authData) {
      saveAuthData(authData);
      $ionicPopup.alert({
        title: 'Welcome',
        template: 'Logged In as ' + authData.password.email
      });
      vm.user = {};
      $state.go('side.home');
    }

    function saveAuthData(authData) {
      $localStorage['uid'] = authData.uid;
      $localStorage['provider'] = authData.provider;
      $localStorage['access_token'] = authData.token;
      $localStorage['email'] = authData.password.email;
      $localStorage['profileImageURL'] = authData.password.profileImageURL;
    }

    function handleAuthError(error) {
      $ionicPopup.alert({
        title: 'Authentication error',
        template: error
      });
    }
  }
})();
