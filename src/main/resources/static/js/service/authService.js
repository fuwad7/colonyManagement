
(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', '$window'];

    function AuthService($http, $window) {
        var service = {
            login: login,
            register: register,
            saveSession: saveSession,
            logout: logout,
            isLoggedIn: isLoggedIn,
            getUser: getUser
        };

        return service;

        function login(credentials) {
            return $http.post('/api/auth/login', credentials)
                .then(function (response) {
                    return response.data;
                });
        }

        function register(user) {
            return $http.post('/api/auth/register', user)
                .then(function (response) {
                    return response.data;
                });
        }

        function saveSession(user) {
            $window.localStorage.setItem('user_session', JSON.stringify(user));
        }

        function logout() {
            $window.localStorage.removeItem('user_session');
        }

        function isLoggedIn() {
            return $window.localStorage.getItem('user_session') !== null;
        }

        function getUser() {
            var user = $window.localStorage.getItem('user_session');
            return user ? JSON.parse(user) : null;
        }
    }
})();
