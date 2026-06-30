import SimplePage from './_SimplePage.jsx';

export default function Reservations() {
  return <SimplePage title="Reservations" entity="reservations" columns={[{ key: 'user_name', label: 'User' }, { key: 'pc_number', label: 'PC' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' }]} />;
}
