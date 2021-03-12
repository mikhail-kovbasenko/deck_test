import React, {useState} from 'react';

function Header({api, onCreate}) {
    const [status, setStatus] = useState(false);
    const input = useInputValue('');
    function useInputValue(defaultValue = '') {
        const [value, setValue] = useState(defaultValue);

        return {
            bind: {
                value,
                onChange: event => setValue(event.target.value),
            },
            clear: () => setValue(''),
            value: () => value
        }
    }
    function saveCity(e) {
        if(input.value().trim()) {
            const city = input.value().trim();

            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${api}`)
                .then(response => response.json())
                .then(data => {
                    const storage = JSON.parse(localStorage.getItem('cities'));
                    const current_weather = data.list[1];

                    current_weather.name = data.city.name;
                    current_weather.id = data.city.id;

                    storage[data.city.id] = [data.city.name, current_weather];

                    localStorage.setItem('cities', JSON.stringify(storage));
                    
                    onCreate(current_weather);
                    input.clear();
                })
					 .catch(err => {
						 alert('Ошибочка:((( нет такого города, перепроверь название.');
					 } )
            setStatus(false);        
        }
    }
    return (
            <div className="content__header">
                <div className="content__add">
                    <a href="#" className="content__header-button" onClick={() => setStatus(true)}>Добавить город</a>
                </div>
                {status && <div className="modal-window">
                    <div className="modal-window-content new">
                        <div className="title">
                             <h1>Новый город</h1>
                             <div className="modal-close" onClick={() => setStatus(false)}>&times;</div>
                        </div>
                        <input type="text" placeholder="Введите название города" {...input.bind}/>
                        <button className="content__header-button" onClick={event => saveCity(event)}>Сохранить</button>
                    </div>
                </div>}
            </div>
        )
}

export default Header;
