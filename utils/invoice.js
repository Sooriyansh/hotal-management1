const GST_RATE = 0.18;

const calculateInvoice = ({ subtotal = 0, discount = 0, couponDiscount = 0 }) => {
  const discounted = Math.max(subtotal - discount - couponDiscount, 0);
  const gst = Math.round(discounted * GST_RATE * 100) / 100;
  const total = Math.round((discounted + gst) * 100) / 100;

  return {
    subtotal,
    discount,
    couponDiscount,
    gst,
    total
  };
};

module.exports = { calculateInvoice, GST_RATE };
