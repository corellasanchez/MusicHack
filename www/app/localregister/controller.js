(function() {
  'use strict';

  angular
    .module('musicHack.localregister')
    .controller('LocalRegisterCtrl', LocalRegisterCtrl);

  LocalRegisterCtrl.$inject = ['RegistrationServicelocalOwner', '$ionicPopup', 'AuthService', '$localStorage', '$state'];

  /* @ngInject */
  function LocalRegisterCtrl(RegistrationServicelocalOwner, $ionicPopup, AuthService, $localStorage, $state) {

    var vm = this;
    vm.localOwner = {
      uid: {},
      credentials:{},
      info:{}
    };

    vm.createOwnerAccount = createOwnerAccount;

    vm.isPasswordWeak = isPasswordWeak;
    vm.isPasswordMed = isPasswordMed;
    vm.isPasswordStrong = isPasswordStrong;

    function createOwnerAccount() {
      RegistrationServicelocalOwner.createUser(vm.localOwner.credentials)
        .then(handleCreationSuccess)
        .catch(handleError);
    }

    function handleCreationSuccess() {
      AuthService.authWithPassword(vm.localOwner.credentials)
        .then(handleAuthSuccess)
        .catch(handleError);
    }

    function handleAuthSuccess(authData) {
      saveAuthData(authData);

      vm.localOwner.uid = authData.uid;
      handleAdditionalOwerLocalInfo();

      $ionicPopup.alert({
        title: 'Bienvenido',
        template: 'Has ingresado como: ' + authData.password.email
      });
      vm.localOwner = {};
      vm.passwordConfirm = null;
      $state.go('menu.home');
    }

    function saveAuthData(authData) {
      $localStorage['uid'] = authData.uid;
      $localStorage['provider'] = authData.provider;
      $localStorage['access_token'] = authData.token;
      $localStorage['email'] = authData.password.email;
      $localStorage['profileImageURL'] = authData.password.profileImageURL;
    }

    function handleAdditionalOwerLocalInfo() {
      vm.localOwner.info.email = vm.localOwner.credentials.email;
      RegistrationServicelocalOwner.createOwnerAdditionalInfo(vm.localOwner)
        .catch(handleError);
    }

    function handleError(error) {
      $ionicPopup.alert({
        title: 'Error',
        template: error
      });
    }

    function isPasswordWeak() {
      return vm.passwordStrength < 20;
    }

    function isPasswordMed() {
      return vm.passwordStrength > 19 && vm.passwordStrength < 50;
    }

    function isPasswordStrong() {
      return vm.passwordStrength > 49;
    }

  }
})()