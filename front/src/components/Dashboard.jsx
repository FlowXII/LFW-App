import React from 'react';
import withAuth from './withAuth';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // State variables can be added here
    };
  }

  render() {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard. Functionality isn't ready yet. Explore other vues. </p>
        {/* Unused Login Buttons */}
        <button style={{ display: 'none' }}>Login</button>
        <button style={{ display: 'none' }}>Sign Up</button>
        {/* Dashboard Content */}
      </div>
    );
  }
}

export default withAuth(Dashboard);