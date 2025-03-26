import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Страница не найдена</h2>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        Извините, запрашиваемая страница не существует.
      </p>
    </div>
  );
};

export default NotFound; 