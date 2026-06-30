import SimplePage from './_SimplePage.jsx';

export default function Tournaments() {
  return <SimplePage title="Tournaments" entity="tournaments" columns={[{ key: 'title', label: 'Title' }, { key: 'game', label: 'Game' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' }]} />;
}
