// @ts-check

/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
*/

/**
* @type {FunctionRunResult}
*/
const NO_CHANGES = {
  operations: [], 
};

/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {
  // Define a type for your configuration, and parse it from the metafield
  /**
  * @type {{
  *   paymentMethodName: string
  *   cartTotal: number
  *   selectedMethod: string
  * }}
  */
  const configuration = JSON.parse(
    input?.paymentCustomization?.metafield?.value ?? "{}"
  );


  // Initialize a variable to track whether any product has the "invoice" method
  let hasInvoiceMethod = false;
  let productPaymentMethodId;
  let hiddenPaymentMethodIds = [];

  // Loop through cart lines and check if any product has the "invoice" method
  input?.cart?.lines.forEach((line) => {
    const merchandise = line.merchandise;
    if (merchandise.__typename === 'ProductVariant') {
      const product = merchandise.product;
      const metafield = JSON.parse(product?.metafield?.value ?? "{}");
      // Check if the product has the "invoice" method
      if (metafield.selectedMethod === "Invoice") {
        input.paymentMethods.forEach(method => {
          if (!method.name.startsWith("Invoice")) {
            hiddenPaymentMethodIds.push(method.id);
          }
        });
      }
    }
  });
  console.log("🚀 ~ file: run.js:52 ~ input?.cart?.lines.forEach ~ productPaymentMethodId:", hiddenPaymentMethodIds)

  const hiddden = hiddenPaymentMethodIds.forEach(i=>{i.id
    debugger
  });
  console.log("🚀 ~ file: run.js:57 ~ run ~ hiddden11111111212:", hiddden)
  if (!hiddenPaymentMethodIds) {
    return NO_CHANGES;
  }


  const hidePaymentMethod = input.paymentMethods
    .find(method => method.name.includes("Cash on Delivery"));

  if (!hidePaymentMethod) {
    return NO_CHANGES;
  }

  const operations = hiddenPaymentMethodIds.map(paymentMethodId => ({
    hide: {
      paymentMethodId: paymentMethodId  // Ensure it's a string
    }
  }));
  
  return { operations }
}