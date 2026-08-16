(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .controller('UserController', UserController);

    UserController.$inject = ['UserService'];

    function UserController(UserService) {
        var vm = this;

        vm.users = [];
        vm.currentUsers = {};
        vm.error = null;
        vm.loading = false;
        vm.searchEmail = '';

        vm.getUsers = getUsers;
        vm.getUserById = getUserById;
        vm.getUserByEmail = getUserByEmail;
        vm.editUser = editUser;
        vm.saveOrUpdate = saveOrUpdate;
        vm.deleteUser = deleteUser;
        vm.clearForm = clearForm;

        activate();

        function activate() {
            getUsers();
        }

        function getUsers() {
            vm.loading = true;
            vm.error = null;

            UserService.getAllUsers()
                .then(function (data) {
                    vm.users = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getUserById(id) {
            vm.loading = true;
            vm.error = null;

            UserService.getUserById(id)
                .then(function (data) {
                    vm.currentUsers = data;
                })
                .catch(function (err) {
                    vm.error = err;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function getUserByEmail() {
            if (!vm.searchEmail) {
                return getUsers();
            }
            vm.loading = true;
            vm.error = null;

            UserService.getUserByEmail(vm.searchEmail)
                .then(function (data) {
                    vm.users = angular.isArray(data) ? data : [data];
                })
                .catch(function (err) {
                    vm.error = err;
                    vm.users = [];
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function editUser(user) {
            getUserById(user.id);
        }

        function saveOrUpdate() {
            vm.loading = true;
            vm.error = null;

            var payload = angular.copy(vm.currentUsers);
            if (!payload.id) {
                delete payload.id;
            }

            if (vm.currentUsers.id) {
                UserService.updateUser(vm.currentUsers.id, payload)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            } else {
                UserService.saveUser(payload)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            }

            function handleWriteSuccess() {
                getUsers();
                clearForm();
            }

            function handleWriteError(err) {
                vm.error = err;
                vm.loading = false;
            }
        }
        function deleteUser(id) {
            if (!confirm('You want to remove this User?')) {
                return;
            }
            vm.loading = true;
            UserService.deleteUser(id)
                .then(function () {
                    getUsers();
                })
                .catch(function (err) {
                    vm.error = err;
                    vm.loading = false;
                });
        }

        function clearForm() {
            vm.currentUsers = {};
            vm.searchEmail = '';
        }
    }
})();
