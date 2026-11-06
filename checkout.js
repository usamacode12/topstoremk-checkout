
(function () {
  "use strict";

  console.log("TopstoreMK: Country script loaded");

  function setDefaultCountry() {
    if (!window.Ecwid?.Cart?.get ||
        !window.Ecwid?.Cart?.setAddress) {
      return;
    }

    Ecwid.Cart.get(function (cart) {
      // Preserve any country already selected.
      if (cart.shippingPerson?.countryCode) {
        return;
      }

      Ecwid.Cart.setAddress(
        { countryCode: "MK" },
        function () {
          console.log("TopstoreMK: Macedonia selected");
        },
        function (error) {
          console.error("TopstoreMK country error:", error);
        }
      );
    });
  }

  function initialize() {
    Ecwid.OnPageLoaded.add(function (page) {
      if (page.type === "CHECKOUT_PAYMENT_DETAILS") {
        setDefaultCountry();
      }
    });
  }

  if (window.Ecwid?.OnPageLoaded) {
    initialize();
  } else if (window.Ecwid?.OnAPILoaded) {
    Ecwid.OnAPILoaded.add(initialize);
  }
})();
