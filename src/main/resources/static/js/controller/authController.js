
(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService', '$window'];

    function AuthController(AuthService, $window) {
        var vm = this;

        vm.loginData = {};
        vm.registerData = {};
        vm.errorMessage = '';
        vm.successMessage = '';

        vm.submitLogin = submitLogin;
        vm.submitRegistration = submitRegistration;

        function submitLogin() {
            vm.errorMessage = '';
            AuthService.login(vm.loginData)
                .then(function (data) {
                    AuthService.saveSession(data);
                    $window.location.href = 'index.html';
                })
                .catch(function (error) {
                    vm.errorMessage = 'Login failed: ' + (error.data || 'Invalid Credentials');
                });
        }

        function submitRegistration() {
            vm.errorMessage = '';
            vm.successMessage = '';
            AuthService.register(vm.registerData)
                .then(function (data) {
                    vm.successMessage = 'Registration complete! You can log in now.';
                    vm.registerData = {};
                })
                .catch(function (error) {
                    vm.errorMessage = 'Registration failed: ' + (error.data || 'Try again.');
                });
        }
    }
})();
