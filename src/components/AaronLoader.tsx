import './AaronLoader.css';
/** Aaron's own CSS sprite loader (from aaron-css-loader/), ported to TypeScript. 10-frame strip, steps() run cycle. */
export default function AaronLoader({ size = 240, label = 'Loading', shadow = true }: { size?: number; label?: string; shadow?: boolean }) {
  return (
    <div className="aaron-loader" role="status" aria-label={label}>
      <span className="aaron-loader__viewport" style={{ ['--loader-size' as string]: `${size}px` }} aria-hidden="true">
        {shadow && <span className="aaron-loader__shadow" />}
        <img className="aaron-loader__strip" src="/aaron-run-sprite.png" width="3970" height="397" alt="" loading="eager" fetchPriority="high" />
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
