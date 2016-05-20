angular.module('breezio.content.video', [])

.directive('breezioVideo', function() {
  return {
    restrict: 'E',
    template: '<video id="video-content" autoplay controls class="video-content video-js vjs-default-skin"></video>',
    link: function(scope, element, attr) {
      attr.$observe('url', function(val) {
        if (val != '') {
          var player = videojs('video-content', {
            techOrder: ['youtube'],
            sources: [{
              type: 'video/youtube',
              src: val
            }]
          }, function() {

          });
        }
      });
    }
  };
})

.controller('VideoCtrl', function($scope, $stateParams, Post) {
  $scope.post = {};
  $scope.loaded = false;

  $scope.subtitleExists = function() {
    if ($scope.post.subtitle && $scope.post.subtitle.length > 0) {
      return true;
    }

    return false;
  };

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
