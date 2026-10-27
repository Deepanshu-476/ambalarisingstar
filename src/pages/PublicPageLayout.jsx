export default function PublicPageLayout({ eyebrow, title, accent, description, heroImage, children }) {
  return (
    <main className="public-page">
      <section className="public-page-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 17, 42, .96) 0%, rgba(5, 17, 42, .78) 48%, rgba(5, 17, 42, .22) 100%), url(${heroImage})` }}>
        <div className="public-page-orbit public-page-orbit-one" aria-hidden="true" />
        <div className="public-page-orbit public-page-orbit-two" aria-hidden="true" />
        <div className="public-page-hero-copy">
          <p className="public-page-kicker"><span />{eyebrow}</p>
          <h1>{title} {accent && <em>{accent}</em>}</h1>
          <span className="public-page-description">{description}</span>
        </div>
        <div className="public-page-hero-stamp"><span>CDS</span><small>PREMIER CRICKET LEAGUE</small></div>
      </section>
      <section className="public-page-content">{children}</section>
    </main>
  );
}
