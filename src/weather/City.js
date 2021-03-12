import React from 'react';

function City({city, index, onRemove, onShow}) {
    const icon_url = `http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`
    const icon_desc = city.weather[0].description;
    const attr = {'data-id': city.id}
    
    function removeThisCity(e) {
        const city = e.target.parentElement.parentElement;
        const data_id = +city.dataset.id;
        
        onRemove(data_id);
    }
    return (
        <div className="content__city" {...attr} onClick={event => onShow(event)}>
            <div className="content__city-title">
                {
                    index === 0 ? 'Мое местоположение' : city.name
                }
            </div>
            <div className="content__city-temp">
                {
                    Math.trunc(city.main.temp)
                }&#176;
            </div>
            <div className="content__city-icon">
               <img src={icon_url} alt={icon_desc}/>
            </div>
            <div className="content__city-close">
                {
                    index !== 0 ? <span onClick={event => removeThisCity(event)}>&times;</span> : ''
                }
            </div>
        </div>
    )
}

export default City;