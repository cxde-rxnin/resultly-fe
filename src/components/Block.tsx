interface BlockProps {
  index: number;
  timestamp: string;
  data: any;
  previousHash: string;
  hash: string;
}

const Block = ({ index, timestamp, data, previousHash, hash }: BlockProps) => {
  return (
    <div className="border rounded p-4 mb-4">
      <p><strong>Index:</strong> {index}</p>
      <p><strong>Timestamp:</strong> {timestamp}</p>
      <p><strong>Data:</strong> {JSON.stringify(data)}</p>
      <p><strong>Previous Hash:</strong> {previousHash}</p>
      <p><strong>Hash:</strong> {hash}</p>
    </div>
  );
};

export default Block;
