(function () {
    'use strict';

    angular
        .module('colonyManagementApp')
        .controller('AssetAssignmentController', AssetAssignmentController);

    AssetAssignmentController.$inject = ['AssetAssignmentService'];

    function AssetAssignmentController(AssetAssignmentService) {
        var viewModel = this;

        viewModel.assignments = [];
        viewModel.currentAssignment = null;
        viewModel.errorMessage = '';
        viewModel.successMessage = '';
        viewModel.newAssignmentData = {};

        viewModel.searchPersonId = '';
        viewModel.searchAssetId = '';

        viewModel.loadAllAssignments = loadAllAssignments;
        viewModel.getAssignmentById = getAssignmentById;
        viewModel.getAssignmentsByPerson = getAssignmentsByPerson;
        viewModel.getAssignmentsByAsset = getAssignmentsByAsset;
        viewModel.saveAssignment = saveAssignment;
        viewModel.selectAssignmentForEdit = selectAssignmentForEdit;
        viewModel.removeAssignment = removeAssignment;
        viewModel.resetFilters = resetFilters;

        activate();

        function activate() {
            loadAllAssignments();
        }

        function loadAllAssignments() {
            clearMessages();
            AssetAssignmentService.getAllAssignments()
                .then(function (data) {
                    viewModel.assignments = data;
                })
                .catch(function (error) {
                    viewModel.errorMessage = 'Assignments could not load: ' + error;
                });
        }

        function getAssignmentById(id) {
            clearMessages();
            AssetAssignmentService.getAssignmentById(id)
                .then(function (data) {
                    viewModel.newAssignmentData = data;
                })
                .catch(handleError);
        }

        function getAssignmentsByPerson() {
            if (!viewModel.searchPersonId) {
                return loadAllAssignments();
            }
            clearMessages();
            viewModel.searchAssetId = '';

            AssetAssignmentService.getAssignmentsByPerson(viewModel.searchPersonId)
                .then(function (data) {
                    viewModel.assignments = data;
                })
                .catch(handleError);
        }

        function getAssignmentsByAsset() {
            if (!viewModel.searchAssetId) {
                return loadAllAssignments();
            }
            clearMessages();
            viewModel.searchPersonId = '';

            AssetAssignmentService.getAssignmentsByAsset(viewModel.searchAssetId)
                .then(function (data) {
                    viewModel.assignments = data;
                })
                .catch(handleError);
        }

        function saveAssignment() {
            clearMessages();

            if (viewModel.newAssignmentData.id) {
                AssetAssignmentService.updateAssignment(viewModel.newAssignmentData.id, viewModel.newAssignmentData)
                    .then(function (data) {
                        viewModel.successMessage = 'Assignment updated successfully!';
                        resetForm();
                        loadAllAssignments();
                    })
                    .catch(handleError);
            } else {
                AssetAssignmentService.createAssignment(viewModel.newAssignmentData)
                    .then(function (data) {
                        viewModel.successMessage = 'Assignment created successfully!';
                        resetForm();
                        loadAllAssignments();
                    })
                    .catch(handleError);
            }
        }

        function selectAssignmentForEdit(assignment) {
            getAssignmentById(assignment.id);
        }

        function removeAssignment(id) {
            if (confirm('You want to delete this assignment?')) {
                clearMessages();
                AssetAssignmentService.deleteAssignment(id)
                    .then(function () {
                        viewModel.successMessage = 'Assignment deleted successfully.';
                        loadAllAssignments();
                    })
                    .catch(handleError);
            }
        }

        function resetForm() {
            viewModel.newAssignmentData = {};
        }

        function resetFilters() {
            viewModel.searchPersonId = '';
            viewModel.searchAssetId = '';
            loadAllAssignments();
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
