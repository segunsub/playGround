import { DivIcon } from 'leaflet';
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet';

interface Props {
    id: string|number;
    park_latitude: number,
    park_longitude: number,
    park: {id: string|number},
    park_name: string,
    location: string,
    park_location: string,
    park_link: string

}
function SpecificMap(props: {park : Props,type: DivIcon}) {
    return ( 
        <MapContainer id='specificCard' center={[props.park.park_latitude, props.park.park_longitude]} key={props.park.id} zoom={16}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
              <Marker key={props.park.id} position={[props.park.park_latitude, props.park.park_longitude]} icon={props.type}>
                <Popup>
                    <div>
                    
                        <h3>{props.park.park_name}</h3>
                       
                        <hr/>
                        <p>{props.park.location ?  props.park.location : props.park.park_location}</p>
                        <hr/>
                       
                       
                        <a href={props.park.park_link} target='_Blank' rel="noreferrer">Park Link</a>
                    </div>
                </Popup>
          </Marker>
        </MapContainer>
        )
}

export default SpecificMap
