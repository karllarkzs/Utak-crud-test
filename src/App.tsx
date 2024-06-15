import React from 'react';
import Menu from './components/Menu';
import './App.css';
import { Card, Container } from '@mui/material';

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundColor: '#1f1f1f',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <main
        className="App-main"
        style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
      >
        <Container maxWidth="xl">
          <Card
            style={{
              backgroundColor: '#2b2b2b',
              color: '#ffffff',
              borderRadius: '12px',
            }}
          >
            <div style={{ width: '100%', maxWidth: '1200px', margin: 'auto' }}>
              <Menu />
            </div>
          </Card>
        </Container>
      </main>
    </div>
  );
}

export default App;
