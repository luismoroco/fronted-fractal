import './App.css';
import { OrdersPage } from './pages/OrderPage';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { ProductsPages } from './pages/ProductPage';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/products' element={<ProductsPages />} />
          <Route path='/orders' element={<OrdersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;