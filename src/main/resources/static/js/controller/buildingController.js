(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .controller('BuildingController', BuildingController);

    BuildingController.$inject = ['BuildingService'];

    function BuildingController(BuildingService) {
        var vm = this;

        vm.buildings = [];
        vm.currentBuilding = {};
        vm.error = null;
        vm.loading = false;

        vm.getBuildings = getBuildings;
        vm.getBuildingById = getBuildingById;
        vm.editBuilding = editBuilding;
        vm.saveOrUpdate = saveOrUpdate;
        vm.deleteBuilding = deleteBuilding;
        vm.clearForm = clearForm;

        activate();

        function activate() {
            getBuildings();
        }

        function getBuildings() {
            vm.loading = true;
            vm.error = null;

            BuildingService.getAllBuildings()
                .then(function (data) {
                    vm.buildings = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getBuildingById(id) {
            vm.loading = true;
            vm.error = null;

            BuildingService.getBuildingById(id)
                .then(function (data) {
                    vm.currentBuilding = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function editBuilding(building) {
            getBuildingById(building.id);
        }

        function saveOrUpdate() {
            vm.loading = true;
            vm.error = null;

            var payload = angular.copy(vm.currentBuilding);
            if (!payload.id) {
                delete payload.id;
            }

            if (vm.currentBuilding.id) {
                BuildingService.updateBuilding(vm.currentBuilding.id, payload)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            } else {
                BuildingService.createBuilding(payload)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            }

            function handleWriteSuccess() {
                getBuildings();
                clearForm();
            }

            function handleWriteError(err) {
                vm.error = err;
                vm.loading = false;
            }
        }
        function deleteBuilding(id) {
            if (!confirm('You want to remove this building?')) {
                return;
            }
            vm.loading = true;
            BuildingService.deleteBuilding(id)
                .then(function () {
                    getBuildings();
                })
                .catch(function (err) {
                    vm.error = err;
                    vm.loading = false;
                });
        }

        function clearForm() {
            vm.currentBuilding = {};
        }
    }
})();
