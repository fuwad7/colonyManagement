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

        vm.getUsers = getUsers;
        vm.getUserById = getUserById;
        vm.editUser = editUser;
        vm.getUserByEmail = getUserByEmail;
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

        function editUser(user) {
            getUserById(user.id);
        }

        function saveOrUpdate() {
            vm.loading = true;
            vm.error = null;

            if (vm.currentUsers.id) {
                UserService.updateUser(vm.currentUsers.id, vm.currentUsers)
                    .then(handleWriteSuccess)
                    .catch(handleWriteError);
            } else {
                UserService.saveUser(vm.currentUsers)
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
        }
    }
})();
