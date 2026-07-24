function Header() {
  return (
    <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <h1>Product Catalog</h1>
      <nav>
        <a href="#">Home</a> |{" "}
        <a href="#">Products</a> |{" "}
        <a href="#">About</a>
      </nav>
    </header>
  )
}

export default Header