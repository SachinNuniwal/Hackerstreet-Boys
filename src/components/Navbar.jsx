import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#f0f0f0" }}>
      <Link to="/">Login</Link> | 
      <Link to="/dashboard"> Dashboard</Link> | 
      <Link to="/events"> Events</Link>
    </nav>
  );
}

export default Navbar;