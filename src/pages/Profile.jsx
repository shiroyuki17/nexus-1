import SimplePage from './_SimplePage.jsx';

export default function Profile() {
  return <SimplePage title="Profile" entity="users" columns={[{ key: 'username', label: 'Username' }, { key: 'rank', label: 'Rank' }, { key: 'balance', label: 'Balance' }, { key: 'points', label: 'Points' }]} />;
}
