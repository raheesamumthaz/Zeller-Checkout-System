
import { IPricingRule, ItemSKU } from "./interfaces/store.interface"

class Checkout {
    private pricingRules: IPricingRule[];
    private cartItems: IPricingRule[] = []

    constructor(pricingRules: IPricingRule[]) {
        this.pricingRules = pricingRules;

    }


    scan(item: ItemSKU): void {
        const scannedItem = this.findItem(item);
        if (!scannedItem) {
            console.log(`Sorry! Could not find the details of item : ${item} in Zeller System, please update`);
            return
        }
        this.addToCart(scannedItem);



    }

    total(): number {
        let total = 0;
        console.log("cart...", this.cartItems)
        this.cartItems.forEach(item => {
            if (item["quantity"]) {
                if (item["discount"]) {
                    if (item["discount"]["offerCode"] === "3for2" && item["quantity"] >= item["discount"]["quantity"]) {
                        const discountedQuantity = item["quantity"] - (Math.floor(item["quantity"] / item["discount"]["quantity"]))
                        total += discountedQuantity * item.price

                    }
                    else if (item["discount"]["offerCode"] === "bulkDiscount" && item["discount"].discountedPrice && item["quantity"] > item["discount"]["quantity"]) {

                        total += item["discount"].discountedPrice * item["quantity"];
                    } else {
                        total += item.price * item["quantity"];


                    }
                }
                else {
                    total += item.price * item["quantity"];
                }
            }

        })

        return total
    }

    findItem(itemSKU: string) {
        const item = this.pricingRules.filter(item => item.sku === itemSKU);
        if (item.length) {
            return item[0];
        }
        return null;


    }
    private addToCart(scannedItem: IPricingRule) {

        let existingItem: null | IPricingRule = null;
        this.cartItems.forEach(item => {
            if (item.sku === scannedItem.sku && item.quantity != undefined) {
                // Case: item already exist in the cart
                item.quantity++;
                existingItem = item;

            }
        });
        // Case: item does not exist in the cart
        if (!existingItem) {
            const newCartItem = { ...scannedItem, quantity: 1 };
            this.cartItems.push(newCartItem);

        }

    }
    clearStore() {
        this.cartItems = []
    }

}

const pricingRulesSet: IPricingRule[] = [
    { sku: "ipd", name: "Super iPad", price: 549.99, discount: { offerCode: "bulkDiscount", quantity: 4, discountedPrice: 499.99 } },
    { sku: "mbp", name: "MacBook Pro", price: 1399.99 },
    { sku: "atv", name: "Apple TV", price: 109.50, discount: { offerCode: "3for2", quantity: 3 } },
    { sku: "vga", name: "VGA adapter", price: 30.00 },
];
const co = new Checkout(pricingRulesSet);
co.clearStore()
// Scenario 1
co.scan("atv");
co.scan("atv");
co.scan("atv");
co.scan("vga");
console.log("Total expected: $" + co.total()); // Output: $249.00

// Scenario 2
co.clearStore()
co.scan("atv");
co.scan("ipd");
co.scan("ipd");
co.scan("atv");
co.scan("ipd");
co.scan("ipd");
co.scan("ipd");
console.log("Total expected: $" + co.total()); // Output: $2718.95