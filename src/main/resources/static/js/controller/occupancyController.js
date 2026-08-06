(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .controller('OccupancyController', OccupancyController);

    OccupancyController.$inject = ['OccupancyService'];

    function OccupancyController(OccupancyService) {
        var viewModel = this;

        viewModel.occupancies = [];
        viewModel.currentOccupancy = null;
        viewModel.errorMessage = '';
        viewModel.successMessage = '';
        viewModel.newOccupancyData = {};

        viewModel.searchPersonId = '';
        viewModel.searchType = '';

        viewModel.loadAllOccupancy = loadAllOccupancy;
        viewModel.getOccupancyById = getOccupancyById;
        viewModel.getOccupancyByPerson = getOccupancyByPerson;
        viewModel.getOccupancyByType = getOccupancyByType;
        viewModel.saveOccupancies = saveOccupancy;
        viewModel.selectOccupancyForEdit = selectOccupancyForEdit;
        viewModel.removeOccupancy = removeOccupancy;
        viewModel.resetFilters = resetFilters;

        activate();

        function activate() {
            loadAllOccupancy();
        }

        function loadAllOccupancy() {
            clearMessages();
            OccupancyService.getAllOccupancy()
                .then(function (data) {
                    viewModel.occupancies = data;
                })
                .catch(function (error) {
                    viewModel.errorMessage = 'Occupancies could not load: ' + error;
                });
        }

        function getOccupancyById(id) {
            clearMessages();
            OccupancyService.getOccupancyById(id)
                .then(function (data) {
                    viewModel.newOccupancyData = data;
                })
                .catch(handleError);
        }

        function getOccupancyByPerson() {
            if (!viewModel.searchPersonId) {
                return loadAllOccupancy();
            }
            clearMessages();
            viewModel.searchType = '';

            OccupancyService.getOccupancyByPerson(viewModel.searchPersonId)
                .then(function (data) {
                    viewModel.occupancies = data;
                })
                .catch(handleError);
        }

        function getOccupancyByType() {
            if (!viewModel.searchType) {
                return loadAllOccupancy();
            }
            clearMessages();
            viewModel.searchPersonId = '';

            OccupancyService.getOccupancyByType(viewModel.searchType)
                .then(function (data) {
                    viewModel.occupancies = data;
                })
                .catch(handleError);
        }

        function saveOccupancy() {
            clearMessages();

            if (viewModel.newOccupancyData.id) {
                OccupancyService.updateOccupancy(viewModel.newOccupancyData.id, viewModel.newOccupancyData)
                    .then(function (data) {
                        viewModel.successMessage = 'Occupancy updated successfully!';
                        resetForm();
                        loadAllOccupancy();
                    })
                    .catch(handleError);
            } else {
                OccupancyService.createOccupancy(viewModel.newOccupancyData)
                    .then(function (data) {
                        viewModel.successMessage = 'Occupancy created successfully!';
                        resetForm();
                        loadAllOccupancy();
                    })
                    .catch(handleError);
            }
        }

        function selectOccupancyForEdit(occupancy) {
            getOccupancyById(occupancy.id);
        }

        function removeOccupancy(id) {
            if (confirm('You want to delete this Occupancy?')) {
                clearMessages();
                OccupancyService.deleteOccupancy(id)
                    .then(function () {
                        viewModel.successMessage = 'Occupancy deleted successfully.';
                        loadAllOccupancy();
                    })
                    .catch(handleError);
            }
        }

        function resetForm() {
            viewModel.newOccupancyData = {};
        }

        function resetFilters() {
            viewModel.searchPersonId = '';
            viewModel.searchType = '';
            loadAllOccupancy();
        }

        function clearMessages() {
            viewModel.errorMessage = '';
            viewModel.successMessage = '';
        }

        function handleError(error) {
            viewModel.errorMessage = 'Operation failed: ' + error;
        }
    }
})();
