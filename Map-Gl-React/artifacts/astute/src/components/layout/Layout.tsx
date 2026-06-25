import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CommandPalette from '../command/CommandPalette';

export default function Layout() {
  return (
    <div className="noise" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <CommandPalette />
      <main style={{ flex: 1, paddingTop: 76 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
