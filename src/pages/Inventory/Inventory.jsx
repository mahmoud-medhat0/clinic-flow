import React, { useState } from 'react';
import { Plus, X, Package, Tag, ArrowUpDown, RefreshCw, Printer } from 'lucide-react';
import { useTranslation, useDirection } from '../../context/DirectionContext';
import CustomSelect from '../../components/common/CustomSelect';
import CustomDataTable from '../../components/common/CustomDataTable';

// Initial mock data
const initialCategories = [
  { id: 1, name: 'Medical Supplies', nameAr: 'المستلزمات الطبية', description: 'Gloves, syringes, bandages' },
  { id: 2, name: 'Medications', nameAr: 'الأدوية', description: 'Prescription and OTC drugs' },
  { id: 3, name: 'Equipment', nameAr: 'المعدات', description: 'Medical devices and tools' },
];

const initialItems = [
  { id: 1, barcode: 'MED001', name: 'Surgical Gloves', nameAr: 'قفازات جراحية', categoryId: 1, quantity: 500, minStock: 100, unit: 'pieces', costPrice: 0.5, sellPrice: 1.0 },
  { id: 2, barcode: 'MED002', name: 'Syringes 5ml', nameAr: 'حقن 5 مل', categoryId: 1, quantity: 200, minStock: 50, unit: 'pieces', costPrice: 0.3, sellPrice: 0.6 },
  { id: 3, barcode: 'DRG001', name: 'Paracetamol 500mg', nameAr: 'باراسيتامول 500 مجم', categoryId: 2, quantity: 30, minStock: 50, unit: 'boxes', costPrice: 5, sellPrice: 8 },
  { id: 4, barcode: 'EQP001', name: 'Digital Thermometer', nameAr: 'مقياس حرارة رقمي', categoryId: 3, quantity: 10, minStock: 5, unit: 'pieces', costPrice: 15, sellPrice: 25 },
  { id: 5, barcode: 'MED003', name: 'Bandage Roll', nameAr: 'لفة ضمادة', categoryId: 1, quantity: 0, minStock: 20, unit: 'pieces', costPrice: 2, sellPrice: 4 },
];

const initialMovements = [
  { id: 1, itemId: 1, type: 'in', quantity: 100, notes: 'Monthly restock', date: '2024-01-15', user: 'Admin' },
  { id: 2, itemId: 3, type: 'out', quantity: 20, notes: 'Patient use', date: '2024-01-14', user: 'Dr. Ahmed' },
  { id: 3, itemId: 2, type: 'in', quantity: 50, notes: 'Emergency order', date: '2024-01-13', user: 'Admin' },
];

function Inventory() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  // State
  const [activeTab, setActiveTab] = useState('items');
  const [categories, setCategories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);
  const [movements, setMovements] = useState(initialMovements);

  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: '', nameAr: '', description: '' });
  const [itemForm, setItemForm] = useState({
    barcode: '', name: '', nameAr: '', categoryId: null, quantity: 0, minStock: 0, unit: 'pieces', costPrice: 0, sellPrice: 0
  });
  const [movementForm, setMovementForm] = useState({ itemId: null, type: 'in', quantity: 1, notes: '' });
  const [barcodeForm, setBarcodeForm] = useState({ itemId: null, count: 1 });

  // Options for dropdowns
  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: isRTL ? cat.nameAr : cat.name
  }));

  const itemOptions = items.map(item => ({
    value: item.id,
    label: `${item.barcode} - ${isRTL ? item.nameAr : item.name}`
  }));

  const unitOptions = [
    { value: 'pieces', label: t('inventory.pieces') },
    { value: 'boxes', label: t('inventory.boxes') },
    { value: 'cartons', label: t('inventory.cartons') },
  ];

  // Helper functions
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (isRTL ? cat.nameAr : cat.name) : '-';
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) return 'outOfStock';
    if (item.quantity <= item.minStock) return 'lowStock';
    return 'inStock';
  };

  const generateBarcode = () => {
    const prefix = 'ITM';
    const num = String(Date.now()).slice(-6);
    return `${prefix}${num}`;
  };

  // Category CRUD
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', nameAr: '', description: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, nameAr: cat.nameAr, description: cat.description || '' });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryForm } : c));
    } else {
      setCategories([...categories, { id: Date.now(), ...categoryForm }]);
    }
    setShowCategoryModal(false);
    setCategoryForm({ name: '', nameAr: '', description: '' });
  };

  const handleDeleteCategory = (catId) => {
    if (items.some(item => item.categoryId === catId)) {
      alert(isRTL ? 'لا يمكن حذف فئة تحتوي على أصناف' : 'Cannot delete category with items');
      return;
    }
    setCategories(categories.filter(c => c.id !== catId));
  };

  // Item CRUD
  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      barcode: generateBarcode(),
      name: '', nameAr: '', categoryId: null, quantity: 0, minStock: 0, unit: 'pieces', costPrice: 0, sellPrice: 0
    });
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      barcode: item.barcode,
      name: item.name,
      nameAr: item.nameAr,
      categoryId: item.categoryId,
      quantity: item.quantity,
      minStock: item.minStock,
      unit: item.unit,
      costPrice: item.costPrice,
      sellPrice: item.sellPrice
    });
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...itemForm } : i));
    } else {
      setItems([...items, { id: Date.now(), ...itemForm }]);
    }
    setShowItemModal(false);
    setItemForm({ barcode: '', name: '', nameAr: '', categoryId: null, quantity: 0, minStock: 0, unit: 'pieces', costPrice: 0, sellPrice: 0 });
  };

  const handleDeleteItem = (itemId) => {
    setItems(items.filter(i => i.id !== itemId));
  };

  // Stock Movement
  const handleAddMovement = (type) => {
    setMovementForm({ itemId: null, type, quantity: 1, notes: '' });
    setShowMovementModal(true);
  };

  const handleSaveMovement = () => {
    const item = items.find(i => i.id === movementForm.itemId);
    if (!item) return;

    const newQty = movementForm.type === 'in' 
      ? item.quantity + movementForm.quantity
      : item.quantity - movementForm.quantity;

    if (newQty < 0) {
      alert(isRTL ? 'الكمية غير كافية' : 'Insufficient quantity');
      return;
    }

    // Update item quantity
    setItems(items.map(i => i.id === movementForm.itemId ? { ...i, quantity: newQty } : i));

    // Add movement record
    setMovements([{
      id: Date.now(),
      itemId: movementForm.itemId,
      type: movementForm.type,
      quantity: movementForm.quantity,
      notes: movementForm.notes,
      date: new Date().toISOString().split('T')[0],
      user: 'Current User'
    }, ...movements]);

    setShowMovementModal(false);
  };

  const tabs = [
    { id: 'items', label: t('inventory.items'), icon: Package },
    { id: 'categories', label: t('inventory.categories'), icon: Tag },
    { id: 'movements', label: t('inventory.stockMovements'), icon: ArrowUpDown },
  ];

  // DataTable columns for items
  const itemColumns = [
    { 
      data: 'barcode', 
      title: t('inventory.barcode'),
      render: (data) => `<code class="item-barcode">${data}</code>`
    },
    { 
      data: null, 
      title: t('inventory.itemName'),
      render: (data, type, row) => isRTL ? row.nameAr : row.name
    },
    { 
      data: 'categoryId', 
      title: t('inventory.category'),
      render: (data) => getCategoryName(data)
    },
    { 
      data: 'quantity', 
      title: t('inventory.quantity'),
      render: (data, type, row) => {
        const status = getStockStatus(row);
        const statusClass = status === 'inStock' ? 'success' : status === 'lowStock' ? 'warning' : 'danger';
        return `<span class="badge badge-${statusClass}">${data} ${t('inventory.' + row.unit)}</span>`;
      }
    },
    { data: 'minStock', title: t('inventory.minStock') },
    { 
      data: 'sellPrice', 
      title: t('inventory.sellPrice'),
      render: (data) => `$${data}`
    },
    {
      data: null,
      title: t('invoices.actions'),
      orderable: false,
      render: (data, type, row) => {
        return `<div class="action-btns">
          <button class="icon-btn print-btn" data-id="${row.id}" title="${t('inventory.printBarcode')}">
            <i class="fas fa-print"></i>
          </button>
          <button class="icon-btn edit-btn" data-id="${row.id}" title="${t('common.edit')}">
            <i class="fas fa-pen"></i>
          </button>
          <button class="icon-btn delete-btn" data-id="${row.id}" title="${t('common.delete')}">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
      }
    }
  ];

  // DataTable columns for categories
  const categoryColumns = [
    { 
      data: null, 
      title: t('inventory.itemName'),
      render: (data, type, row) => isRTL ? row.nameAr : row.name
    },
    { data: 'description', title: t('inventory.description') },
    { 
      data: 'id', 
      title: t('inventory.itemCount'),
      render: (data) => {
        const count = items.filter(i => i.categoryId === data).length;
        return `<span class="badge badge-primary">${count}</span>`;
      }
    },
    {
      data: null,
      title: t('invoices.actions'),
      orderable: false,
      render: (data, type, row) => {
        return `<div class="action-btns">
          <button class="icon-btn edit-btn" data-id="${row.id}" title="${t('common.edit')}">
            <i class="fas fa-pen"></i>
          </button>
          <button class="icon-btn delete-btn" data-id="${row.id}" title="${t('common.delete')}">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
      }
    }
  ];

  // DataTable columns for movements
  const movementColumns = [
    { data: 'date', title: t('invoices.date') },
    { 
      data: 'itemId', 
      title: t('inventory.itemName'),
      render: (data) => {
        const item = items.find(i => i.id === data);
        return item ? (isRTL ? item.nameAr : item.name) : '-';
      }
    },
    { 
      data: 'type', 
      title: t('inventory.movementType'),
      render: (data) => {
        const label = data === 'in' ? t('inventory.stockIn') : t('inventory.stockOut');
        const cls = data === 'in' ? 'success' : 'danger';
        return `<span class="badge badge-${cls}">${label}</span>`;
      }
    },
    { 
      data: null, 
      title: t('inventory.quantity'),
      render: (data, type, row) => `${row.type === 'in' ? '+' : '-'}${row.quantity}`
    },
    { data: 'notes', title: t('inventory.notes') }
  ];

  // Handle row clicks for items
  const handleItemRowClick = (item, e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    const printBtn = e.target.closest('.print-btn');
    if (printBtn) {
      const id = parseInt(printBtn.dataset.id);
      setBarcodeForm({ itemId: id, count: 1 });
      setShowBarcodeModal(true);
      return;
    }
    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      const it = items.find(i => i.id === id);
      if (it) handleEditItem(it);
      return;
    }
    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      handleDeleteItem(id);
      return;
    }
  };

  // Handle row clicks for categories
  const handleCategoryRowClick = (cat, e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      const c = categories.find(ct => ct.id === id);
      if (c) handleEditCategory(c);
      return;
    }
    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      handleDeleteCategory(id);
      return;
    }
  };

  return (
    <div className="inventory-page">
      {/* Tab Navigation */}
      <div className="tabs-header">
        <div className="tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="tabs-actions">
          {activeTab === 'categories' && (
            <button className="btn btn-primary" onClick={handleAddCategory}>
              <Plus size={18} />
              {t('inventory.addCategory')}
            </button>
          )}
          {activeTab === 'items' && (
            <>
              <button className="btn btn-ghost" onClick={() => handleAddMovement('in')}>
                <Plus size={18} />
                {t('inventory.addStock')}
              </button>
              <button className="btn btn-ghost" onClick={() => handleAddMovement('out')}>
                <RefreshCw size={18} />
                {t('inventory.removeStock')}
              </button>
              <button className="btn btn-primary" onClick={handleAddItem}>
                <Plus size={18} />
                {t('inventory.addItem')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="tab-content">
          <div className="datatable-container card">
            <CustomDataTable
              data={items}
              columns={itemColumns}
              onRowClick={handleItemRowClick}
            />
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="tab-content">
          <div className="datatable-container card">
            <CustomDataTable
              data={categories}
              columns={categoryColumns}
              onRowClick={handleCategoryRowClick}
            />
          </div>
        </div>
      )}

      {/* Movements Tab */}
      {activeTab === 'movements' && (
        <div className="tab-content">
          <div className="datatable-container card">
            <CustomDataTable
              data={movements}
              columns={movementColumns}
            />
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? t('inventory.editCategory') : t('inventory.addCategory')}</h2>
              <button className="close-btn" onClick={() => setShowCategoryModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('inventory.itemName')} (English)</label>
                <input
                  type="text"
                  className="input"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{t('inventory.itemName')} (عربي)</label>
                <input
                  type="text"
                  className="input"
                  value={categoryForm.nameAr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{t('inventory.description')}</label>
                <textarea
                  className="input"
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCategoryModal(false)}>
                {t('common.cancel')}
              </button>
              <button className="btn btn-primary" onClick={handleSaveCategory}>
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? t('inventory.editItem') : t('inventory.addItem')}</h2>
              <button className="close-btn" onClick={() => setShowItemModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>{t('inventory.barcode')}</label>
                  <div className="barcode-input">
                    <input
                      type="text"
                      className="input"
                      value={itemForm.barcode}
                      onChange={(e) => setItemForm({ ...itemForm, barcode: e.target.value })}
                    />
                    <button className="btn btn-ghost btn-sm" onClick={() => setItemForm({ ...itemForm, barcode: generateBarcode() })}>
                      {t('inventory.generateBarcode')}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('inventory.category')}</label>
                  <CustomSelect
                    options={categoryOptions}
                    value={categoryOptions.find(c => c.value === itemForm.categoryId) || null}
                    onChange={(opt) => setItemForm({ ...itemForm, categoryId: opt?.value || null })}
                    placeholder={t('inventory.selectCategory')}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('inventory.itemName')} (English)</label>
                  <input
                    type="text"
                    className="input"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('inventory.itemName')} (عربي)</label>
                  <input
                    type="text"
                    className="input"
                    value={itemForm.nameAr}
                    onChange={(e) => setItemForm({ ...itemForm, nameAr: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('inventory.quantity')}</label>
                  <input
                    type="number"
                    className="input"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('inventory.minStock')}</label>
                  <input
                    type="number"
                    className="input"
                    value={itemForm.minStock}
                    onChange={(e) => setItemForm({ ...itemForm, minStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('inventory.unit')}</label>
                  <CustomSelect
                    options={unitOptions}
                    value={unitOptions.find(u => u.value === itemForm.unit) || unitOptions[0]}
                    onChange={(opt) => setItemForm({ ...itemForm, unit: opt?.value || 'pieces' })}
                    placeholder={t('inventory.selectUnit')}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('inventory.costPrice')}</label>
                  <input
                    type="number"
                    className="input"
                    step="0.01"
                    value={itemForm.costPrice}
                    onChange={(e) => setItemForm({ ...itemForm, costPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('inventory.sellPrice')}</label>
                  <input
                    type="number"
                    className="input"
                    step="0.01"
                    value={itemForm.sellPrice}
                    onChange={(e) => setItemForm({ ...itemForm, sellPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowItemModal(false)}>
                {t('common.cancel')}
              </button>
              <button className="btn btn-primary" onClick={handleSaveItem}>
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Movement Modal */}
      {showMovementModal && (
        <div className="modal-overlay" onClick={() => setShowMovementModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{movementForm.type === 'in' ? t('inventory.addStock') : t('inventory.removeStock')}</h2>
              <button className="close-btn" onClick={() => setShowMovementModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('inventory.itemName')}</label>
                <CustomSelect
                  options={itemOptions}
                  value={itemOptions.find(i => i.value === movementForm.itemId) || null}
                  onChange={(opt) => setMovementForm({ ...movementForm, itemId: opt?.value || null })}
                  placeholder={t('inventory.selectItem')}
                />
              </div>
              {movementForm.itemId && (
                <div className="current-stock-info">
                  <span>{t('inventory.currentStock')}: </span>
                  <strong>{items.find(i => i.id === movementForm.itemId)?.quantity || 0}</strong>
                </div>
              )}
              <div className="form-group">
                <label>{t('inventory.quantity')}</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="form-group">
                <label>{t('inventory.notes')}</label>
                <textarea
                  className="input"
                  rows={2}
                  value={movementForm.notes}
                  onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowMovementModal(false)}>
                {t('common.cancel')}
              </button>
              <button 
                className={`btn ${movementForm.type === 'in' ? 'btn-success' : 'btn-warning'}`}
                onClick={handleSaveMovement}
                disabled={!movementForm.itemId}
              >
                {movementForm.type === 'in' ? t('inventory.stockIn') : t('inventory.stockOut')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Barcode Modal */}
      {showBarcodeModal && (
        <div className="modal-overlay" onClick={() => setShowBarcodeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('inventory.printBarcode')}</h2>
              <button className="close-btn" onClick={() => setShowBarcodeModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('inventory.itemName')}</label>
                <CustomSelect
                  options={itemOptions}
                  value={itemOptions.find(i => i.value === barcodeForm.itemId) || null}
                  onChange={(opt) => setBarcodeForm({ ...barcodeForm, itemId: opt?.value || null })}
                  placeholder={t('inventory.selectItem')}
                />
              </div>
              {barcodeForm.itemId && (
                <div className="barcode-preview">
                  <code className="barcode-display">{items.find(i => i.id === barcodeForm.itemId)?.barcode}</code>
                  <span className="item-name-preview">{isRTL ? items.find(i => i.id === barcodeForm.itemId)?.nameAr : items.find(i => i.id === barcodeForm.itemId)?.name}</span>
                </div>
              )}
              <div className="form-group">
                <label>{t('inventory.barcodeCount')}</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="100"
                  value={barcodeForm.count}
                  onChange={(e) => setBarcodeForm({ ...barcodeForm, count: Math.min(100, Math.max(1, parseInt(e.target.value) || 1)) })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowBarcodeModal(false)}>
                {t('common.cancel')}
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const item = items.find(i => i.id === barcodeForm.itemId);
                  if (!item) return;
                  
                  const printWindow = window.open('', '_blank', 'width=600,height=800');
                  const barcodes = Array(barcodeForm.count).fill(null).map(() => `
                    <div class="barcode-item">
                      <div class="barcode-code">${item.barcode}</div>
                      <div class="barcode-name">${isRTL ? item.nameAr : item.name}</div>
                      <div class="barcode-price">$${item.sellPrice}</div>
                    </div>
                  `).join('');
                  
                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>${t('inventory.printBarcode')}</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .barcode-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
                        .barcode-item { border: 1px dashed #ccc; padding: 10px; text-align: center; }
                        .barcode-code { font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px; margin-bottom: 5px; }
                        .barcode-name { font-size: 12px; color: #666; margin-bottom: 3px; }
                        .barcode-price { font-size: 14px; font-weight: bold; color: #2A7CFF; }
                        @media print { .no-print { display: none; } }
                      </style>
                    </head>
                    <body>
                      <div class="barcode-grid">${barcodes}</div>
                      <div class="no-print" style="margin-top: 20px; text-align: center;">
                        <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
                          ${t('invoices.print')}
                        </button>
                      </div>
                    </body>
                    </html>
                  `);
                  printWindow.document.close();
                  setShowBarcodeModal(false);
                }}
                disabled={!barcodeForm.itemId}
              >
                <Printer size={18} />
                {t('inventory.printBarcode')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
