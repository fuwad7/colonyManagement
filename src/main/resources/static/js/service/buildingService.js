(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .factory('BuildingService', BuildingService);

    BuildingService.$inject = ['$http'];

    function BuildingService($http) {
        var baseUrl = '/api/buildings';

        var service = {
            createBuilding: createBuilding,
            getAllBuildings: getAllBuildings,
            getBuildingById: getBuildingById,
            updateBuilding: updateBuilding,
            deleteBuilding: deleteBuilding
        };

        return service;

        function createBuilding(building) {
            return $http.post(baseUrl, building)
                .then(handleSuccess, handleError);
        }

        function getAllBuildings() {
            return $http.get(baseUrl)
                .then(handleSuccess, handleError);
        }

        function getBuildingById(id) {
            return $http.get(baseUrl + '/' + id)
                .then(handleSuccess, handleError);
        }

        function updateBuilding(id, buildingDetails) {
            return $http.put(baseUrl + '/' + id, buildingDetails)
                .then(handleSuccess, handleError);
        }

        function deleteBuilding(id) {
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
