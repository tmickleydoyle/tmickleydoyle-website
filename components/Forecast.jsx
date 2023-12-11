import { React, useEffect } from 'react';

import { useState } from 'react';

import LineGraph from './LineGraph';

function linearRegression(y, x) {
    var linearRegression = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
        sum_yy += (y[i] * y[i]);
    }

    linearRegression['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    linearRegression['intercept'] = (sum_y - linearRegression.slope * sum_x) / n;
    linearRegression['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

    return linearRegression;
};

const ForecastPage = () => {
    const [input, setInput] = useState([]);
    const [data, setData] = useState('1,2,3,2,3,4,3,4,5,4,5,6,5,6,7,6,7,8,7,8,9');
    const [rSquared, setRSquared] = useState(0);
    const [indexes, setIndexes] = useState([]);
    const [yValues, setYValues] = useState([]);
    const [regression, setRegression] = useState();
    const [runningModel, setRunningModel] = useState(false);

    const handleInputChange = (event) => {
        setData(event.target.value);
    };
 
async function handleSubmit(event) {
  event.preventDefault();

  setYValues([]);
  setIndexes([]);
  setRegression();
  setInput([]);
  setRSquared(undefined);
  setRunningModel(true);

  const inputData = data.trim().split(',').map(Number);
  const inputIndexes = Array.from(inputData, (_, i) => i);
  const reg = linearRegression(inputData, inputIndexes);
  const yValues = inputData.map((_, i) => parseFloat(reg.slope * i + reg.intercept));

  setYValues(yValues);
  setIndexes(inputIndexes);
  setRegression(reg);
  setRSquared(reg.r2);
  setInput(inputData);
  setRunningModel(false);
}

useEffect(() => {
    // Get the button element by its ID
    const button = document.getElementById('autoClickButton');

    // Simulate a click on the button
    if (button) {
      button.click();
    }
  }, []);

    return (
        <div>
            <h1>Linear Regression Model</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={data}
                        onChange={handleInputChange}
                        placeholder="Enter data (comma-separated): 5,4,6,7,5,6"
                    />
                </label>
                <button id="autoClickButton" className='custombutton' type="submit">Submit</button>
            </form>
            {!runningModel && (
                <>
                    <br />
                    <LineGraph title={`Linear Regression - R-Squared Value: ${rSquared.toFixed(2)}`} labels={indexes} data={input} forecast={yValues} />
                </>
            )}
            {runningModel && (
                <>
                    <br />
                    <p>Running linear regression...</p>
                </>
            )}
        </div>
    );
};

export default ForecastPage;
