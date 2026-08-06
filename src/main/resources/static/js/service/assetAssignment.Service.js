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
            updateAssignment: updateAssignment,
            deleteAssignment: deleteAssignment
        };

        return service;

        function createAssignment(assetAssignment) {
            return $http.post(baseUrl, assetAssignment)
                .then(handleSuccess, handleError);
        }

        function getAllAssignments() {
            return $http.get(baseUrl)
                .then(handleSuccess, handleError);
        }

        function getAssignmentById(id) {
            return $http.get(baseUrl + '/' + id)
                .then(handleSuccess, handleError);
        }
        function getAssignmentsByPerson(personId) {
            return $http.get(baseUrl + '/person/' + personId)
                .then(handleSuccess, handleError);
        }
        function getAssignmentsByAsset(assetId) {
            return $http.get(baseUrl + '/asset/' + assetId)
                .then(handleSuccess, handleError);
        }
        function updateAssignment(id, assetAssignmentDetails) {
            return $http.put(baseUrl + '/' + id, assetAssignmentDetails)
                .then(handleSuccess, handleError);
        }

        function deleteAssignment(id) {
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
