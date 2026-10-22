import { RandomDataUtil } from './dataGenerator';

export class Helper {
    static convertPriceToNumber(price: string): number {
        // Remove all characters except digits and decimal point
        const cleaned = price.replace(/[^\d.]/g, '');
        return parseFloat(cleaned);
    }

    static getProductDetails() {
        return {
            productName: "MacBook",
            productQuantity: "1",
            totalPrice: "$602.00"
        };
    }

    static getLoginDetails() {
        return {
            email: "pavanol@xyz.com",
            password: "test@123"
        };
    }

        /**
         * Returns invalid credentials used to verify login rejection.
         */
        static getInvalidLoginDetails() {
            return {
                email: "invalid.user@example.com",
                password: "WrongPass@123"
            };
        }

    /**
     * Returns a fixed, known product used across shopping-flow scenarios.
     * Mirrors .env PRODUCT_NAME / PRODUCT_QUANTITY / TOTAL_PRICE.
     */
    static getShoppingProductDetails() {
        return {
            productName: "MacBook",
            productQuantity: "1",
            unitPrice: "$602.00",
            cartTotal: "$602.00"
        };
    }

    /**
     * Generates a unique customer registration dataset.
     */
    static generateCustomerData() {
        return {
            firstName: RandomDataUtil.getFirstName(),
            lastName: RandomDataUtil.getLastName(),
            email: RandomDataUtil.getEmail(),
            telephone: RandomDataUtil.getPhoneNumber(),
            password: RandomDataUtil.getPassword(10)
        };
    }
}