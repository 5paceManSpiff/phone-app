angular.module('breezio.content.video', [])

.controller('VideoCtrl', function($scope, $stateParams, Post) {
  $scope.post = {};
  $scope.loaded = false;

  $scope.refreshPost = function() {
    Post.get($stateParams.postId).then(function(res) {
      $scope.post = res.data;
      var tmp = new Date($scope.post.creationDate);
      $scope.post.dateString = tmp.getMonth() + '/' + tmp.getDay() + '/' + tmp.getFullYear();
    }).finally(function() {
      $scope.loaded = true;
    });
  };

  $scope.$on('$ionicView.loaded', function() {
    Post.getCached($stateParams.postId).success(function(val) {
      $scope.post = val;
      console.log($scope.post);
      var tmp = new Date($scope.post.creationDate);
      $scope.post.dateString = tmp.getMonth() + '/' + tmp.getDay() + '/' + tmp.getFullYear();
      $scope.loaded = true;
    });
  });
});
