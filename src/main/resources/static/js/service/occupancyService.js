(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .factory('OccupancyService', OccupancyService);

    OccupancyService.$inject = ['$http'];

    function OccupancyService($http) {
        var baseUrl = '/api/occupancies';

        var service = {
            createOccupancy: createOccupancy,
            getAllOccupancy: getAllOccupancy,
            getOccupancyById: getOccupancyById,
            getOccupancyByPerson: getOccupancyByPerson,
            getOccupancyByType: getOccupancyByType,
            updateOccupancy: updateOccupancy,
            deleteOccupancy: deleteOccupancy
        };

        return service;

        function createOccupancy(occupancy) {
            return $http.post(baseUrl, occupancy)
                .then(handleSuccess, handleError);
        }

        function getAllOccupancy() {
            return $http.get(baseUrl)
                .then(handleSuccess, handleError);
        }

        function getOccupancyById(id) {
            return $http.get(baseUrl + '/' + id)
                .then(handleSuccess, handleError);
        }
        function getOccupancyByPerson(personId) {
            return $http.get(baseUrl + '/person/' + (personId))
                .then(handleSuccess, handleError);
        }
        function getOccupancyByType(type) {
            return $http.get(baseUrl + '/type/' + (type))
                .then(handleSuccess, handleError);
        }
        function updateOccupancy(id, occupancyDetails) {
            return $http.put(baseUrl + '/' + id, occupancyDetails)
                .then(handleSuccess, handleError);
        }

        function deleteOccupancy(id) {
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
