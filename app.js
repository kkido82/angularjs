(function() {
  var app = angular.module('myApp', []);

  app.component('appHeader', {
    template: '<h1>{{vm.title}}</h1>',
    controller: [
      function() {
        var vm = this;
        vm.title = 'this is the header component';
        vm.$onInit = function() {};
      }
    ],
    controllerAs: 'vm'
  });

  app.controller('myControllerOne', [
    '$scope',
    '$http',
    function($scope, $http) {
      $scope.title = 'myControllerOne title';
      $scope.count = 1;
      $scope.boolTest = true;
      $scope.users = [];

      $scope.init = function() {
        $http
          .get('data/users.json')
          .then(res => ($scope.users = res.data.users));
      };

      $scope.calculate = function(amount) {
        $scope.count += amount;
      };
      $scope.$on('event-up', function(event, data) {
        alert(`$emit fired myControllerOne ${data}`);
      });

      $scope.$on('event-all', function(event, data) {
        alert('$rootScope.$broadcast fired myControllerOne');
      });

      $scope.btnClicked = function() {
        $scope.$broadcast('event-down', 'data');
      };
    }
  ]);

  app.controller('myControllerTwo', [
    '$scope',
    function($scope) {
      $scope.title = 'myControllerTwo title';

      $scope.$on('event-down', function(event, data) {
        alert('$broadcast fired myControllerTwo');
      });

      $scope.$on('event-all', function(event, data) {
        alert('$rootScope.$broadcast fired myControllerTwo');
      });

      $scope.btnClicked = function() {
        $scope.$emit('event-up', 'event-up fired');
      };
    }
  ]);

  app.controller('myControllerThree', [
    '$scope',
    '$rootScope',
    function($scope, $rootScope) {
      $scope.title = 'myControllerThree title';

      $scope.$on('event-down', function(event, data) {
        alert('$broadcast fired myControllerThree');
      });

      $scope.btnClicked = function() {
        $rootScope.$broadcast('event-all', 'data');
      };
    }
  ]);

  app.component('appOutput', {
    bindings: {
      out: '<'
    },
    template: `<div>
    <button ng-click="$ctrl.out(1)">buy one</button>
    <button ng-click="$ctrl.out(5)">buy many</button>
    </div>`
  });

  app.directive('myDirective', function() {
    return {
      transclude: false,
      template: `<h1>{{ title }}</h1>
      <button type="button" ng-click="btnClicked();">Click me!</button>`
      //   <ng-transclude></ng-transclude>
    };
  });

  app.component('appCounter', {
    bindings: {
      count: '<',
      title: '@'
    },
    controller: function($scope) {
      function increment() {
        this.count++;
        this.updateTitle();
      }
      function decrement() {
        this.count--;
        this.updateTitle();
      }

      function updateTitle() {
        angular
          .element(document.querySelector('#ctrl1'))
          .scope().title = `the new count is: ${this.count}`;
      }
      this.increment = increment;
      this.decrement = decrement;
      this.updateTitle = updateTitle;
    },
    template: `
    <div class="todo">
       <label for="counter">{{$ctrl.title}}</label><br/>
       <input name="counter" type="text" ng-model="$ctrl.count">
       <button type="button" ng-click="$ctrl.decrement();">-</button>
       <button type="button" ng-click="$ctrl.increment();">+</button>
     </div>
   `
    // templateUrl: 'counter.html'
  });

  app.directive('directiveCounter', function counter() {
    return {
      scope: {},
      bindToController: {
        count: '='
      },
      controller: function($scope) {
        function increment() {
          this.count++;
        }
        function decrement() {
          this.count--;
        }
        this.increment = increment;
        this.decrement = decrement;
      },
      controllerAs: 'counter',
      templateUrl: 'templates/counter.html'
    };
  });

  app.filter('boolean', function() {
    return function(value) {
      return value ? 'yes' : 'no';
    };
  });
})();
