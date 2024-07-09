import { CSSProperties } from 'react';

export const container: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
  backgroundColor: 'var(--base-color)',
};

export const inner: CSSProperties = {
  width: '300px',
  height: '30px',
  backgroundColor: '#2a2a2a',
  borderRadius: '20px',
  padding: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
};

export const bar: CSSProperties = {
  height: '100%',
  width: '0%',
  backgroundColor: 'var(--col1)',
  borderRadius: '25px',
  transition: 'width 0.3s ease-in-out',
};

export const data: CSSProperties = {
  color: 'var(--col2)',
  fontSize: '18px',
  fontWeight: 'bold',
  marginTop: '0',
  textAlign: 'center',
};
