import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PublicPageCta({ eyebrow, title, description, image, actions }) {
  return <section className="public-page-cta" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 17, 42, .96), rgba(5, 17, 42, .48)), url(${image})` }}>
    <div><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p><div className="public-page-cta-actions">{actions.map(action => <Link key={action.to} to={action.to}>{action.label}<ArrowUpRight size={17} /></Link>)}</div></div>
  </section>;
}
