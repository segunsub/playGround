import User                   from './User';
import Button  from "./Button";


const style = {
    background: 'lightgrey',
    border: '4px solid black',
    height: '500px',
    width: '1300px',
    marginLeft: 'auto',
    marginRight: "auto",
    fontWeight: 900,
};
function Favorites(props){
    const switchTab = () => {
        console.log('click')
    }


    return (
      <>
        <User src="https://semantic-ui.com/images/avatar/small/jenny.jpg" text="Test User"/>
            <Button text="Favorites" className="favoriteTab" click={switchTab}/>
            <Button text="Events" className="eventsTab" click={switchTab}/>
        <div style={style}>
            <h1>My Favorite Parks</h1>
      

            
        </div>
       
      </>
    )
  }
  
  export default Favorites