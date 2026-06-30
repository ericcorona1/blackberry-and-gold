import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Menu } from "@/pages/Menu";
import { OrderStatus } from "@/pages/OrderStatus";
import { Admin } from "@/pages/Admin";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
