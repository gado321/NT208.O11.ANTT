import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

const App = () => {

    // Demo of how to use useEffect to fetch data from an API
    useEffect(
        () => {
            fetch('/auth/hello') // fetch data from the api
                .then(res => res.json()) // convert response to json
                .then(data => {console.log(data)
                    setMessage(data.message) // set data in state
                }) // set data in state
                .catch(err => console.log(err)) // catch errors
            
            
        }, []
    )

    const [message, setMessage] = useState(''); // set initial state to an empty string
    
    return (
        <div className="container">
            <h1>{message}</h1>
        </div>
    )    
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);