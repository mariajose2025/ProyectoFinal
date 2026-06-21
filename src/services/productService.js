import * as firestore from './firestoreService';

const COLLECTION = 'products';

export async function getAllProducts() {
  return firestore.getAll(COLLECTION);
}

export async function getProductById(id) {
  return firestore.getById(COLLECTION, id);
}

export async function createProduct(data) {
  return firestore.create(COLLECTION, data);
}

export async function updateProduct(id, data) {
  return firestore.update(COLLECTION, id, data);
}

export async function deleteProduct(id) {
  return firestore.remove(COLLECTION, id);
}

export async function getProductsByCategory(categoryId) {
  return firestore.getByField(COLLECTION, 'categoryId', categoryId);
}

export async function updateProductStock(id, newStock) {
  return firestore.update(COLLECTION, id, { currentStock: newStock });
}

export async function updateProductPrice(id, newPurchasePrice) {
  return firestore.update(COLLECTION, id, { purchasePrice: newPurchasePrice });
}
