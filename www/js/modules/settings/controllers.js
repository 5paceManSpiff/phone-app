angular.module('neo.settings.controllers', [])

    .controller('SettingsCtrl', function($scope, $rootScope, $q, Auth, ModalViews, User, ConversationHash) {
      $scope.loggedIn = $rootScope.loggedIn;
      $scope.currentUser = $rootScope.currentUser;
      $scope.showLogin = Auth.showLogin;
      $scope.logout = Auth.logout;

      $scope.chat = false;
      $rootScope.$watch('chatConnection.connected', function(val) {
        switch (val) {
          case true:
            $scope.connected = true;
            $scope.chat = $rootScope.chatConnection;
            break;
          case false:
          default:
            $scope.connected = false;
            $scope.chat = false;
            break;
        }
      });

      $scope.roster = [];
      $rootScope.$broadcast('chat:get-roster');
      $rootScope.$on('chat:on-roster', function(e, r) {
        var promises = [];
        angular.forEach(r, function(entry) {
          var promise = User.get({userId: entry.id});
          promises.push(promise.$promise);
        });

        $q.all(promises).then(function(data) {
          data.map(function(u) {
            r[u.id].user = u;
          });

          $scope.roster = r;
        });
      });

      $rootScope.$on('chat:presence', function(e, jid, status) {
        $scope.presence = $rootScope.presence;
      });

      $scope.available = false;
      $rootScope.$on('user:available', function() {
        $scope.available = true;
        $scope.$digest();
      });
      $rootScope.$on('user:away', function() {
        $scope.available = false;
        $scope.$digest();
      });

      $scope.showRegistration = function() {
        ModalViews.get('registration').show();
      };

      $scope.showUser = function(id) {
        $rootScope.userId = id;
        ModalViews.get('user').show();
      };
    })
    .controller('ProfileCtrl', function($scope, $rootScope, User) {
      $scope.refresh = function() {
        User.get({userId: $rootScope.currentUser.id}, function(user) {
          delete user.isFollowing;

          var config = {
            config: {
              digest: {
                default: {
                  digest: true,
                  group: false,
                  time: '+1 second',
                },
              },
              intro: {
                interventions: {
                  connect: 0,
                  content: 0,
                  invite: 0,
                  profile: 0,
                  share: 0,
                },
                startup: 0,
              },
            },
          };

          $scope.data = angular.extend(user, config);

          $scope.email = $rootScope.currentUser.email;
          $scope.updateProfile = function(data) {
            User.update({userId: $rootScope.currentUser.id}, data, function(ret) {
            });
          };
        });
      };

      $scope.refresh();
    });
