(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .factory('FlatService', FlatService);

    FlatService.$inject = ['$http'];

    function FlatService($http) {
        var baseUrl = '/api/flats';

        var service = {
            createFlat: createFlat,
            getAllFlats: getAllFlats,
            getFlatById: getFlatById,
            updateFlat: updateFlat,
            deleteFlat: deleteFlat
        };

        return service;

        function createFlat(flat) {
            return $http.post(baseUrl, flat)
                .then(handleSuccess, handleError);
        }

        function getAllFlats() {
            return $http.get(baseUrl)
                .then(handleSuccess, handleError);
        }

        function getFlatById(id) {
            return $http.get(baseUrl + '/' + id)
                .then(handleSuccess, handleError);
        }

        function updateFlat(id, flatDetails) {
            return $http.put(baseUrl + '/' + id, flatDetails)
                .then(handleSuccess, handleError);
        }

        function deleteFlat(id) {
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
