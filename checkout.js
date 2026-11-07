
(function () {
  "use strict";

  console.log("TopstoreMK: Country script v7 loaded");

  var lastAttempt = 0;
  var requestRunning = false;

  function isCheckout() {
    return window.location.pathname.includes("/checkout/payment");
  }

  function selectCountry() {
    if (!isCheckout() || requestRunning) return;

    if (
      !window.Ecwid?.Cart?.get ||
      !window.Ecwid?.Cart?.setAddress
    ) return;

    // Avoid repeated requests during checkout loading.
    if (Date.now() - lastAttempt < 3000) return;

    lastAttempt = Date.now();
    requestRunning = true;

    Ecwid.Cart.get(function (cart) {
      if (!isCheckout()) {
        requestRunning = false;
        return;
      }

      // Never overwrite a country already selected.
      if (cart.shippingPerson?.countryCode) {
        requestRunning = false;
        return;
      }

      Ecwid.Cart.setAddress(
        { countryCode: "MK" },
        function () {
          requestRunning = false;
          console.log("TopstoreMK: Macedonia selected");
        },
        function (error) {
          requestRunning = false;
          console.error("TopstoreMK country error:", error);
        }
      );
    });
  }

  // Check navigation and API readiness.
  setInterval(selectCountry, 1000);

  // Also attempt immediately.
  selectCountry();
})();
