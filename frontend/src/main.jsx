import { createRoot } from "react-dom/client";1
import React from "react";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51RmvsmHbCZokRKgh2w5JBodBcG3UTJVyePNguSM2sO8iH92DvhtHwqbvMNYNflXFUlQZJ6L0uRWlP6R2CnlLsZvR00PAQ0C0Re"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);