import logo from './logo.svg';
import './App.css';
import React from 'react';
import PlayerSearch from './components/PlayerSearch';
import TeamSearch from './components/TeamSearch';
import ResponsiveAppBar from './components/AppBar';

const App = () => {
  return (
    <div>
      <ResponsiveAppBar />
      {/* <PlayerSearch />
      <TeamSearch /> */}
    </div>
  );
}

export default App;
