
(function () {
  "use strict";

  console.log("TopstoreMK: Country script v5 loaded");

  let timer = null;
  let updating = false;
  let lastPath = "";

  function isCheckout() {
    return window.location.pathname ===
      "/products/checkout/payment";
  }

  function selectCountry() {
    if (!isCheckout() || updating ||
        !window.Ecwid?.Cart?.get ||
        !window.Ecwid?.Cart?.setAddress) {
      return;
    }

    Ecwid.Cart.get(function (cart) {
      if (!isCheckout() || updating) return;

      // Never overwrite an existing country.
      if (cart.shippingPerson?.countryCode) return;

      updating = true;

      Ecwid.Cart.setAddress(
        { countryCode: "MK" },
        function () {
          updating = false;
          console.log("TopstoreMK: Macedonia selected");
        },
        function (error) {
          updating = false;
          console.error("TopstoreMK country error:", error);
        }
      );
    });
  }

  function checkPage() {
    if (!isCheckout()) {
      lastPath = window.location.pathname;
      return;
    }

    if (lastPath !== window.location.pathname) {
      lastPath = window.location.pathname;

      // Give checkout time to initialize.
      setTimeout(selectCountry, 500);
    }
  }

  function initialize() {
    checkPage();

    // Detect checkout navigation.
    timer = setInterval(checkPage, 500);

    if (window.Ecwid?.OnPageLoaded?.add) {
      Ecwid.OnPageLoaded.add(function (page) {
        if (page.type === "CHECKOUT_PAYMENT_DETAILS") {
          setTimeout(selectCountry, 500);
        }
      });
    }
  }

  if (window.Ecwid?.OnPageLoaded) {
    initialize();
  } else if (window.Ecwid?.OnAPILoaded) {
    Ecwid.OnAPILoaded.add(initialize);
  }
})();
