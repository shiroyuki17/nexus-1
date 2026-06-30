import SimplePage from './_SimplePage.jsx';

export default function FoodDrinks() {
  return <SimplePage title="Food & Drinks" entity="products" columns={[{ key: 'name', label: 'Name' }, { key: 'category', label: 'Category' }, { key: 'price', label: 'Price' }, { key: 'available', label: 'Available' }]} />;
}
