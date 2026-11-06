
(function () {
  "use strict";

  console.log("TopstoreMK: Country script v6 loaded");

  function selectCountry() {
    if (!window.Ecwid?.Cart?.get ||
        !window.Ecwid?.Cart?.setAddress) {
      return;
    }

    Ecwid.Cart.get(function (cart) {
      // Preserve the customer's existing country.
      if (cart.shippingPerson?.countryCode) return;

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
      console.log("TopstoreMK page:", page.type);

      if (page.type === "CHECKOUT_PAYMENT_DETAILS") {
        selectCountry();
      }
    });
  }

  if (window.Ecwid?.OnPageLoaded?.add) {
    initialize();
  } else if (window.Ecwid?.OnAPILoaded?.add) {
    Ecwid.OnAPILoaded.add(initialize);
  }
})();
