import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import axios from 'axios';

function Home() {
    const [data, setData] = useState(null); // Initially no data
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true); // State to manage loading state

    const getWeather = (latitude, longitude) => {
        const apiKey = "ed0fc8fc31bd787c58b379d8c1fc3100";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        axios.get(apiUrl)
            .then(res => {
                let imagepath = '';
                switch (res.data.weather[0].main) {
                    case "Clouds":
                        imagepath = "../cloudy.png";
                        break;
                    case "Clear":
                        imagepath = "../sun.png";
                        break;
                    case "Rain":
                        imagepath = "../raining.png";
                        break;
                    case "Drizzle":
                        imagepath = "../Drizzle.png";
                        break;
                    case "Mist":
                        imagepath = "../mist.png";
                        break;
                    default:
                        imagepath = '../cloudy.png';
                }
                setData({
                    celcius: res.data.main.temp,
                    name: res.data.name,
                    humidity: res.data.main.humidity,
                    speed: res.data.wind.speed,
                    image: imagepath
                });
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch(err => {
                console.error(err);
                setLoading(false); // Ensure loading is false in case of error
            });
    };

    const currentPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    getWeather(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    console.log("Error retrieving location: " + err.message);
                    
                }
            );
        } else {
            console.log("Geolocation not available");
            //setLoading(false); // Ensure loading is false if geolocation is not available
        }
    };

    useEffect(() => {
        currentPosition();
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleClick();
        }
    };

    const handleChange = (event) => {
        setName(event.target.value);
    };

    const handleClick = () => {
        if (name !== "") {
            setLoading(true); // Set loading to true when fetching data
            const apiKey = "ed0fc8fc31bd787c58b379d8c1fc3100";
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`;
            axios.get(apiUrl)
                .then(res => {
                    let imagepath = '';
                    switch (res.data.weather[0].main) {
                        case "Clouds":
                            imagepath = "../cloudy.png";
                            break;
                        case "Clear":
                            imagepath = "../sun.png";
                            break;
                        case "Rain":
                            imagepath = "../raining.png";
                            break;
                        case "Drizzle":
                            imagepath = "../Drizzle.png";
                            break;
                        case "Mist":
                            imagepath = "../mist.png";
                            break;
                        default:
                            imagepath = '../cloudy.png';
                    }
                    setData({
                        celcius: res.data.main.temp,
                        name: res.data.name,
                        humidity: res.data.main.humidity,
                        speed: res.data.wind.speed,
                        image: imagepath
                    });
                    setName('');
                    setLoading(false); // Set loading to false once data is fetched
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false); // Ensure loading is false in case of error
                });
        }
    };

    const voiceRecognition = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-GB";
        recognition.onresult = function(event) {
            const speechToText = event.results[0][0].transcript;
            setName(speechToText); // Set recognized text in the input field
            handleClick(); // Trigger search immediately after setting the name
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
                    <button onClick={handleClick}><img src="../search.png" alt="Search" /></button>
                    <button onClick={voiceRecognition}><img src='../mic.png' alt='mic' /></button>
                    <button onClick={currentPosition}><img src='../location-pin.png' alt='location' /></button>
                </div>
                {loading ? (
                    <div className={styles.loading}>
                        <img src="../Weathericons.gif" alt="Loading..." />
                        
                    </div>
                ) : data ? (
                    <div className={styles.winfo}>
                        <img src={data.image} alt="" />
                        <h1>{Math.round(data.celcius)}ºC</h1>
                        <h2>{data.name}</h2>
                        <div className={styles.details}>
                            <div className={styles.col}>
                                <img src="../humidity.png" alt="" />
                                <div className={styles.humidity}>
                                    <p>{Math.round(data.humidity)}%</p>
                                    <p>Humidity</p>
                                </div>
                            </div>
                            <div className={styles.col}>
                                <img src="../wind.png" alt="" />
                                <div className={styles.wind}>
                                    <p>{Math.round(data.speed)} km/hr</p>
                                    <p>Wind</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.winfo}>
                        <p>No data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
