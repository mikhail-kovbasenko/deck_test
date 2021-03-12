import React, {useEffect} from 'react';
import './App.css';
import CityWindow from './modal/CityWindow';
import Loader from './modal/Loader';
import Body from './weather/Body';
import Header from './weather/Header';

function App() {
  const [cities, setCities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [city, setCity] = React.useState({
	  show: false,
	  id: null
  });
  const API_key = 'be2e46ce16ccb258492a3a5d34bff282';

  function createCity(city) {
    setCities(
     cities.concat(city)
    )
  }

  function onCloseWindow() {
	  setCity(false);
  }

  function showCity(event) {
	  const id = +event.currentTarget.dataset.id;
	
	  setCity({
		  show: true,
		  id: id
	  });
  }

  function removeCity(id) {
    setCities(cities.filter(city => city.id !== id));

    const storage = JSON.parse(localStorage.getItem('cities'));

    delete storage[id];

    localStorage.setItem('cities', JSON.stringify(storage));
  }

  useEffect(() => {
    if(!localStorage.getItem('cities')) {
      localStorage.setItem('cities', JSON.stringify({}));
    }
    let cities = [];

    new Promise(resolve => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
  		  maximumAge: 0
      }
      function success(position) {
        const latitube = +position.coords.latitude.toFixed(0);
        const longitube = +position.coords.longitude.toFixed(0);

		  localStorage.setItem('coords', JSON.stringify([latitube, longitube]));

        resolve([latitube, longitube]);
      }
      function error(err) {
        alert('Error: ' + err.message);
      }

      navigator.geolocation.getCurrentPosition(success, error, options);
    })
    .then(coords => {
      let [latitube, longitube] = coords;

      return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitube}&lon=${longitube}&units=metric&appid=${API_key}`);
   })
   .then(response => response.json())
   .then(data =>{
      cities.push(data);
   })
   .then(() => {
     return new Promise((resolve, reject) => {
       const storage = JSON.parse(localStorage.getItem('cities'));

       if(Object.keys(storage).length > 0) resolve(storage);
       else reject();
     })
   })
   .then(data => {
     const id_list = Object.entries(data).map(item => {
       return +item[0];
     })

     return id_list;
   })
   .then(data => {
      const promises = data.map(id => {
        return fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${id}&units=metric&appid=${API_key}`)
          .then(response => response.json());
      })

     return Promise.all(promises);
       
   })
   .then(data => {
    data.forEach(item => {
      const list = item.list[1];
      list.name = item.city.name;
      list.id = item.city.id;

      cities.push(list);
    })
   })
   .catch(() => {
   })
   .finally(() => {
     setCities(cities);
     setLoading(false);
   })
   }, []);
  return (
    <div className="wrapper">
      <div className="content">
        <Header api={API_key} onCreate={createCity}/>
        {loading && <Loader/>}
		  {city.show && <CityWindow onClose={onCloseWindow} id={city.id} api={API_key}/>}
        {cities.length ? <Body cities={cities} onRemove={removeCity} onShow={showCity}/> :
          (
            loading ? null : <p>No cities.</p>
          )
        }
      </div>
    </div>
  );
}

export default App;
