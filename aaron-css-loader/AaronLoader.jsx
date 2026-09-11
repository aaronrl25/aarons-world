import "./AaronLoader.css";

export default function AaronLoader({ size = 240, label = "Loading" }) {
  return (
    <div className="aaron-loader" role="status" aria-label={label}>
      <span
        className="aaron-loader__viewport"
        style={{ "--loader-size": `${size}px` }}
        aria-hidden="true"
      >
        <img
          className="aaron-loader__strip"
          src="/aaron-run-sprite.png"
          width="3970"
          height="397"
          alt=""
        />
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
