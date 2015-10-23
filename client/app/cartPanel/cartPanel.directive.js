'use strict';

function cartPanel() {
  var directive = {
    templateUrl: 'app/cartPanel/cartPanel.html',
    restrict: 'E',
    controllerAs: 'cp',
    controller: cartPanelCtrl
  };

  return directive;

  function cartPanelCtrl($scope, $resource, cartService, $modal) {
    var cp = this;

    /**
    * Public methods
    */
    cp.searchClient = searchClient;
    cp.changeClient = changeClient;
    cp.newClientModal = newClientModal;
    cp.getDiscountsDropdown = getDiscountsDropdown;
    cp.removeItemCart = removeItemCart;
    cp.applyCoupon = applyCoupon;
    cp.applyDiscount = applyDiscount;
    cp.voidCart = voidCart;
    cp.voidClient = voidClient;
    cp.checkoutCartModal = checkoutCartModal;
    cp.discountsUpdate = discountsUpdate;

    init();
    return cp;

    function init () {
      cp.cart = cartService.getCart();
      cp.defaultClient = angular.copy(cp.cart.client) || {'name': 'Consumidor Final'};
      cp.discounts = [];
    }

    function searchClient(value){
      var r = $resource('api/clients');
      //cp.clients = r.query({query: value});
      return r.query({query: value}).$promise.then(function(clients){
        cp.clients = clients;
        return clients;
      });
    }

    function changeClient($client){
      cp.cart = cartService.getCart();
      cp.cart.client = cp.selectedClient = $client;
      cartService.resetDiscounts();
      cartService.getDiscountsForCart('byclient');
    }

    function newClientModal(){
      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'components/clientmodal/clientModal.html',
        controller: 'clientModalCtrl',
        controllerAs: 'vm',
        size: 'sm'
        //resolve: {
        //  algo: function(){}
        //}
      });

      modalInstance.result.then(function (createdClient) {
        cp.cart.client = createdClient;
        cartService.resetDiscounts();
        cartService.getDiscountsForCart('byclient');
        console.log('enmodal');
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    function getDiscountsDropdown(open){
      if(open){
        cartService.getDiscountsForCart('generic')
          .$promise.then(function(data){
            cp.discounts = data.discounts;
          });
      }
    }

    function removeItemCart(idProduct){
      cartService.removeFromCart(idProduct);
      cartService.resetDiscounts();
      cartService.getDiscountsForCart('byclient');
    }

    function applyCoupon(){
      cartService.applyCoupon(cp.selectedCoupon);
    }

    function voidCart(){
      cartService.resetCart();
    }

    function voidClient(idcliente){
      if(idcliente === null){
        cartService.resetClient();
      }
    }

    function applyDiscount(idDiscount){
      cartService.applyDiscount(idDiscount);
    }

    function checkoutCartModal(){
      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'components/checkoutcartmodal/checkoutCartModal.html',
        controller: 'checkoutCartModalCtrl',
        controllerAs: 'vmc'
        //resolve: {
        //  algo: function(){}
        //}
      });

      modalInstance.result.then(function (createdCheckout) {
        cp.cart.client = createdCheckout;
        console.log('enmodal');
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }

    function discountsUpdate(){
      cartService.getDiscountsForCart('byclient');
    }

  }

}

angular.module('kposApp')
  .directive('cartPanel', cartPanel);
