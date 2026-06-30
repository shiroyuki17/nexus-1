import SimplePage from './_SimplePage.jsx';

export default function Games() {
  return <SimplePage title="Game Library" entity="games" columns={[{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'popularity', label: 'Popularity' }]} />;
}
