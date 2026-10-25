export type Product = {
  id: string; slug: string; name: string; description: string; price: number; oldPrice?: number
  category: string; subcategory: string; brand: string; images: string[]; stock: number; rating: number
  specifications: Record<string, string>; featured: boolean; popular: boolean; new: boolean; promotion: boolean
}
export type Service = { slug: string; name: string; short: string; long: string }
