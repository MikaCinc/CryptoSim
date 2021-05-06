import { useState, useEffect } from 'react';
import LineGraph from 'react-line-graph';
import { Line } from 'react-chartjs-2';

// import logo from './logo.svg';
import './App.css';

const config = {
  defaultRiseChance: 60,
  bullRiseChance: 90,
  bearRiseChance: 33,
  seasons: ['bull', 'bear', 'normal']
}

const App = () => {

  const [id, setId] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [coins, setCoins] = useState([{
    title: "MASTER COIN",
    nick: "MSC",
    value: 0,
    history: []
  }]);
  const [season, setSeason] = useState('bull');
  const [riseChance, setRiseChance] = useState(config.defaultRiseChance);

  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const master = () => {
    let rand = Math.floor(Math.random() * 100);
    if (rand < 20) setSeason(config.seasons[Math.floor(Math.random() * config.seasons.length)]); // Promena sezone

    let newValues = [...coins].map(c => {
      const randInner = getRandom(0, 100);
      let newNum = c.value;
      let fraction = Math.random() * 5;
      if (randInner < riseChance) {
        newNum = newNum + fraction;
      } else {
        newNum -= fraction;
      }
      if ([50, 60, 70].indexOf(randInner) !== -1) newNum += newNum * 10 / 100; // Iznenadni rast
      if ([20, 30, 40].indexOf(randInner) !== -1) newNum -= newNum * 10 / 100; // Iznenadni pad

      newNum = +newNum.toFixed(3);
      if (newNum <= 0) newNum = 0;

      return {
        ...c,
        value: newNum,
        history: [...c.history, newNum]
      };
    });

    if (rand === 50) {
      newValues = [...newValues, {
        title: "ALT Coin #" + (id),
        nick: "AC" + (id),
        value: getRandom(1, 100),
        history: []
      }];

      setId((curr) => curr + 1);
    } else if (rand === 40) {
      let randomAltCoin = getRandom(1, coins.length - 2);

      newValues = [...newValues.filter((c, index) => index !== randomAltCoin)];
    }

    setCoins(newValues);
  };

  useEffect(() => {
    console.log(season);
    switch (season) {
      case 'bull': setRiseChance(config.bullRiseChance); break;
      case 'bear': setRiseChance(config.bearRiseChance); break;
      case 'normal': setRiseChance(config.defaultRiseChance); break;
      default: setRiseChance(config.defaultRiseChance);
    }

  }, [season]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        master();
      }, 100);
    }
    return () => clearInterval(interval);

  }, [isRunning, coins, season, riseChance]);

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}

      <div>
        {
          coins.map(({ title, nick, value, history }) => {
            const last100 = history.slice(history.length - 200, history.length);
            const data = {
              labels: [...last100.map((i, index) => index + 1)],
              datasets: [
                {
                  label: title + "'s value",
                  data: last100,
                  fill: false,
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgba(255, 99, 132, 0.2)',
                  animation: false
                },
              ],
            };

            return <div key={nick}>
              <h2>{title}</h2>
              <h1>{value}</h1>
              {!!history.length && <Line data={data} />}
            </div>
          })
        }
        <button onClick={() => setIsRunning(true)}>Play</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
      </div>
    </div>
  );
}

export default App;
