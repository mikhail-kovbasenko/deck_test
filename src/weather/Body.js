import React from 'react';
import City from './City';

function Body({cities, onRemove, onShow}) {
    return (
        <div className="content__body">
            <div className="content__container">
                <div className="content__cities">
                    {
                        cities.map((city, index) => {
                            return <City city={city} index={index} key={index} onRemove={onRemove} onShow={onShow}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Body;