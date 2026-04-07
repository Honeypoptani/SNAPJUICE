export const CATEGORY_LABELS = {
  fruit_salad: "Make Your Own Fruit Salad",
  fruits: "Fruits",
  juices: "Juices",
};

export const DELIVERY_FEE = 20;

export const DELIVERY_SLOTS = [
  { value: "1pm", label: "1:00 PM" },
  { value: "2pm", label: "2:00 PM" },
  { value: "5pm_plus", label: "5:00 PM or later" },
];

export const DELIVERY_AREAS = [
  { value: "cg", label: "CG" },
  { value: "near_sports_complex", label: "Near sports complex" },
  { value: "near_girls_hostel", label: "Near girls hostel" },
];

export const PAYMENT_METHODS = [
  { value: "upi", label: "UPI" },
  { value: "cod", label: "Cash on delivery" },
];

/** Tomorrow (local date) as YYYY-MM-DD — minimum delivery day (order ≥1 day prior). */
export function minDeliveryDateStr() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  t.setHours(0, 0, 0, 0);
  return t.toISOString().slice(0, 10);
}
