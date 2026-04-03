import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { useAppStore } from './store/appStore';

function App() {
  const { currentPage } = useAppStore();

  let PageComponent: React.ReactNode = null;
  switch (currentPage) {
    case 'builder':
      PageComponent = <Builder />;
      break;
    case 'chat':
      PageComponent = <Chat />;
      break;
    case 'settings':
      PageComponent = <Settings />;
      break;
    case 'profile':
      PageComponent = <Profile />;
      break;
    case 'dashboard':
    default:
      PageComponent = <Dashboard />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-color)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto relative">
          {PageComponent}
        </main>
      </div>
    </div>
  );
}

export default App;
