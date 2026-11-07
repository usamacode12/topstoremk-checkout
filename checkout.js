
(function () {
  "use strict";

  console.log("TopstoreMK: Country script v8 loaded");

  var busy = false;
  var completed = false;

  function setDefaultCountry() {
    if (busy || completed) return;
    if (!window.Ecwid?.Cart?.get || !window.Ecwid?.Cart?.setAddress) return;

    busy = true;

    Ecwid.Cart.get(function (cart) {
      if (cart.shippingPerson?.countryCode || cart.billingPerson?.countryCode) {
        completed = true;
        busy = false;
        return;
      }

      Ecwid.Cart.setAddress(
        { countryCode: "MK" },
        function () {
          completed = true;
          busy = false;
          console.log("TopstoreMK: Macedonia default applied");
        },
        function (error) {
          busy = false;
          console.error("TopstoreMK:", error);
        }
      );
    });
  }

  setInterval(setDefaultCountry, 2000);
  setDefaultCountry();
})();
