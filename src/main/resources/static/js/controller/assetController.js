(function () {
    'use strict';
    angular
        .module('colonyManagementApp')
        .controller('AssetController', AssetController);

    AssetController.$inject = ['AssetService'];

    function AssetController(AssetService) {
        var vm = this;
        vm.assets = [];
        vm.currentAsset = {};
        vm.searchType = '';
        vm.error = null;
        vm.loading = false;

        vm.getAssets = getAssets;
        vm.getAssetsByType = getAssetsByType;
        vm.getAssetById = getAssetById;
        vm.editAsset = editAsset;
        vm.saveOrUpdate = saveOrUpdate;
        vm.deleteAsset = deleteAsset;
        vm.clearForm = clearForm;

        activate();

        function activate() {
            getAssets();
        }

        function getAssets() {
            vm.loading = true;
            vm.error = null;

            AssetService.getAllAssets()
                .then(function (data) {
                    vm.assets = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getAssetsByType() {
            if (!vm.searchType) {
                return getAssets();
            }

            vm.loading = true;
            AssetService.getAssetsByType(vm.searchType)
                .then(function (data) {
                    vm.assets = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getAssetById(id) {
            vm.loading = true;
            vm.error = null;

            AssetService.getAssetById(id)
                .then(function (data) {
                    vm.currentAsset = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function editAsset(asset) {
            getAssetById(asset.id);
        }

        function saveOrUpdate(){
            vm.loading = true;
            vm.error = null;

            var payload = angular.copy(vm.currentAsset);
            if (!payload.id) {
                delete payload.id;
            }

            if (vm.currentAsset.id) {
                AssetService.updateAsset(vm.currentAsset.id, payload)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            } else {
                AssetService.saveAsset(payload)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            }

            function handleWriteSuccess() {
                getAssets();
                clearForm();
            }

            function handleWriteError(err) {
                vm.error = err;
                vm.loading = false;
            }
        }

        function deleteAsset(id) {
            if (!confirm('You want to remove this asset?')) {
                return;
            }

            vm.loading = true;
            AssetService.deleteAsset(id)
                .then(function () {
                    getAssets();
                })
                .catch(function (err) {
                    vm.error = err;
                    vm.loading = false;
                });
        }
        function clearForm() {
            vm.currentAsset = {};
        }
    }
})();
