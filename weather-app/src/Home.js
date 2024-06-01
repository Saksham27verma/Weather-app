import React, { useState } from 'react';
import styles from './style.module.css';
import axios from 'axios';

function Home() {
    const [data, setData] = useState({
        celcius: 10,
        name: 'London',
        humidity: 10,
        speed: 2,
        image:'../cloudy.png'
    });
    const [name, setName] = useState('');
    const [typingTimer, setTypingTimer] = useState(null); // State to store the typing timer

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleclick();
        }
    };

    const handleChange = (event) => {
        setName(event.target.value);
        clearTimeout(typingTimer); // Clear any existing timer
        setTypingTimer(setTimeout(handleSearch, 500)); // Set a new timer for 500 milliseconds
    };

    const handleSearch = () => {
        handleclick(); // Automatically search for the city after typing has stopped
    };

    const handleclick = () => {
        if (name !== "") {
            const apiKey = "ed0fc8fc31bd787c58b379d8c1fc3100";
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`;
            axios.get(apiUrl)
                .then(res => {
                    let imagepath='';
                    if(res.data.weather[0].main == "Clouds"){
                        imagepath = "../cloudy.png"
                    }else if(res.data.weather[0].main == "Clear"){
                        imagepath = "../sun.png"
                    }else if(res.data.weather[0].main == "Rain"){
                        imagepath = "../raining.png"
                    }else if(res.data.weather[0].main == "Drizzle"){
                        imagepath = "../Drizzle.png"
                    }else if(res.data.weather[0].main == "Mist"){
                        imagepath = "../mist.png"
                    }else {
                        imagepath = '../cloudy.png'
                    }
                    setData({
                        celcius: res.data.main.temp,
                        name: res.data.name,
                        humidity: res.data.main.humidity,
                        speed: res.data.wind.speed,
                        image: imagepath 
                    });
                })
                .catch(err => console.error(err));
        }
    };

    const voicerecognition = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-GB";
        recognition.onresult = function(event){
            const speechToText = event.results[0][0].transcript;
            setName(speechToText); // Set recognized text in the input field
            handleSearch(); // Trigger search immediately after setting the name
        };
        recognition.onerror = function(event) {
            console.error('Speech recognition error occurred: ', event.error);
        };
        recognition.onend = function() {
            console.log('Speech recognition ended.');
        };
        recognition.start();
    };

    return (
        <div className={styles.container}>
            <div className={styles.weather}>
                <div className={styles.search}>
                    <input
                        type='text'
                        placeholder='Enter City Name'
                        value={name}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button><img src="../search.png" alt="Search" onClick={handleclick} /></button>
                    <button onClick={voicerecognition}><img src='../mic.png' alt='mic'></img></button>
                </div>
                
                <div className={styles.winfo}>
                    <img src={data.image} alt="" />
                    <h1>{Math.round(data.celcius)}ºC</h1>
                    <h2>{data.name}</h2>
                    <div className={styles.details}>
                        <div className={styles.col}>
                            <img src="../humidity.png" alt='' />
                            <div className={styles.humidity}>
                                <p>{Math.round(data.humidity)}%</p>
                                <p>Humidity %</p>
                            </div>
                        </div>
                        <div className={styles.col}>
                            <img src="../wind.png" alt='' />
                            <div className={styles.wind}>
                                <p>{Math.round(data.speed)} km/hr</p>
                                <p>Wind</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
