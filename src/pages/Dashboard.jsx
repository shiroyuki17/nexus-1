import SimplePage from './_SimplePage.jsx';

export default function Dashboard() {
  return <SimplePage title="Dashboard" entity="pcs" columns={[{ key: 'pc_number', label: 'PC' }, { key: 'zone', label: 'Zone' }, { key: 'status', label: 'Status' }]} />;
}
