import SimplePage from './_SimplePage.jsx';

export default function Admin() {
  return <SimplePage title="Admin" entity="transactions" columns={[{ key: 'user_id', label: 'User' }, { key: 'type', label: 'Type' }, { key: 'amount', label: 'Amount' }, { key: 'balance_after', label: 'Balance After' }]} />;
}
