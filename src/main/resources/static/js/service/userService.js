(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];

    function UserService($http) {
        var baseUrl = '/api/users';

        var service = {
            saveUser: saveUser,
            getUserById: getUserById,
            getUserByEmail: getUserByEmail,
            getAllUsers: getAllUsers,
            updateUser: updateUser,
            deleteUser: deleteUser
        };

        return service;

        function saveUser(user) {
            return $http.post(baseUrl, user)
                .then(handleSuccess, handleError);
        }

        function getAllUsers() {
            return $http.get(baseUrl)
                .then(handleSuccess, handleError);
        }

        function getUserByEmail(email) {
            return $http.get(baseUrl + '/email/' + encodeURIComponent(email))
                .then(handleSuccess, handleError);
        }

        function getUserById(id) {
            return $http.get(baseUrl + '/' + id)
                .then(handleSuccess, handleError);
        }

        function updateUser(id, userDetails) {
            return $http.put(baseUrl + '/' + id, userDetails)
                .then(handleSuccess, handleError);
        }

        function deleteUser(id) {
            return $http.delete(baseUrl + '/' + id)
                .then(handleSuccess, handleError);
        }
        function handleSuccess(response) {
            return response.data;
        }
        function handleError(error) {
            return Promise.reject(error.data || error.message || 'Server Error');
        }
    }
})();
