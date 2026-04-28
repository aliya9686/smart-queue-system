import { useParams } from 'react-router-dom';

export function QueueStatusPage() {
  const { tokenId } = useParams<{ tokenId: string }>();

  return (
    <section className="panel">
      <h2>Queue Status Screen</h2>
      <p>Placeholder route for customer token tracking.</p>
      <p>
        Sample token id: <strong>{tokenId}</strong>
      </p>
    </section>
  );
}
