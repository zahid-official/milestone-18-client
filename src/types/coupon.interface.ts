// Defines coupon discount types
export type CouponDiscountType = "PERCENTAGE" | "FIXED";

// Defines coupon scope
export type CouponScope = "GLOBAL" | "VENDOR";

// Coupon interface definition
export interface ICoupon {
  _id?: string;
  code: string;
  title?: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  minQuantity?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  usageLimit?: number;
  usedCount?: number;
  scope?: CouponScope;
  vendorId?: string;
  createdBy?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
