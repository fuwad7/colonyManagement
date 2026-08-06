(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .controller('OccupancyController', OccupancyController);

    OccupancyController.$inject = ['OccupancyService'];

    function OccupancyController(OccupancyService) {
        var vm = this;

        vm.occupancies = [];
        vm.currentOccupancies = {};
        vm.error = null;
        vm.loading = false;

        vm.getOccupancies = getOccupancies;
        vm.getOccupancyById = getOccupancyById;
        vm.editOccupancy = editOccupancy;
        vm.saveOrUpdate = saveOrUpdate;
        vm.deleteOccupancy = deleteOccupancy;
        vm.clearForm = clearForm;

        activate();

        function activate() {
            getFlats();
        }

        function getFlats() {
            vm.loading = true;
            vm.error = null;

            FlatService.getAllFlats()
                .then(function (data) {
                    vm.flats = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getFlatsById(id) {
            vm.loading = true;
            vm.error = null;

            FlatService.getFLatsById(id)
                .then(function (data) {
                    vm.currentFlats = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function editFlats(flats) {
            getFlatsById(flats.id);
        }

        function saveOrUpdate() {
            vm.loading = true;
            vm.error = null;

            if (vm.currentFlats.id) {
                FlatService.updateFlat(vm.currentFlats.id, vm.currentFlats)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            } else {
                FlatService.createFlat(vm.currentFlats)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            }

            function handleWriteSuccess() {
                getFlats();
                clearForm();
            }

            function handleWriteError(err) {
                vm.error = err;
                vm.loading = false;
            }
        }
        function deleteFlat(id) {
            if (!confirm('You want to remove this Flat?')) {
                return;
            }
            vm.loading = true;
            FlatService.deleteFlats(id)
                .then(function () {
                    getFlats();
                })
                .catch(function (err) {
                    vm.error = err;
                    vm.loading = false;
                });
        }

        function clearForm() {
            vm.currentFlats = {};
        }
    }
})();
