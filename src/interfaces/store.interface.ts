type OfferCode = "3for2" | "bulkDiscount" | null;
export  type ItemSKU = "ipd" | "mbp"  | "atv" | "vga"

export interface IPricingRule {
    sku: ItemSKU;
    name: string;
    price: number;
    quantity?:number,
    discount?: {
      offerCode:OfferCode;
      quantity:number;
      discountedPrice?: number;
    };
    
}