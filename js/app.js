// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('GeralCtrl', function($scope, $ionicActionSheet) {
  $scope.showActionSheet = function() {
  // Show the action sheet:
  $ionicActionSheet.show({
    buttons: [{
      text: 'WhatsApp'
    }, {
      text: 'Facebook'
    }, {
      text: 'Gmail'
    }],
    destructiveText: 'Cancelar',
    titleText: 'Compartilhe esta notícia',
    destructiveButtonClicked: function() {
      alert("Cancelado");
      return true;
    },
    buttonClicked: function(index, buttonObj) {
 switch (index) {
   case 0:
     alert("Compartilhando no WhatsApp");
     return true;
   case 1:
     alert("Compartilhando no Facebook");
     return true;
   case 2:
      alert("Compartilhando no Gmail");
      return true;
 }
}
  });
 };
})


.controller('AppCtrl', function($scope) {

})
.controller('contatoCtrl', function($scope) {

})








.controller('MyCtrl', function($scope, $cordovaGeolocation) {
   var posOptions = {timeout: 10000, enableHighAccuracy: false};
   $cordovaGeolocation
   .getCurrentPosition(posOptions)

   .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      $scope.lat = lat;
      $scope.long = long;
      console.log(lat + '   ' + long)
   }, function(err) {
      console.log(err)
   });


   var watchOptions = {timeout : 3000, enableHighAccuracy: false};
   var watch = $cordovaGeolocation.watchPosition(watchOptions);

   watch.then(
      null,

      function(err) {
         console.log(err)
      },

      function(position) {
        var lat  = position.coords.latitude
     	var long = position.coords.longitude
         console.log(lat + '' + long)
      }
   );

   watch.clearWatch();

})



.config(function($stateProvider, $urlRouterProvider) {
 $stateProvider
   .state('app', {
   url: "/app",
   abstract: true,
   templateUrl: "templates/menu.html",
   controller: 'AppCtrl'
 })

  .state('app.principal', {
     url: "/principal",
     views: {
       'menuContent': {
         templateUrl: "templates/principal.html"
       }
     }
  })

  .state('app.duvidas', {
     url: "/duvidas",
     views: {
       'menuContent': {
         templateUrl: "templates/duvidas.html"
       }
     }
  })

  .state('app.consulta', {
     url: "/consulta",
     views: {
       'menuContent': {
         templateUrl: "templates/consulta.html"
       }
     }
  })

  .state('app.versao', {
     url: "/versao",
     views: {
       'menuContent': {
         templateUrl: "templates/versao.html"
       }
     }
  })

   .state('app.registro', {
     url: "/registro",
     views: {
       'menuContent': {
         templateUrl: "templates/registro.html",
       controller: 'MyCtrl'
       }
     }
   });
 // If none of the above states are matched, use this as the fallback:
 $urlRouterProvider.otherwise('/app/principal');
})



.controller('AppCtrl', function($scope, HttpService, $ionicModal) {
 

 $ionicModal.fromTemplateUrl('my-modal.html', {
   scope: $scope,
   animation: 'slide-in-up'
 }).then(function(modal) {
   $scope.modal = modal;
 });


 $scope.consulta = function(){
    HttpService.getDados()
   .then(function(response) {
       $scope.jornada = response;
       
    });
 }
      

$scope.insere = function(){
	$scope.registro.lat = $scope.lat;
	$scope.registro.long = $scope.long;
    HttpService.insereDados($scope.registro)
   .then(function(response) {
       $scope.jornada = response;
       alert("Horario inserido !");
       
    });
 }

$scope.deleteItem = function(item){
  var resposta = confirm("Confirma a exclusão deste comentario ?");
  if (resposta == true){
        HttpService.removeDados(item)
        .then(function (response){
                  alert("Removido com sucesso");
                });
  }
}

$scope.atualiza = function(){
    HttpService.atualizaDados($scope.coment)
   .then(function(response) {
       $scope.comentarios = response;
       alert("Atualizado com sucesso !");
       
    });
 }

$scope.openModal = function(coment) {
    $scope.modal.show();
   // $scope.prod = prod; // permite que o conteúdo vá para Modal
};
  
$scope.closeModal = function() {
    $scope.modal.hide();
    
};


})

.service('HttpService', function($http) {
 return {
   getDados: function() {
     // $http returns a promise, which has a then function, which also returns a promise.
     return $http.get('http://localhost:3000/consulta')
       .then(function(response) {
         // In the response, resp.data contains the result. Check the console to see all of the data returned.
         console.log('Get Dados', response);
         return response.data;
      });
   },
   insereDados: function(coment) {
     // $http returns a promise, which has a then function, which also returns a promise.
     return $http.post('http://localhost:3000/insere', coment)
       .then(function(response) {
         // In the response, resp.data contains the result. Check the console to see all of the data returned.
         console.log('Inseriu Dados', response);
         return response.data;
      });
   },

removeDados: function(coment){
     return $http.delete('http://localhost:3000/remove/' + coment.codigo)
      .then(function(response) {
         // In the response, resp.data contains the result. Check the console to see all of the data returned.
         console.log('Comentario removido', response);
         return response.data;
      }
      )
  },

   atualizaDados: function(coment) {
     // $http returns a promise, which has a then function, which also returns a promise.
      $http.put('http://localhost:3000/atualiza', coment)
       .then(function(response) {
         // In the response, resp.data contains the result. Check the console to see all of the data returned.
         console.log('Atualizou Dados', response);
         return response.data;
      });
   }



   
 };
})


