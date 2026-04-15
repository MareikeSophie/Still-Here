import { useState, useEffect } from 'react';
import { moods } from './moods';
import Launcher from './screens/Launcher';
import Homescreen from './screens/Homescreen';
import Feed from './screens/Feed';
import Traces from './screens/Traces';
import Simulation from './screens/Simulation';

// Pick a random mood once when the app loads
const initialMoodIndex = Math.floor(Math.random() * moods.length);

export default function App() {
  const [screen, setScreen] = useState('launcher');
  const mood = moods[initialMoodIndex];

  useEffect(() => {
    const left  = { homescreen: 'simulation', feed: 'homescreen', simulation: 'feed' };
    const right = { homescreen: 'feed',       feed: 'simulation', simulation: 'homescreen' };
    function onKey(e) {
      if (e.key === 'ArrowLeft')  setScreen(s => left[s]  ?? s);
      if (e.key === 'ArrowRight') setScreen(s => right[s] ?? s);
      if (e.key === 'ArrowDown')  setScreen(s => s === 'traces' ? 'feed' : s);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {screen === 'launcher' && (
        <Launcher mood={mood} onOpen={() => setScreen('homescreen')} />
      )}
      {screen === 'homescreen' && (
        <Homescreen
          mood={mood}
          onGoLeft={() => setScreen('feed')}
          onGoRight={() => setScreen('simulation')}
          onGoTraces={() => setScreen('traces')}
        />
      )}
      {screen === 'feed' && (
        <Feed
          mood={mood}
          onGoLeft={() => setScreen('simulation')}
          onGoRight={() => setScreen('homescreen')}
          onGoToTraces={() => setScreen('traces')}
        />
      )}
      {screen === 'traces' && (
        <Traces
          mood={mood}
          onGoUp={() => setScreen('feed')}
        />
      )}
      {screen === 'simulation' && (
        <Simulation
          mood={mood}
          onGoLeft={() => setScreen('homescreen')}
          onGoRight={() => setScreen('feed')}
        />
      )}
    </>
  );
}
