import logo from './logo.svg';
import './App.css';
import React from 'react';
import PlayerSearch from './components/PlayerSearch';
import TeamSearch from './components/TeamSearch';

const App = () => {
  return (
    <div>
      <PlayerSearch />
      <TeamSearch />
    </div>
  );
}

export default App;
