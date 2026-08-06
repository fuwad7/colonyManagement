(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .factory('PersonService', PersonService);

    PersonService.$inject = ['$http'];

    function PersonService($http) {
        var baseUrl = '/api/persons';

        var service = {
            createPerson: createPerson,
            getAllPerson: getAllPerson,
            getPersonById: getPersonById,
            updatePerson: updatePerson,
            deletePerson: deletePerson
        };

        return service;

        function createPerson(person) {
            return $http.post(baseUrl, person)
                .then(handleSuccess, handleError);
        }

        function getAllPerson() {
            return $http.get(baseUrl)
                .then(handleSuccess, handleError);
        }

        function getPersonById(id) {
            return $http.get(baseUrl + '/' + id)
                .then(handleSuccess, handleError);
        }

        function updatePerson(id, personDetails) {
            return $http.put(baseUrl + '/' + id, personDetails)
                .then(handleSuccess, handleError);
        }

        function deletePerson(id) {
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
