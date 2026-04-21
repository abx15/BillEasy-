// Billing Types
export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL'
}
export interface Bill {}
export interface BillItem {}
export interface CreateBillDto {}