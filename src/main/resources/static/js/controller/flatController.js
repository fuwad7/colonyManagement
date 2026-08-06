(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .controller('FlatController', FlatController);

    FlatController.$inject = ['FlatService'];

    function FlatController(FlatService) {
        var vm = this;

        vm.flats = [];
        vm.currentFlats = {};
        vm.error = null;
        vm.loading = false;

        vm.getFlats = getFlats;
        vm.getFLatsById = getFlatsById;
        vm.editFlats = editFlats;
        vm.saveOrUpdate = saveOrUpdate;
        vm.deleteFlat = deleteFlat;
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
