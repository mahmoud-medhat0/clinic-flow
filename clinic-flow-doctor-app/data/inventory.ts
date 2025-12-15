// Inventory data types and mock data
export type StockStatus = 'inStock' | 'lowStock' | 'outOfStock';
export type MovementType = 'in' | 'out';
export type UnitType = 'pieces' | 'boxes' | 'cartons' | 'bottles' | 'packs';

export interface Category {
    id: number;
    name: string;
    nameAr: string;
    description: string;
}

export interface InventoryItem {
    id: number;
    barcode: string;
    name: string;
    nameAr: string;
    categoryId: number;
    quantity: number;
    minStock: number;
    unit: UnitType;
    costPrice: number;
    sellPrice: number;
}

export interface StockMovement {
    id: number;
    itemId: number;
    type: MovementType;
    quantity: number;
    date: string;
    notes: string;
}

export const categoriesData: Category[] = [
    { id: 1, name: 'Medications', nameAr: 'الأدوية', description: 'Prescription and OTC medications' },
    { id: 2, name: 'Medical Supplies', nameAr: 'المستلزمات الطبية', description: 'Disposable medical supplies' },
    { id: 3, name: 'Equipment', nameAr: 'المعدات', description: 'Medical equipment and devices' },
    { id: 4, name: 'Lab Supplies', nameAr: 'مستلزمات المختبر', description: 'Laboratory supplies and reagents' },
];

export const inventoryItemsData: InventoryItem[] = [
    {
        id: 1,
        barcode: 'MED001',
        name: 'Paracetamol 500mg',
        nameAr: 'باراسيتامول 500 مجم',
        categoryId: 1,
        quantity: 150,
        minStock: 50,
        unit: 'boxes',
        costPrice: 25,
        sellPrice: 40,
    },
    {
        id: 2,
        barcode: 'MED002',
        name: 'Amoxicillin 250mg',
        nameAr: 'أموكسيسيلين 250 مجم',
        categoryId: 1,
        quantity: 30,
        minStock: 40,
        unit: 'boxes',
        costPrice: 45,
        sellPrice: 70,
    },
    {
        id: 3,
        barcode: 'MED003',
        name: 'Ibuprofen 400mg',
        nameAr: 'إيبوبروفين 400 مجم',
        categoryId: 1,
        quantity: 0,
        minStock: 30,
        unit: 'boxes',
        costPrice: 30,
        sellPrice: 50,
    },
    {
        id: 4,
        barcode: 'SUP001',
        name: 'Disposable Gloves (L)',
        nameAr: 'قفازات لاتكس (كبير)',
        categoryId: 2,
        quantity: 200,
        minStock: 100,
        unit: 'boxes',
        costPrice: 80,
        sellPrice: 120,
    },
    {
        id: 5,
        barcode: 'SUP002',
        name: 'Surgical Masks',
        nameAr: 'كمامات جراحية',
        categoryId: 2,
        quantity: 500,
        minStock: 200,
        unit: 'boxes',
        costPrice: 50,
        sellPrice: 80,
    },
    {
        id: 6,
        barcode: 'SUP003',
        name: 'Cotton Swabs',
        nameAr: 'قطن طبي',
        categoryId: 2,
        quantity: 80,
        minStock: 100,
        unit: 'packs',
        costPrice: 15,
        sellPrice: 25,
    },
    {
        id: 7,
        barcode: 'EQP001',
        name: 'Digital Thermometer',
        nameAr: 'ترمومتر رقمي',
        categoryId: 3,
        quantity: 10,
        minStock: 5,
        unit: 'pieces',
        costPrice: 150,
        sellPrice: 250,
    },
    {
        id: 8,
        barcode: 'EQP002',
        name: 'Blood Pressure Monitor',
        nameAr: 'جهاز قياس ضغط الدم',
        categoryId: 3,
        quantity: 3,
        minStock: 2,
        unit: 'pieces',
        costPrice: 500,
        sellPrice: 800,
    },
    {
        id: 9,
        barcode: 'LAB001',
        name: 'Blood Collection Tubes',
        nameAr: 'أنابيب سحب الدم',
        categoryId: 4,
        quantity: 100,
        minStock: 50,
        unit: 'boxes',
        costPrice: 120,
        sellPrice: 180,
    },
    {
        id: 10,
        barcode: 'LAB002',
        name: 'Urine Test Strips',
        nameAr: 'شرائط تحليل البول',
        categoryId: 4,
        quantity: 25,
        minStock: 30,
        unit: 'bottles',
        costPrice: 200,
        sellPrice: 300,
    },
];

export const stockMovementsData: StockMovement[] = [
    { id: 1, itemId: 1, type: 'in', quantity: 50, date: '2024-12-15', notes: 'Monthly restock' },
    { id: 2, itemId: 4, type: 'in', quantity: 100, date: '2024-12-14', notes: 'Bulk order' },
    { id: 3, itemId: 2, type: 'out', quantity: 10, date: '2024-12-14', notes: 'Patient prescriptions' },
    { id: 4, itemId: 5, type: 'out', quantity: 50, date: '2024-12-13', notes: 'Daily usage' },
    { id: 5, itemId: 3, type: 'out', quantity: 30, date: '2024-12-12', notes: 'Depleted stock' },
    { id: 6, itemId: 9, type: 'in', quantity: 25, date: '2024-12-10', notes: 'Lab supply order' },
];

// Helper function to get stock status
export function getStockStatus(item: InventoryItem): StockStatus {
    if (item.quantity === 0) return 'outOfStock';
    if (item.quantity <= item.minStock) return 'lowStock';
    return 'inStock';
}
