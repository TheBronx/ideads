'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'highcharts-ng'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('ads');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('campaigns');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('places');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Ads module
angular.module('ads').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Ads', 'ads', 'dropdown', '/ads(/create)?', undefined, false, ['admin']);
    Menus.addSubMenuItem('topbar', 'ads', 'List Ads', 'ads');
    Menus.addSubMenuItem('topbar', 'ads', 'New Ad', 'ads/create');
  }
]);'use strict';
// Setting up route
angular.module('ads').config([
  '$stateProvider',
  function ($stateProvider) {
    // Ads state routing
    $stateProvider.state('listAds', {
      url: '/ads',
      templateUrl: 'modules/ads/views/list-ads.client.view.html'
    }).state('createAd', {
      url: '/ads/create',
      templateUrl: 'modules/ads/views/create-ad.client.view.html'
    }).state('viewAd', {
      url: '/ads/:adId',
      templateUrl: 'modules/ads/views/view-ad.client.view.html'
    }).state('editAd', {
      url: '/ads/:adId/edit',
      templateUrl: 'modules/ads/views/edit-ad.client.view.html'
    });
  }
]);'use strict';
angular.module('ads').controller('AdsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Ads',
  function ($scope, $stateParams, $location, Authentication, Ads) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var ad = new Ads({
          name: this.name,
          campaign: this.campaign,
          image: this.image,
          content: this.content,
          link: this.link,
          width: this.width,
          height: this.height
        });
      ad.$save(function (response) {
        $location.path('ads/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      this.name = '';
      this.campaign = undefined;
      this.image = '';
      this.content = '';
      this.link = '';
      this.width = 728;
      this.height = 90;
    };
    $scope.setImageData = function (fileContent) {
      if ($scope.ad !== undefined) {
        $scope.ad.image = fileContent;
      } else {
        this.image = fileContent;
      }
    };
    $scope.remove = function (ad) {
      if (ad) {
        ad.$remove();
        for (var i in $scope.ads) {
          if ($scope.ads[i] === ad) {
            $scope.ads.splice(i, 1);
          }
        }
      } else {
        $scope.ad.$remove(function () {
          $location.path('ads');
        });
      }
    };
    $scope.update = function () {
      var ad = $scope.ad;
      ad.$update(function () {
        $location.path('ads/' + ad._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.ads = Ads.query();
    };
    $scope.findOne = function () {
      $scope.ad = Ads.get({ adId: $stateParams.adId });
    };
    $scope.exampleAdsenseContent = function () {
      $scope.image = '';
      $scope.link = 'adsense';
      $scope.content = '[adsense]<!--' + '\n' + 'google_ad_client = "ca-pub-000000000000000000";' + '\n' + '/* AdSense Example */' + '\n' + 'google_ad_slot = "0000000000";' + '\n' + 'google_ad_width = 728;' + '\n' + 'google_ad_height = 90;' + '\n' + '//-->' + '\n' + 'var script = document.createElement(\'script\');' + '\n' + 'script.type = \'text/javascript\';' + '\n' + 'script.src = \'http://pagead2.googlesyndication.com/pagead/show_ads.js\';' + '\n' + 'document.body.appendChild(script);' + '\n' + '[/adsense]';
    };
  }
]);'use strict';
angular.module('ads').directive('onReadFile', [
  '$parse',
  function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);
        element.on('change', function (onChangeEvent) {
          var reader = new FileReader();
          reader.onload = function (onLoadEvent) {
            scope.$apply(function () {
              fn(scope, { $fileContent: onLoadEvent.target.result });
            });
          };
          reader.readAsDataURL((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  }
]);'use strict';
//Ads service used for communicating with the ads REST endpoints
angular.module('ads').factory('Ads', [
  '$resource',
  function ($resource) {
    return $resource('ads/:adId', { adId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          content: this.content
        });
      article.$save(function (response) {
        $location.path('articles/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      this.title = '';
      this.content = '';
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Campaigns module
angular.module('campaigns').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Campaigns', 'campaigns', 'dropdown', '/campaigns(/create)?', undefined, false, ['admin']);
    Menus.addSubMenuItem('topbar', 'campaigns', 'List Campaigns', 'campaigns');
    Menus.addSubMenuItem('topbar', 'campaigns', 'New Campaign', 'campaigns/create');
  }
]);'use strict';
// Setting up route
angular.module('campaigns').config([
  '$stateProvider',
  function ($stateProvider) {
    // Campaigns state routing
    $stateProvider.state('listCampaigns', {
      url: '/campaigns',
      templateUrl: 'modules/campaigns/views/list-campaigns.client.view.html'
    }).state('createCampaign', {
      url: '/campaigns/create',
      templateUrl: 'modules/campaigns/views/create-campaign.client.view.html'
    }).state('viewCampaign', {
      url: '/campaigns/:campaignId',
      templateUrl: 'modules/campaigns/views/view-campaign.client.view.html'
    }).state('editCampaign', {
      url: '/campaigns/:campaignId/edit',
      templateUrl: 'modules/campaigns/views/edit-campaign.client.view.html'
    });
  }
]);'use strict';
angular.module('campaigns').controller('CampaignsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Campaigns',
  function ($scope, $stateParams, $location, Authentication, Campaigns) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var campaign = new Campaigns({
          name: this.name,
          ads: this.ads,
          includedPlaces: this.includedPlaces,
          owner: this.owner,
          active: true
        });
      campaign.$save(function (response) {
        $location.path('campaigns/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      this.name = '';
      this.ads = [];
      this.includedPlaces = [];
      this.owner = undefined;
    };
    $scope.remove = function (campaign) {
      if (campaign) {
        campaign.$remove();
        for (var i in $scope.places) {
          if ($scope.campaigns[i] === campaign) {
            $scope.campaigns.splice(i, 1);
          }
        }
      } else {
        $scope.campaign.$remove(function () {
          $location.path('campaigns');
        });
      }
    };
    $scope.update = function () {
      var campaign = $scope.campaign;
      campaign.$update(function () {
        $location.path('campaigns/' + campaign._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.campaigns = Campaigns.query();
    };
    $scope.findOne = function () {
      $scope.campaign = Campaigns.get({ campaignId: $stateParams.campaignId });
    };
  }
]);'use strict';
//Campaigns service used for communicating with the places REST endpoints
angular.module('campaigns').factory('Campaigns', [
  '$resource',
  function ($resource) {
    return $resource('campaigns/:campaignId', { campaignId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
    // Home state routing
    $stateProvider.state('dashboard', {
      url: '/dashboard',
      templateUrl: 'modules/core/views/dashboard.client.view.html'
    });
  }
]);'use strict';
/*globals $, data*/
angular.module('core').controller('DashboardController', [
  '$scope',
  '$http',
  'Authentication',
  function ($scope, $http, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.campaigns = data.campaigns;
    if (data.campaigns === undefined) {
      window.location = '/';
    }
    $scope.since = new Date();
    $scope.since.setTime($scope.since.getTime() - 30 * 24 * 3600 * 1000);
    //30 days ago
    $scope.until = new Date();
    //today
    function getBaseDay(timestamp) {
      return timestamp - timestamp % (24 * 3600 * 1000);
    }
    function sanitizeDates() {
      $scope.since.setTime(getBaseDay($scope.since.getTime()));
      //00h 00m 000ms
      $scope.until.setTime(getBaseDay($scope.until.getTime()));  //00h 00m 000ms
    }
    function getStats(drawPlotCallback, tableStatsCallback) {
      var sinceDMY = '' + $scope.since.getDate() + '-' + ($scope.since.getMonth() + 1) + '-' + $scope.since.getFullYear();
      var untilDMY = '' + $scope.until.getDate() + '-' + ($scope.until.getMonth() + 1) + '-' + $scope.until.getFullYear();
      $http.get('/stats/since-' + sinceDMY + '/until-' + untilDMY).success(function (series, status, headers, config) {
        drawPlotCallback(series.plot);
        tableStatsCallback(series.table);
      }).error(function (data, status, headers, config) {
        // log error
        console.log('error');
      });
    }
    function clearAllSeries() {
      var chart = $('#chart1').highcharts();
      for (var i = 0; i < chart.series.length; i++) {
        chart.series[i].remove();
      }
    }
    function drawGraphic(timeseries) {
      clearAllSeries();
      timeseries[0].name = 'views';
      timeseries[0].color = '#4d90fe';
      timeseries[0].marker = { 'symbol': 'circle' };
      timeseries[0].yAxis = 0;
      timeseries[1].name = 'clicks';
      timeseries[1].color = '#ed561b';
      timeseries[1].marker = { 'symbol': 'diamond' };
      timeseries[1].yAxis = 1;
      $scope.chartConfig = {
        options: {
          chart: {
            type: 'line',
            zoomType: 'x'
          }
        },
        series: timeseries,
        title: { text: $scope.since.getDate() + '/' + ($scope.since.getMonth() + 1) + '/' + $scope.since.getFullYear() + ' - ' + $scope.until.getDate() + '/' + ($scope.until.getMonth() + 1) + '/' + $scope.until.getFullYear() },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { day: '%e. %b' },
          title: { text: 'Date' }
        },
        yAxis: [
          {
            title: {
              text: 'Views',
              style: { color: '#4d90fe' }
            },
            floor: 0,
            opposite: false
          },
          {
            title: {
              text: 'Clicks',
              style: { color: '#ed561b' }
            },
            floor: 0,
            opposite: true
          }
        ],
        loading: false
      };
    }
    function resetCampaignAdStats() {
      $scope.campaigns.forEach(function (campaign) {
        campaign.ads.forEach(function (ad) {
          ad.stats = {
            'views': 0,
            'clicks': 0
          };
        });
      });
    }
    function setAdStats(adId, adStats) {
      $scope.campaigns.forEach(function (campaign) {
        campaign.ads.forEach(function (ad) {
          if (ad._id === adId) {
            ad.stats.views = adStats.views;
            ad.stats.clicks = adStats.clicks;
          }
        });
      });
    }
    function showTableStats(adStats) {
      for (var adId in adStats) {
        setAdStats(adId, adStats[adId]);
      }
    }
    $scope.openDatepicker = function ($event, datepickerFlag) {
      $event.preventDefault();
      $event.stopPropagation();
      if (datepickerFlag === 'since') {
        $scope.sinceOpened = true;
        $scope.untilOpened = false;
      } else if (datepickerFlag === 'until') {
        $scope.sinceOpened = false;
        $scope.untilOpened = true;
      }
    };
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false
    };
    $scope.reloadStats = function () {
      if ($scope.since === undefined || $scope.until === undefined)
        return;
      if ($scope.since === '' || $scope.until === '')
        return;
      $scope.chartConfig = {
        title: { text: 'Loading data' },
        loading: true
      };
      sanitizeDates();
      resetCampaignAdStats();
      getStats(drawGraphic, showTableStats);
    };
    $scope.reloadStats();
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  '$location',
  'Authentication',
  function ($scope, $location, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //logged in users should see the dashboard instead of the public index
    if ($scope.authentication.user !== null) {
      $location.path('/dashboard');
    }
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Places module
angular.module('places').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Places', 'places', 'dropdown', '/places(/create)?', undefined, false, ['admin']);
    Menus.addSubMenuItem('topbar', 'places', 'List Places', 'places');
    Menus.addSubMenuItem('topbar', 'places', 'New Place', 'places/create');
  }
]);'use strict';
// Setting up route
angular.module('places').config([
  '$stateProvider',
  function ($stateProvider) {
    // Places state routing
    $stateProvider.state('listPlaces', {
      url: '/places',
      templateUrl: 'modules/places/views/list-places.client.view.html'
    }).state('createPlace', {
      url: '/places/create',
      templateUrl: 'modules/places/views/create-place.client.view.html'
    }).state('viewPlace', {
      url: '/places/:placeId',
      templateUrl: 'modules/places/views/view-place.client.view.html'
    }).state('editPlace', {
      url: '/places/:placeId/edit',
      templateUrl: 'modules/places/views/edit-place.client.view.html'
    });
  }
]);'use strict';
angular.module('places').controller('PlacesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Places',
  function ($scope, $stateParams, $location, Authentication, Places) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var place = new Places({
          name: this.name,
          width: this.width,
          height: this.height
        });
      place.$save(function (response) {
        $location.path('places/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      this.name = '';
      this.width = '';
      this.height = '';
    };
    $scope.remove = function (place) {
      if (place) {
        place.$remove();
        for (var i in $scope.places) {
          if ($scope.places[i] === place) {
            $scope.places.splice(i, 1);
          }
        }
      } else {
        $scope.place.$remove(function () {
          $location.path('places');
        });
      }
    };
    $scope.update = function () {
      var place = $scope.place;
      place.$update(function () {
        $location.path('places/' + place._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.places = Places.query();
    };
    $scope.findOne = function () {
      $scope.place = Places.get({ placeId: $stateParams.placeId });
    };
  }
]);'use strict';
//Places service used for communicating with the places REST endpoints
angular.module('places').factory('Places', [
  '$resource',
  function ($resource) {
    return $resource('places/:placeId', { placeId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      $scope.success = $scope.error = null;
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('UsersController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Users',
  function ($scope, $stateParams, $location, Authentication, Users) {
    $scope.find = function () {
      $scope.users = Users.query();
    };
    $scope.findOne = function () {
      $scope.user = Users.get({ userId: $stateParams.userId });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);