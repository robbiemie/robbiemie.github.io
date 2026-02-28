export const GameVisualPanel = ({ className }: { className?: string }) => (
  <div className={className ? `knowledge-visual ${className}` : 'knowledge-visual'} aria-hidden="true">
    <span className="coin coin-one" />
    <span className="coin coin-two" />
    <span className="coin coin-three" />
    <span className="pipe-top" />
    <span className="pipe-body" />
  </div>
);
