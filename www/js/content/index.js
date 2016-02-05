angular.module('breezio.content', ['breezio.content.posts', 'breezio.content.users'])

.run(function($rootScope) {
  $rootScope.posts = {};
})

.controller('ContentCtrl', function($scope, $state, Posts) {
  $scope.start = 0;
  $scope.exhausted = false;
  $scope.posts = [];

  $scope.refreshPosts = function() {
    $scope.start = 0;
    Posts.get().then(function(res) {
      $scope.posts = res.data.items;
      $scope.exhausted = false;
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMore = function() {
    $scope.start += 20;
    Posts.get({start: $scope.start}).then(function(res) {
      $scope.posts = $scope.posts.concat(res.data.items);

      if (res.data.items.length < 1) {
        $scope.exhausted = true;
      }
    }).finally(function() {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.openPost = function(post) {
    $state.go('tab.content-post', {postId: post.id});
  };

  $scope.refreshPosts();
});