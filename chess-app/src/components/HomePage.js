import React from 'react';

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to the Chess App</h1>
      <p text-6xl>Select an option from the navigation bar to get started.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
};

export default HomePage;
