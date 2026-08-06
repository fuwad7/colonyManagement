(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .factory('AssetAssignmentService', AssetAssignmentService);

    AssetAssignmentService.$inject = ['$http'];

    function AssetAssignmentService($http) {
        var baseUrl = '/api/asset-Assignment';

        var service = {
            createAssignment: createAssignment,
            getAllAssignments: getAllAssignments,
            getAssignmentById: getAssignmentById,
            getAssignmentsByPerson: getAssignmentsByPerson,
            getAssignmentsByAsset: getAssignmentsByAsset,
            deleteAssignment: deleteAssignment
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
