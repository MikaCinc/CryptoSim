import { useState, useEffect } from 'react';
import LineGraph from 'react-line-graph';
import { Line } from 'react-chartjs-2';
import _ from 'lodash';

// import logo from './logo.svg';
import './App.css';

const config = {
  defaultRiseChance: 60,
  bullRiseChance: 90,
  bearRiseChance: 33,
  seasons: ['bull', 'bear', 'normal']
}

const App = () => {

  const [id, setId] = useState(2);
  const [selected, setSelected] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [coins, setCoins] = useState([{
    id: 1,
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
    if (rand < 5) setSeason(config.seasons[Math.floor(Math.random() * config.seasons.length)]); // Promena sezone

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
        id,
        title: "ALT Coin #" + (id),
        nick: "AC" + (id),
        value: getRandom(1, 100),
        history: []
      }];

      setId((curr) => curr + 1);
    } else if (rand === 40) { // Povlacenje sa marketa
      // let randomAltCoin = getRandom(1, coins.length - 2);

      // newValues = [...newValues.filter((c, index) => index !== randomAltCoin)];
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

  const renderSelected = () => {
    const coin = coins.filter(c => c.id === selected)[0];
    if (!coin || !coin.id) return <p>No data availible</p>;

    const { title, nick, value, history } = coin;

    const last100 = history.slice(history.length - 200 > 0 ? history.length - 200 : 0, history.length);
    const data = {
      labels: [...last100.map((i, index) => index + 1)],
      datasets: [
        {
          label: title + "'s value",
          data: last100,
          fill: false,
          backgroundColor: '#0000ff',
          borderColor: '#00ff00',
          color: '#fff',
          animation: false
        },
      ],
    };
    return (
      <div key={nick}>
        {/* <h2>{title}</h2>
        <h1>{value}</h1> */}
        {!!history.length && <Line
          data={data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              xAxes: [{
                ticks: { display: false },
                gridLines: {
                  display: false,
                  drawBorder: false
                }
              }],
              yAxes: [{
                ticks: { display: false },
                gridLines: {
                  display: false,
                  drawBorder: false
                }
              }]
            }
          }}
        />}
      </div>
    )
  }

  return (
    <div className="App">
      <div className="TopBar">
        <button onClick={() => setIsRunning(true)}>Play</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
      </div>
      <div className="Page">
        <div className="Sidebar">
          {
            coins.map(({ id, title, nick, value }, index) => {
              return <div
                className={`CoinCard ${selected === id ? 'selected' : ''}`}
                key={nick + index}
                onClick={() => setSelected(id)}
              >
                <h2>{title}</h2>
                <h1>{value}</h1>
              </div>
            })
          }
        </div>
        <div className="View">
          {renderSelected()}
        </div>
      </div>
    </div>
  );
}

export default App;
