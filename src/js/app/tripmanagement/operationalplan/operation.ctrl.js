

 appModule('app.mainPage').controller("operationController", function($scope,$state, $stateParams) {



     $scope.pdfName = 'Operations Manual';
     $scope.pdfUrl = 'Documents/pdf1.pdf';
     $scope.scroll = 1;
     $scope.loading = 'loading';

     $scope.getNavStyle = function(scroll) {
         if(scroll > 100) return 'pdf-controls fixed';
         else return 'pdf-controls';
     }

     $scope.onError = function(error) {
         console.log(error);
     }

     $scope.onLoad = function() {
         $scope.loading = '';
     }

     $scope.onProgress = function(progress) {
         console.log(progress);
     }






 });