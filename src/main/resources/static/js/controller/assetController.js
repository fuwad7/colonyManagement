(function (){
    'use strict';
    angular
    .module('colonyManagementApp')
        .controller('AssetController',)
    AssetController.$inject = ['AssetService'];
    function AssetController(AssetService) {
        var vm = this;
        vm.assets = [];
        vm.curentAssets = {};
        vm.selectedType = '';
        vm.errorMessage = '';
        vm.isLoading = false;

        vm.loadAllAssets = function loadAllAssets;
        vm.loadAssetsByType = function loadAssetsByType;
        vm.selectAssetForEdit = function selectAssetForEdit;
        vm.saveOrUpdateAsset = function saveOrUpdateAsset;
        vm.deleteAsset = function deleteAsset;
        vm.resetForm = function resetForm;




    }
}