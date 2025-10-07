import Block from './Block';

interface BlockchainListProps {
  blocks: any[];
}

const BlockchainList = ({ blocks }: BlockchainListProps) => {
  return (
    <div>
      {blocks.map((block) => (
        <Block key={block.index} {...block} />
      ))}
    </div>
  );
};

export default BlockchainList;
