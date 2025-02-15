import logo from './logo.svg';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
    <ToastContainer />
    <Header />
    <main className="flex-grow overflow-hidden">
      <Outlet />
    </main>
    <Footer/>
  </div>
  );
}

export default App;
