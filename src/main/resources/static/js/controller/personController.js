(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .controller('PersonController', PersonController);

    PersonController.$inject = ['PersonService'];

    function PersonController(PersonService) {
        var vm = this;

        vm.persons = [];
        vm.currentPerson = {};
        vm.error = null;
        vm.loading = false;

        vm.getPersons = getPersons;
        vm.getPersonById = getPersonById;
        vm.editPerson = editPerson;
        vm.saveOrUpdate = saveOrUpdate;
        vm.deletePerson = deletePerson;
        vm.clearForm = clearForm;

        activate();

        function activate() {
            getPersons();
        }

        function getPersons() {
            vm.loading = true;
            vm.error = null;

            PersonService.getAllPerson()
                .then(function (data) {
                    vm.persons = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getPersonById(id) {
            vm.loading = true;
            vm.error = null;

            PersonService.getPersonById(id)
                .then(function (data) {
                    vm.currentPerson = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function editPerson(person) {
            getPersonById(person.id);
        }

        function saveOrUpdate() {
            vm.loading = true;
            vm.error = null;

            if (vm.currentPerson.id) {
                PersonService.updatePerson(vm.currentPerson.id, vm.currentPerson)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            } else {
                PersonService.createPerson(vm.currentPerson)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            }

            function handleWriteSuccess() {
                getPersons();
                clearForm();
            }

            function handleWriteError(err) {
                vm.error = err;
                vm.loading = false;
            }
        }
        function deletePerson(id) {
            if (!confirm('You want to remove this Person?')) {
                return;
            }
            vm.loading = true;
            PersonService.deletePerson(id)
                .then(function () {
                    getPersons();
                })
                .catch(function (err) {
                    vm.error = err;
                    vm.loading = false;
                });
        }

        function clearForm() {
            vm.currentPerson = {};
        }
    }
})();
