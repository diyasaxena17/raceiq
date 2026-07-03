import { NavLink } from "react-router-dom"

const links = [
  { label: "Strategy", to: "/strategy" },
  { label: "Forecast", to: "/forecast" },
  { label: "Method", to: "/methodology" },
]

export function AppNav() {
  return (
    <nav className="top-nav" aria-label="Primary navigation">
      <NavLink className="brand-mark" to="/" aria-label="RaceIQ home">
        <span />
        RaceIQ
      </NavLink>
      <div className="nav-links">
        {links.map((link) => (
          <NavLink
            className={({ isActive }) => (isActive ? "is-active" : undefined)}
            key={link.to}
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
