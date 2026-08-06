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

        viewModel.loadAllAssignments = loadAllAssignments;
        viewModel.saveAssignment = saveAssignment;
        viewModel.selectAssignmentForEdit = selectAssignmentForEdit;
        viewModel.removeAssignment = removeAssignment;

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
            viewModel.newAssignmentData = angular.copy(assignment);
        }
        function removeAssignment(id) {
            if (confirm('Are you sure you want to delete this assignment?')) {
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

        function clearMessages() {
            viewModel.errorMessage = '';
            viewModel.successMessage = '';
        }

        function handleError(error) {
            viewModel.errorMessage = 'Operation failed: ' + error;
        }
    }
})();
