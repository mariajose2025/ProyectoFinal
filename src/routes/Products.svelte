<script>
  import { onMount } from 'svelte';
  import { getAll, create, update, remove } from '../services/firestoreService';
  import { currentUser } from '../stores/auth';
  import { isAdmin } from '../utils/permissions';
  import { alertThresholds } from '../stores/app';
  import { calculateStockAlert, calculateExpiryAlert, getDaysUntilExpiry } from '../utils/alerts';
  import { formatCurrency } from '../utils/iva';
  import AlertBadge from '../components/common/AlertBadge.svelte';
  import Button from '../components/common/Button.svelte';
  import Modal from '../components/common/Modal.svelte';
  import Toast from '../components/common/Toast.svelte';

  let products = [];
  let categories = [];
  let suppliers = [];
  let showModal = false;
  let editingProduct = null;
  let formData = {
    name: '', categoryId: '', purchasePrice: 0, salePrice: 0,
    currentStock: 0, minimumStock: 0, expiryDate: '', supplierId: ''
  };
  let loading = false;
  let toast = { show: false, message: '', type: 'info' };

  $: thresholds = $alertThresholds;

  onMount(async () => {
    const [p, c, s] = await Promise.all([
      getAll('products'), getAll('categories'), getAll('suppliers')
    ]);
    products = p;
    categories = c;
    suppliers = s;
  });

  function openModal(product = null) {
    editingProduct = product;
    if (product) {
      formData = {
        name: product.name,
        categoryId: product.categoryId || '',
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        currentStock: product.currentStock,
        minimumStock: product.minimumStock,
        expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
        supplierId: product.supplierId || ''
      };
    } else {
      formData = { name: '', categoryId: '', purchasePrice: 0, salePrice: 0, currentStock: 0, minimumStock: 0, expiryDate: '', supplierId: '' };
    }
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingProduct = null;
  }

  async function saveProduct() {
    if (!formData.name.trim()) {
      toast = { show: true, message: 'El nombre es obligatorio', type: 'warning' };
      return;
    }

    loading = true;
    const data = {
      ...formData,
      purchasePrice: Number(formData.purchasePrice),
      salePrice: Number(formData.salePrice),
      currentStock: Number(formData.currentStock),
      minimumStock: Number(formData.minimumStock),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null
    };

    try {
      if (editingProduct) {
        await update('products', editingProduct.id, data);
        toast = { show: true, message: 'Producto actualizado', type: 'success' };
      } else {
        await create('products', data);
        toast = { show: true, message: 'Producto registrado', type: 'success' };
      }
      closeModal();
      products = await getAll('products');
    } catch (e) {
      toast = { show: true, message: 'Error al guardar', type: 'error' };
    }
    loading = false;
  }

  async function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    loading = true;
    try {
      await remove('products', id);
      toast = { show: true, message: 'Producto eliminado', type: 'success' };
      products = await getAll('products');
    } catch (e) {
      toast = { show: true, message: 'Error al eliminar', type: 'error' };
    }
    loading = false;
  }

  function getCategoryName(id) {
    return categories.find(c => c.id === id)?.name || '—';
  }

  function getSupplierName(id) {
    return suppliers.find(s => s.id === id)?.name || '—';
  }
</script>

<div class="page">
  <div class="page-header">
    <h1>Productos</h1>
    {#if isAdmin($currentUser)}
      <Button on:click={() => openModal()}>+ Nuevo</Button>
    {/if}
  </div>

  <div class="products-list">
    {#each products as product}
      {@const stockAlert = calculateStockAlert(product.currentStock, product.minimumStock)}
      {@const expiryAlert = product.expiryDate ? calculateExpiryAlert(product.expiryDate, thresholds) : 'green'}
      {@const daysLeft = product.expiryDate ? getDaysUntilExpiry(product.expiryDate) : null}

      <div class="product-card">
        <div class="product-header">
          <h3>{product.name}</h3>
          <div class="alerts">
            <AlertBadge level={stockAlert} text="Stock: {product.currentStock}" />
            {#if daysLeft !== null}
              <AlertBadge level={expiryAlert} text="{daysLeft}d para vencer" />
            {/if}
          </div>
        </div>

        <div class="product-details">
          <div class="detail">
            <span class="detail-label">Categoría</span>
            <span class="detail-value">{getCategoryName(product.categoryId)}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Proveedor</span>
            <span class="detail-value">{getSupplierName(product.supplierId)}</span>
          </div>
          <div class="detail">
            <span class="detail-label">P. Compra</span>
            <span class="detail-value">{formatCurrency(product.purchasePrice)}</span>
          </div>
          <div class="detail">
            <span class="detail-label">P. Venta</span>
            <span class="detail-value">{formatCurrency(product.salePrice)}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Stock Mín.</span>
            <span class="detail-value">{product.minimumStock}</span>
          </div>
          {#if daysLeft !== null}
            <div class="detail">
              <span class="detail-label">Vence</span>
              <span class="detail-value">{new Date(product.expiryDate).toLocaleDateString('es-CO')}</span>
            </div>
          {/if}
        </div>

        {#if isAdmin($currentUser)}
          <div class="product-actions">
            <button class="btn-icon edit" on:click={() => openModal(product)}><i class="fa-solid fa-pen"></i></button>
            <button class="btn-icon delete" on:click={() => deleteProduct(product.id)}><i class="fa-solid fa-trash"></i></button>
          </div>
        {/if}
      </div>
    {:else}
      <p class="empty">No hay productos registrados</p>
    {/each}
  </div>
</div>

<Modal show={showModal} title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'} on:close={closeModal} size="large">
  <div class="form-row">
    <div class="form-group">
      <label for="name">Nombre *</label>
      <input id="name" type="text" bind:value={formData.name} placeholder="Nombre del producto" />
    </div>
    <div class="form-group">
      <label for="category">Categoría</label>
      <select id="category" bind:value={formData.categoryId}>
        <option value="">Seleccionar...</option>
        {#each categories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="purchasePrice">Precio Compra *</label>
      <input id="purchasePrice" type="number" bind:value={formData.purchasePrice} min="0" />
    </div>
    <div class="form-group">
      <label for="salePrice">Precio Venta *</label>
      <input id="salePrice" type="number" bind:value={formData.salePrice} min="0" />
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="stock">Stock Actual</label>
      <input id="stock" type="number" bind:value={formData.currentStock} min="0" />
    </div>
    <div class="form-group">
      <label for="minStock">Stock Mínimo</label>
      <input id="minStock" type="number" bind:value={formData.minimumStock} min="0" />
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="expiry">Fecha de Vencimiento</label>
      <input id="expiry" type="date" bind:value={formData.expiryDate} />
    </div>
    <div class="form-group">
      <label for="supplier">Proveedor</label>
      <select id="supplier" bind:value={formData.supplierId}>
        <option value="">Seleccionar...</option>
        {#each suppliers as sup}
          <option value={sup.id}>{sup.name}</option>
        {/each}
      </select>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={closeModal}>Cancelar</Button>
    <Button on:click={saveProduct} {loading}>{editingProduct ? 'Actualizar' : 'Crear'}</Button>
  </svelte:fragment>
</Modal>

<Toast show={toast.show} message={toast.message} type={toast.type} on:close={() => toast.show = false} />

<style>
  .page { padding: 1.25rem; padding-top: 5rem; }
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .page-header h1 { font-size: 1.3rem; color: #110F0F; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
  .page-header h1 i { color: #B31A1A; }

  .products-list { display: flex; flex-direction: column; gap: 0.75rem; }

  .product-card {
    background: white; border-radius: 12px; padding: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .product-header {
    display: flex; flex-direction: column; gap: 0.5rem;
    padding-right: 4rem;
  }
  .product-header h3 { margin: 0; font-size: 1rem; color: #110F0F; }

  .alerts { display: flex; gap: 0.35rem; flex-wrap: wrap; }

  .product-details {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .detail { display: flex; flex-direction: column; }
  .detail-label { font-size: 0.7rem; color: #9ca3af; text-transform: uppercase; }
  .detail-value { font-size: 0.85rem; color: #374151; font-weight: 500; }

  .product-actions {
    position: absolute; top: 0.75rem; right: 0.75rem;
    display: flex; gap: 0.25rem;
  }

  .btn-icon {
    background: none; border: none; cursor: pointer; font-size: 0.95rem;
    padding: 0.4rem; border-radius: 6px; width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
  }
  .btn-icon.edit { color: #C49A45; }
  .btn-icon.edit:hover { background: #FEF3C7; }
  .btn-icon.delete { color: #B31A1A; }
  .btn-icon.delete:hover { background: #FEE2E2; }

  .empty { text-align: center; color: #9ca3af; padding: 2rem; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .form-group { margin-bottom: 0.85rem; }
  label { display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 600; color: #110F0F; }
  input, select {
    width: 100%; padding: 0.7rem; border: 1.5px solid #d1d5db;
    border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; background: white;
  }
  input:focus, select:focus { outline: none; border-color: #B31A1A; }

  @media (min-width: 480px) {
    .product-details { grid-template-columns: repeat(3, 1fr); }
  }

  @media (min-width: 768px) {
    .product-details { grid-template-columns: repeat(6, 1fr); }
  }
</style>
