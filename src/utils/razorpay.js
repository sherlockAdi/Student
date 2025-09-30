const RAZORPAY_CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpayScript = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_SRC}"]`);
  if (existingScript && window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
};

export const initializeRazorpayCheckout = async (options = {}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded || typeof window === "undefined" || typeof window.Razorpay === "undefined") {
    throw new Error("Razorpay SDK failed to load. Please check your network connection.");
  }

  return new window.Razorpay(options);
};
