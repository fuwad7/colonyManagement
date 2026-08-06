(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .factory('AssetService', AssetService);

    AssetService.$inject = ['$http'];

    function AssetService($http) {
        var baseUrl = '/api/assets';

        var service = {
            getAllAssets: getAllAssets,
            getAssetById: getAssetById,
            getAssetsByType: getAssetsByType,
            saveAsset: saveAsset,
            updateAsset: updateAsset,
            deleteAsset: deleteAsset
        };

        return service;

        function getAllAssets() {
            return $http.get(baseUrl)
                .then(handleSuccess, handleError);
        }

        function getAssetById(id) {
            return $http.get(baseUrl + '/' + id)
                .then(handleSuccess, handleError);
        }

        function getAssetsByType(type) {
            return $http.get(baseUrl + '/type', { params: { type: type } })
                .then(handleSuccess, handleError);
        }

        function saveAsset(asset) {
            return $http.post(baseUrl, asset)
                .then(handleSuccess, handleError);
        }

        function updateAsset(id, asset) {
            return $http.put(baseUrl + '/' + id, asset)
                .then(handleSuccess, handleError);
        }

        function deleteAsset(id) {
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
