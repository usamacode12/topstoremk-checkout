
(function () {
  "use strict";

  console.log("TopstoreMK: Country script v4 loaded");

  let checkoutTimer = null;
  let checkoutToken = 0;
  let updateInProgress = false;

  function selectCountry(token, attemptsLeft) {
    if (token !== checkoutToken ||
        !window.Ecwid?.Cart?.get ||
        !window.Ecwid?.Cart?.setAddress ||
        updateInProgress) {
      return;
    }

    Ecwid.Cart.get(function (cart) {
      if (token !== checkoutToken) return;

      const country = cart.shippingPerson?.countryCode;

      // Never overwrite a selected country.
      if (country) return;

      updateInProgress = true;

      Ecwid.Cart.setAddress(
        { countryCode: "MK" },
        function () {
          updateInProgress = false;
          console.log("TopstoreMK: Macedonia selected");
        },
        function (error) {
          updateInProgress = false;
          console.error("TopstoreMK country error:", error);

          if (attemptsLeft > 1) {
            checkoutTimer = setTimeout(function () {
              selectCountry(token, attemptsLeft - 1);
            }, 500);
          }
        }
      );
    });
  }

  function initialize() {
    Ecwid.OnPageLoaded.add(function (page) {
      checkoutToken++;
      clearTimeout(checkoutTimer);

      if (page.type === "CHECKOUT_PAYMENT_DETAILS") {
        const token = checkoutToken;

        // Allow Ecwid to initialize checkout fields.
        checkoutTimer = setTimeout(function () {
          selectCountry(token, 3);
        }, 600);
      }
    });
  }

  if (window.Ecwid?.OnPageLoaded) {
    initialize();
  } else if (window.Ecwid?.OnAPILoaded) {
    Ecwid.OnAPILoaded.add(initialize);
  }
})();
