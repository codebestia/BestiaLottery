import logo from './logo.svg';
import './App.css';
import ConnectionContextProvider from './context/ConnectionContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';

function App() {
  return (
    <div className="App">
      <ConnectionContextProvider>
        <Layout>
          <Landing />
        </Layout>
      </ConnectionContextProvider>
    </div>
  );
}

export default App;
