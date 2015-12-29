angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, fireBaseData, $firebase) {
    //Obtenemos la lista de gastos registrado en firebase
    $scope.expenses = $firebase(fireBaseData.refExpenses()).$asArray();
    $scope.user = fireBaseData.ref().getAuth();
    
    $scope.addExpense = function(e) {
        $scope.expenses.$add({
            by: $scope.user.password.email,
            label: $scope.label,
            cost: $scope.cost
        });
        $scope.label = "";
        $scope.cost = 0;
    };

    $scope.getTotal = function() {
        var rtnTotal = 0;
        for (var i = 0; i < $scope.expenses.length; i++) {
            rtnTotal += $scope.expenses[i].cost;
        }
        return rtnTotal;
    };
})

.controller('FriendsCtrl', function($scope, fireBaseData, $firebase) {
  $scope.user = fireBaseData.ref().getAuth();

  //Obtenemos la lista de gastos registrado en firebase
  $scope.expenses = $firebase(fireBaseData.refExpenses()).$asArray();
  
  //Obtenemos la lista de amigos de firebase
  $scope.roomies = $firebase(fireBaseData.refRoomMates()).$asArray();

  //Iteramos sobre cada amigo para obtener los emails de cada uno
  $scope.roomies.$loaded().then(function(array) {
     var i;
      //array = [[set1_rm1_email, set1_rm2_email], [set2_rm1_email, set2_rm2_email] ...]
      for (i = 0; i < array.length; i = i + 1) {
         if (array[i][0] === $scope.user.password.email) {
             $scope.roomiesEmail = array[i][1];
         } else if (array[i][1] === $scope.user.password.email) {
             $scope.roomiesEmail = array[i][0];
         }
      }
      $scope.$apply();
      //Yes this whole app, front-end to backend is built only for two room-mates situation
  });
  $scope.addExpense = function(e) {
      $scope.expenses.$add({
          by: $scope.roomiesEmail,
          label: $scope.label,
          cost: $scope.cost
      });
      $scope.label = "";
      $scope.cost = 0;
  };
  $scope.getTotal = function () {
      var i, rtnTotal = 0;
      for (i = 0; i < $scope.expenses.length; i = i + 1) {
          rtnTotal = rtnTotal + $scope.expenses[i].cost;
      }
      return rtnTotal;
  };
})

.controller('AccountCtrl', function($scope, fireBaseData) {
  $scope.showLoginForm = false; //Checking if user is logged in
  $scope.user = fireBaseData.ref().getAuth();
  if (!$scope.user) {
      $scope.showLoginForm = true;
  }
  //Login method
  $scope.login = function (em, pwd) {
      fireBaseData.ref().authWithPassword({
          email    : em,
          password : pwd
      },function(error, authData) {
          if (error === null) {
              console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
              var r = $firebase(fireBaseData.refRoomMates()).$asArray();
              r.$add(["javiexpo2003@gmail.com","gabita2882@gmail.com"]);
              $scope.user = fireBaseData.ref().getAuth();
              $scope.showLoginForm = false;
              $scope.$apply();
          } else {
              console.log("Error authenticating user:", error);
          }
      });
  };

  // Logout method
  $scope.logout = function () {
      fireBaseData.ref().unauth();
      $scope.showLoginForm = true;
  };
});
