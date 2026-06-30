import SimplePage from './_SimplePage.jsx';

export default function PCStatus() {
  return <SimplePage title="PC Status" entity="pcs" columns={[{ key: 'pc_number', label: 'PC' }, { key: 'zone', label: 'Zone' }, { key: 'status', label: 'Status' }, { key: 'hourly_rate', label: 'Rate' }]} />;
}
