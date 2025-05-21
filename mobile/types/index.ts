// Tipe data untuk Response API
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Tipe data untuk User
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "user" | "admin" | "superadmin" | "midtrans";
  createdAt: string;
  updatedAt: string;
}

// Tipe data untuk Galon
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe data untuk Pembayaran
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: "manual" | "midtrans";
  status: "pending" | "processing" | "completed" | "failed";
  paymentUrl?: string;
  paymentToken?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe data untuk Pesanan
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  payment: Payment;
  createdAt: string;
  updatedAt: string;
}

// Tipe data untuk Item Pesanan
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

// Tipe data untuk Laporan Keuangan
export interface FinancialReport {
  id: string;
  period: string;
  totalSales: number;
  totalExpenses: number;
  netIncome: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

// Tipe data untuk Transaksi
export interface Transaction {
  id: string;
  reportId: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe data untuk Tangki Air
export interface WaterTank {
  id: string;
  capacity: number;
  currentLevel: number;
  status: "normal" | "low" | "critical";
  lastRefill: string;
  nextRefillEstimate: string;
  createdAt: string;
  updatedAt: string;
}
