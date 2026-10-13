export default function Nav() {
  return (
    <header className="nav">
      <a className="brand" href="#top">
        <span className="brand-mark">RQ</span>
        <span className="brand-name">
          Resume<span>IQ</span>
        </span>
      </a>
      <nav className="nav-links">
        <a href="#analyze">Analyzer</a>
        <a href="#how">How it works</a>
        <a href="#features">Features</a>
      </nav>
      <a className="btn btn-ghost" href="#analyze">
        Check my resume
      </a>
    </header>
  );
}
