import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import COLORS from './data/colors.json';
import VALID_STATUS_CODES from './data/validStatusCodes.json';

const DEFAULT_STATUS = '418'; // default status code
const Cat = () => {
  const navigate = useNavigate();

  // initialize the statusChange from localStorage or default to 418
  const initialStatus = localStorage.getItem('statusCode') || DEFAULT_STATUS;
  const [colorIdx, setColorIdx] = useState(0);
  const [delayChange, setDelayChange] = useState(5000);
  const [statusChange, setStatusChange] = useState(initialStatus); // use initial value from localStorage
  const [delay, setDelay] = useState('');
  const [status, setStatus] = useState('');

  // Update localStorage whenever statusChange is updated
  useEffect(() => {
    localStorage.setItem('statusCode', statusChange);

    // Set a timer to reset the statusCode to default after 10 minutes (600000ms) of inactivity
    const timer = setTimeout(() => {
      setStatusChange(DEFAULT_STATUS);  // Reset to default status code
    }, 600000); // 10 minutes = 600,000 milliseconds

    // Cleanup the timer if the component unmounts or if statusChange updates (reset the timer)
    return () => clearTimeout(timer);
  }, [statusChange]);

  // useEffect to update color index every delayChange seconds
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIdx((prevIdx) => {
        const newIdx = ++prevIdx % COLORS.length;
        return newIdx;
      });
    }, delayChange);
  
    return () => clearInterval(colorInterval);
  }, [delayChange]);
  
  const handleDelaySubmit = (e) => {
    e.preventDefault();

    if (delay < 1 || delay > 10) {
      alert('Please enter a delay from 1 through 10!');
      return;
    }

    setDelayChange(Number(delay) * 1000);
    setDelay('');
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();

    if (status === '') {
      alert('Please Enter A Code');
      setStatusChange(404);
      return;
    }

    if (!VALID_STATUS_CODES.includes(Number(status))) {
      alert(
        `Code ${status} might exist, but it is not a proper Cat Status code.`
      );
      setStatusChange(404);
      return;
    }

    setStatusChange(status); // Update statusChange state, which will persist in localStorage
    setStatus('');
  };

  return (
    <div
      className="cat-container"
      style={{
        backgroundColor: COLORS[colorIdx],
        transition: 'background-color 1s',
      }}
    >
      <h1>Cat Status</h1>
      <button onClick={() => navigate('/')}>Home</button>
      <div className="image-container">
        <img
          src={`https://http.cat/${statusChange}`}
          alt="404" // Tests will fail if you change `alt`
        />
      </div>
      <form onSubmit={handleDelaySubmit}>
        <label htmlFor="dStatus">
          <input
            type="number"
            id="dStatus"
            onChange={(e) => {
              setDelay(e.target.value)
            }}
            placeholder="delay in seconds"
            value={delay}
            max={10}
            min={1}
          />
        </label>
        <button type="submit">Change Delay</button>
      </form>
      <div>Current Delay Time between color changes: {delay} seconds</div>
      <form onSubmit={handleStatusSubmit}>
        <label htmlFor="cStatus">
          <input
            type="number"
            id="cStatus"
            onChange={(e) => setStatus(e.target.value)}
            placeholder="find new status"
            value={status}
            max={599}
            min={100}
          />
        </label>
        <button type="submit">Change Status</button>
      </form>
    </div>
  );
};

export default Cat;
