(function (){
    'use strict';
    angular
        .module('colonyManagementApp')
        .controller('BuildingController',)
    BuildingController.$inject = ['BuildingController'];
    function BuildingController(BuildingService) {
        var vm = this;
        vm.buildings = [];
        vm.currentBuildings = {};
        vm.searchBuildings = '';
        vm.error = null;
        vm.loading = false;

        vm.getBuildings = getBuildings;
        vm.getBuildingById = getBuildingsByid;
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

        function editAsset(asset) {
            vm.currentAsset = angular.copy(asset);
        }

        function saveOrUpdate() {
            vm.loading = true;
            vm.error = null;

            if (vm.currentAsset.id) {
                AssetService.updateAsset(vm.currentAsset.id, vm.currentAsset)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            } else {
                AssetService.saveAsset(vm.currentAsset)
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
