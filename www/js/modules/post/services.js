angular.module('neo.post.services', [])

    .factory('Posts', function(Resource) {
      return Resource('/posts/:postId/:data');
    })
    .factory('Experts', function(Resource) {
      return Resource('/posts/:postId/users/expert/:data');
    })
    .factory('Notes', function(Resource) {
      return Resource('/posts/:postId/notes');
    });
