import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Statistics = ({ good, all, neutral, average, positive, bad }) => {
  return (
    <div>
      <StatisticLine text={"good"} statCheck={good} />
      <StatisticLine text={"neutral"} statCheck={neutral} />
      <StatisticLine text={"bad"} statCheck={bad} />
      <StatisticLine statCheck={all} text={"all "} />
      <StatisticLine statCheck={average} text={"average "} />
      <StatisticLine statCheck={positive} text={"positive"} />
    </div>
  );
};

const StatisticLine = ({ text, statCheck }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{statCheck}</td>
        </tr>
      </tbody>
    </table>
  );
};

const Stat = () => {
  return (
    <div>
      <h1>Statistics</h1>
      <p>No feedback given</p>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleClick = (text) => {
    const updatedGood = good + 1;
    if (text === "good") {
      setGood(updatedGood);
    } else if (text === "neutral") {
      setNeutral(neutral + 1);
    } else if (text === "bad") {
      setBad(bad + 1);
    }
    setAll(updatedGood + bad + neutral);
    setAverage((updatedGood + bad + neutral) / 3);
    setPositive((updatedGood / (updatedGood + bad + neutral)) * 100 + "%");
  };
  const feedBackGiven = all < 1;

  return (
    <div>
      <h1>give feedback</h1>

      <Button handleClick={() => handleClick("good")} text={"good"} />
      <Button handleClick={() => handleClick("neutral")} text={"neutral"} />
      <Button handleClick={() => handleClick("bad")} text={"bad"} />
      {feedBackGiven ? (
        <Stat />
      ) : (
        <>
          <Statistics
            good={good}
            bad={bad}
            positive={positive}
            average={average}
            neutral={neutral}
            all={all}
          />
        </>
      )}
    </div>
  );
};

export default App;
