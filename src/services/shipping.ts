/**
 * Represents a shipping address.
 */
export interface ShippingAddress {
  /**
   * The recipient's name.
   */
  name: string;
  /**
   * The street address.
   */
  address: string;
  /**
   * The city.
   */
  city: string;
  /**
   * The province.
   */
  province: string;
  /**
   * The postal code.
   */
  postalCode: string;
  /**
   * The phone number.
   */
  phoneNumber: string;
}

/**
 * Calculates the shipping cost for a given address.
 *
 * @param address The shipping address.
 * @returns A promise that resolves to the shipping cost.
 */
export async function calculateShippingCost(address: ShippingAddress): Promise<number> {
  // TODO: Implement this by calling an API.

  return 5.00;
}
