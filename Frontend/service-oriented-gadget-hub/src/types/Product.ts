```typescript
export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
  distributorId?: string | number;
}

export {};
```