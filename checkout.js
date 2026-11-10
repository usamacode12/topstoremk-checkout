
(function () {
  "use strict";

  console.log("TopstoreMK: Country script v9 loaded");

  var busy = false;
  var lastAttempt = 0;

  function ensureMacedonia() {
    if (busy || !window.Ecwid?.Cart?.get ||
        !window.Ecwid?.Cart?.setAddress) return;

    if (Date.now() - lastAttempt < 1000) return;

    lastAttempt = Date.now();
    busy = true;

    Ecwid.Cart.get(function (cart) {
      var shipping = cart.shippingPerson || {};

      if (shipping.countryCode ||
          cart.billingPerson?.countryCode) {
        busy = false;
        return;
      }

      Ecwid.Cart.setAddress(
        { ...shipping, countryCode: "MK" },
        function () {
          busy = false;
          console.log("TopstoreMK: Macedonia selected");
        },
        function (error) {
          busy = false;
          console.error("TopstoreMK country error:", error);
        }
      );
    });
  }

  Ecwid.OnCartChanged.add(function () {
    ensureMacedonia();
  });

  Ecwid.OnPageLoaded.add(function () {
    ensureMacedonia();
  });

  setInterval(ensureMacedonia, 1000);

  ensureMacedonia();
})();
