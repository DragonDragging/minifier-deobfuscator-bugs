// This variable is used to detect whether Symbol.toPrimitive was executed
let value = 0;

// Object with a custom primitive conversion handler
// JavaScript calls Symbol.toPrimitive when an object must be converted
// to a primitive value (number, string, etc.)
const breakingObject = {
  [Symbol.toPrimitive](hint) {
    // If JavaScript expects a number (e.g. in arithmetic operations)
    if (hint === "number") {
      // Increase the counter so we know the conversion happened
      value += 1;
      // Return a valid numeric primitive
      return 1;
    }
    // If JavaScript expects a string
    if (hint === "string") {
      // Return a string primitive
      return "true";
    }
    // Default primitive conversion
    return true;
  }
};

// Define a getter on window for breakingObject
Object.defineProperty(window, "breakingObject", {
  get() {
    return breakingObject;
  },
  configurable: true
});

// This arithmetic operation forces JavaScript to convert
// breakingObject into a number
// Because the '*' operator only works with numeric values
// During this conversion JavaScript will call:
// Symbol.toPrimitive("number")
// This should increment `value`
breakingObject * 2;

// If the expression above was removed by a minifier (like Terser),
// Symbol.toPrimitive will never execute and value will stay 0
if (value == 0) {
  console.log("Used Terser");
} else {
  console.log("Not used Terser");
}
