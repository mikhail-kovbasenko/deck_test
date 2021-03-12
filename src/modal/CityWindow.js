import React, {useEffect} from 'react';
import Canvas from './Canvas';
import Loader from './Loader';

export default function CityWindow({onClose, id, api}) {
	const [data, setData] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	function getCorrectTimeFormat(ms, tmz) {	
		let date = new Date(ms * 1000);
		let utc = new Date((date.getTime() + date.getTimezoneOffset() * 60000));
		utc.setSeconds(utc.getSeconds() + tmz);
	
		let hours = utc.getHours();
		if(hours < 10) hours = '0' + hours;

		let min = utc.getMinutes();
		if(min < 10) min = '0' + min;
		
		let today = new Date(utc.getFullYear(), utc.getMonth(), utc.getDate());
		let diff = (utc - today) / 1000 / 60;
		const angle = (Math.trunc((diff * 180) / 1440));
		const time = `${hours}:${min}`;
		console.log(time, angle);
		return {
			time,
			angle,
		}
	}

	function renderCanvas(data, item) {
		const sunrise = data.city ? data.city.sunrise : data.sys.sunrise;
		const sunset = data.city ? data.city.sunset : data.sys.sunset;
		const timezone = data.city ? data.city.timezone : data.timezone;

		const {time:rise_time, angle:rise_angle, time:time_rise} = getCorrectTimeFormat(sunrise, timezone);
		const {time:set_time, angle:set_angle, time:time_set} = getCorrectTimeFormat(sunset, timezone);

		const x_rise = 150 + 100 * Math.cos(-rise_angle * Math.PI / 180) * 1;
		const y_rise = 125 + 100 * Math.sin(-rise_angle * Math.PI / 180) * 1;

		const x_set = 150 + 100 * Math.cos(-set_angle * Math.PI / 180) * 1;
		const y_set = 125 + 100 * Math.sin(-set_angle * Math.PI / 180) * 1;
		

		const draw = {
			x_rise,
			y_rise,
			x_set,
			y_set,
			time_rise,
			time_set
		}

		return (
			<Canvas draw={draw}/>
		)
	}

	function showModalWindow(data) {
		console.log(data);
		const name = data.city ? data.city.name : 'Мое местоположение';
		let today_data, tommorow_data;
		if(data.list) {
			today_data = data.list[1];
			tommorow_data = data.list[9];
		} else {
			today_data = tommorow_data = data;
		}
		
		const icon_today = `http://openweathermap.org/img/wn/${today_data.weather[0].icon}@2x.png`
		const icon_tommorow = `http://openweathermap.org/img/wn/${tommorow_data.weather[0].icon}@2x.png`
		return (
			<div className="modal-window-content city">
			<div className="title">
               <h1>{name}</h1>
               <div className="modal-close" onClick={() => onClose()}>&times;</div>
            </div>
         	<div className="modal-window__today block">
					<div className="day">Сегодня</div>
					<div>{Math.trunc(today_data.main.temp)}&#176;</div>
					<div><img src={icon_today} alt=""/></div>
					<div>{renderCanvas(data)}</div>
				</div>
         	<div className="modal-window__tommorow block">
					<div className="day">Завтра</div>
					<div>{Math.trunc(tommorow_data.main.temp)}&#176;</div>
					<div><img src={icon_tommorow} alt=""/></div>
					<div>{renderCanvas(data)}</div>
				</div>
            <button className="content__header-button" onClick={() => onClose()}>Ок</button>
			</div>
		)

	}
	useEffect(() => {
		if(id !== 0) {
			fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${id}&units=metric&appid=${api}`)
			.then(response => response.json())
			.then(data => {
				setData(data);
				setLoading(true);
			});
		} else {
			const [latitube, longitube] = JSON.parse(localStorage.getItem('coords'));

			fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitube}&lon=${longitube}&units=metric&appid=${api}`)
				.then(response => response.json())
				.then(data => {
					setData(data);
					setLoading(true)
				})
		}
	}, [])
	return (
		<div className="modal-window">
				{!loading && <Loader/>}
				{data && showModalWindow(data)}
		</div>
	)
}