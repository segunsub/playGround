import { useContext, useEffect } from 'react'
import Parkcard from './ParkCard'
import PlayGroundContext from '../context/PlayGroundContext'
import { useHistory } from 'react-router'
import { Card, Dropdown } from 'semantic-ui-react'
import Map from './Map'
import { Icon } from "leaflet";
import {Helmet} from 'react-helmet';



function HomePage(){
const basketBallIcon = new Icon({
    iconUrl: '/basketball.png',
    iconSize: [30,40],
})
const bbqIcon = new Icon({
  iconUrl: '/barbecue.png',
  iconSize: [30,40],
})
const handballIcon = new Icon({
  iconUrl: '/handball.png',
  iconSize: [30,40],
})
const trackIcon = new Icon({
  iconUrl: '/finish.png',
  iconSize: [30,40],
})
const indoorIcon = new Icon({
  iconUrl: '/indoor.png',
  iconSize: [30,40],
})
const outdoorIcon = new Icon({
  iconUrl: '/outdoor.png',
  iconSize: [30,40],
})
const dogIcon = new Icon({
  iconUrl: '/dog.png',
  iconSize: [30,40],
})

  const context = useContext(PlayGroundContext)
  const {userFavorites} = context

  let history = useHistory()
  let {filteredParks, parkSearch,position, setParkSearch,setPosition,setFilteredParks,originalPark} = useContext(PlayGroundContext)
  filteredParks.parksData.length = 12
  // console.log(filteredParks)
  navigator.geolocation.getCurrentPosition((position) => {
    if(position.coords.latitude && position.coords.longitude){
      if(!position.lat) {
      setPosition((prev) => ({...prev,lat:position.coords.latitude,lon:position.coords.longitude}))
      }
    }
  },()=>{
    if(!position.lat) {
      setPosition((prev) => ({...prev,lat:40.8002663,lon:-73.9577346}))
    }
  })
  useEffect(()=> {
    const user = localStorage.getItem('user')
    if(user) {
    const options = {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: user
    }
    fetch('http://localhost:5000/verifySession',options)
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      if(!data.Auth) {
        history.push('/')
      }
    })
    }else {
      history.push('/')
    }
  },[history])



  const options = [
    { key: 1, text: 'BasketBall', value: 1 },
    { key: 2, text: 'BBQ', value: 2 },
    { key: 3, text: 'Dog Area', value: 3 },
    { key: 4, text: 'Track', value: 4},
    { key: 5, text: 'HandBall Court', value: 5 },
    { key: 6, text: 'Indoor Pool', value: 6 },
    { key: 7, text: 'Outdoor Pool', value: 7 }
  ]
  function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  const filter = (event,semantic) => {
    console.log(event)
    if(semantic.value === 1) {
      const options = {
        method: 'get',
        headers: {'Content-Type': 'application/json',
      'filter': 'basketball_courts_name'}
      }
      fetch('http://localhost:5000/filter',options)
      .then(response => response.json())
      .then(data => {
        data.length = 50
        data.map(data => {
          data.distance = distance(Number(data.park_latitude),Number(data.park_longitude),position.lat,position.lon)
          return data
        })
        setFilteredParks((prev) => ({...prev, parksData: data.sort((a,b) => a.distance - b.distance),type: basketBallIcon}))
      })
    }else if(semantic.value === 2) {
      const options = {
        method: 'get',
        headers: {'Content-Type': 'application/json',
      'filter': 'bbqing_areas_name'}
      }
      fetch('http://localhost:5000/filter',options)
      .then(response => response.json())
      .then(data => {
        data.length = 50
        data.map(data => {
          data.distance = distance(Number(data.park_latitude),Number(data.park_longitude),position.lat,position.lon)
          return data
        })
        setFilteredParks((prev) => ({...prev, parksData: data.sort((a,b) => a.distance - b.distance),type: bbqIcon}))
      })
    }else if(semantic.value === 3) { 
      const options = {
        method: 'get',
        headers: {'Content-Type': 'application/json',
      'filter': 'dog_areas_name'}
      }
      fetch('http://localhost:5000/filter',options)
      .then(response => response.json())
      .then(data => {
        data.length = 50
        data.map(data => {
          data.location = data.address;
          data.distance = distance(Number(data.park_latitude),Number(data.park_longitude),position.lat,position.lon)
          return data
        })
        setFilteredParks((prev) => ({...prev, parksData: data.sort((a,b) => a.distance - b.distance),type: dogIcon}))
      })
    }else if(semantic.value === 4) {
      const options = {
        method: 'get',
        headers: {'Content-Type': 'application/json',
      'filter': 'running_track_name'}
      }
      fetch('http://localhost:5000/filter',options)
      .then(response => response.json())
      .then(data => {
        data.length = 50
        data.map(data => {
          data.location = data.address;
          data.distance = distance(Number(data.park_latitude),Number(data.park_longitude),position.lat,position.lon)
          return data
        })
        setFilteredParks((prev) => ({...prev, parksData: data.sort((a,b) => a.distance - b.distance),type: trackIcon}))
      })
    }else if(semantic.value === 5) {
      const options = {
        method: 'get',
        headers: {'Content-Type': 'application/json',
      'filter': 'handball_courts_name'}
      }
      fetch('http://localhost:5000/filter',options)
      .then(response => response.json())
      .then(data => {
        data.length = 50
        data.map(data => {
          data.location = data.address;
          data.distance = distance(Number(data.park_latitude),Number(data.park_longitude),position.lat,position.lon)
          return data
        })
        setFilteredParks((prev) => ({...prev, parksData: data.sort((a,b) => a.distance - b.distance),type: handballIcon}))
      })
    }else if(semantic.value === 6) {
      const options = {
        method: 'get',
        headers: {'Content-Type': 'application/json',
      'filter': 'indoor_pool_name'}
      }
      fetch('http://localhost:5000/filter',options)
      .then(response => response.json())
      .then(data => {
        data.length = 50
        data.map(data => {
          data.location = data.address;
          data.distance = distance(Number(data.park_latitude),Number(data.park_longitude),position.lat,position.lon)
          return data
        })
        setFilteredParks((prev) => ({...prev, parksData: data.sort((a,b) => a.distance - b.distance),type: indoorIcon}))
      })
    }else if(semantic.value === 7) {
      const options = {
        method: 'get',
        headers: {'Content-Type': 'application/json',
      'filter': 'outdoor_pool_name'}
      }
      fetch('http://localhost:5000/filter',options)
      .then(response => response.json())
      .then(data => {
        data.length = 50
        data.map(data => {
          data.location = data.address;
          data.distance = distance(Number(data.park_latitude),Number(data.park_longitude),position.lat,position.lon)
          return data
        })
        setFilteredParks((prev) => ({...prev, parksData: data.sort((a,b) => a.distance - b.distance),type: outdoorIcon}))
      })
    }else {
      setFilteredParks(originalPark)
    }
  }
  return (
    <div className="homePage">
    <h1 style={{fontFamily: "Poppins, sans-serif", color: "white", fontWeight: 400, paddingTop: "100px", fontSize: "23px"}}>CONNECTING YOU WITH THE OUTSIDE AGAIN</h1>      
    <div className='mapdiv'>
    <Helmet>
      <style>{'body { font-family: "Poppins", sans-serif; }'}</style>
    </Helmet>
    <Map />
    </div>
    <h1 style={{fontFamily: "Poppins, sans-serif", color: "white", paddingTop: "90px"}}>Search nearby parks</h1>
    <div id='homeInput'>
        <input id="homeInputBox"value={parkSearch} placeHolder="Search..." onChange={(e)=> {setParkSearch(e.target.value)}}></input>
        <Dropdown clearable options={options} selection onChange={filter} size={3}/>
    </div>
      <br/>
      <div className="all_parks">
      <Card.Group centered className="test">
        {filteredParks.parksData.map((park, i) => {
          return (
            <Parkcard key={i} Park={park} search={setParkSearch} userFavs={userFavorites} type={filteredParks.type} />
          )
        })}
        </Card.Group>
      </div>  
    </div>
  )
}

export default HomePage