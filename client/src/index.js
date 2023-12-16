import React from 'react';
import ReactDOM from 'react-dom/client';
import {useState ,useEffect} from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PageLoading from './PageLoading/PageLoading';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function LoadingMessage() {
  return <PageLoading/>;
}
function MainApp() {
  // Use a state to track whether the app is loaded or not
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate an asynchronous operation (e.g., fetching data)
    const fetchData = async () => {
      // For demonstration purposes, use setTimeout to simulate delay
      setTimeout(() => {
        // After the task is complete, update the loading state
        setIsLoaded(true);
      }, 2000); // Adjust the time as needed
    };

    fetchData(); // Call the asynchronous function
  }, []);

  return (
    <React.StrictMode>
        <Router>
            {/* Render LoadingMessage while the app is not loaded */}
            {isLoaded ? <App /> : <LoadingMessage />}
        </Router>
    </React.StrictMode>
  );
}

// Render the MainApp component after a delay
setTimeout(() => {
  root.render(<MainApp />);
}, 100);

reportWebVitals();