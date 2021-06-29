const dataBase = require('../model/Knex');
const jwt = require('jsonwebtoken');
const keys = require('../auth/auth')
const node_fetch = require('node-fetch');
const bcrypt = require('bcrypt');
import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";

const imageUpload: RequestHandler|UploadedFile = (req:any,res) =>  {
    if(req.files) {
        const {imageUpload} = req.files
        const user = JSON.parse(req.headers.user)
        const {Token,User} = user
        jwt.verify(Token, keys.key, function(_err: any, decoded: { id: any; }) {
          if(decoded) {
            dataBase.query('users','id',decoded.id)
            .then((response: {id:string|number,email:string,encrypted_password?:string,}[]) => {
              if(response[0].email === User) {
                delete response[0].encrypted_password
                dataBase.update('users',response[0].id,{user_image: imageUpload.data})
                .then((response: { user_image: any; }[]) => {
                    res.status(200).json({Auth: true,image: response[0].user_image})
                })
              }
            })
          }else {
            res.status(200).json({Auth: false})
          }
        });
    }
  }
interface Json {
  title: string,
  description: string,
  parknames: string,
  startdate: string,
  enddate: string,
  starttime: string,
  endtime: string,
  location: string,
  coordinates: any,
  image: any,
  latitude?: string,
  longitude?: any,
  park_name?: any
}
const parkevents: RequestHandler = async (req, res) => {
  dataBase.deleteBigEvents()
  await node_fetch('https://www.nycgovparks.org/xml/events_300_rss.json')
  .then((response: Response) => response.json())
  .then((json: Json[]) => {
      json = json.map((result: Json) => {
        let {title,description,parknames,startdate,enddate,starttime,endtime,location,coordinates,image} = result
        coordinates = coordinates.split(' ')
        const latitude = Number(coordinates[0].slice(0, -1)).toFixed(3);
        let longitude = Number(coordinates[1]).toFixed(3)
        if(longitude === 'NaN') {
          longitude = Number(coordinates[1].slice(0, -1)).toFixed(3);
        }
        result = {title,description,parknames,startdate,enddate,starttime,endtime,location,coordinates,latitude,longitude,image}
        return result
      })
      dataBase.select('parks')
      .then((response: any[]) => {
        response.forEach(data => {     
            data.park_latitude = Number(data.park_latitude).toFixed(3)
            data.park_longitude = Number(data.park_longitude).toFixed(3)
              const obj = json.filter(item => item.latitude == data.park_latitude && item.longitude == data.park_longitude)
              if(obj.length) {
                obj.forEach(item => {
                  item.park_name = data.park_name
                  
                  dataBase.add(item,'park_events')
                })
              }
        })
      })
  })
  res.sendStatus(201)
}
const deleteFavorite = (req: { body: any; },_res: any) => {
  dataBase.deleteFav(req.body)
}
const postFavorite = (req: { body: { user_id: any; }; },res: { sendStatus: (arg0: number) => void; }) => {
    if(!req.body)res.sendStatus(404);
    jwt.verify(req.body.user_id, keys.key, function(_err: any, decoded: { id: any; }) {
        if(decoded) {
            req.body.user_id = decoded.id
            dataBase.add(req.body,'favorites')
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    })
}

const favorites: RequestHandler = (req,res) => {
  
    jwt.verify(req.body.Token, keys.key, function(_err: any, decoded: { id: any; }) {
        if(decoded) {
               dataBase.join(decoded.id)
                .then((resData: any) => { 
                    res.status(200).json(resData)
                   })
    }
})
}

const updateProfile: RequestHandler = (req,res) => {
  const {firstName:first_name,lastName:last_name,email,password,user} = req.body
  dataBase.query('users','email',user)
            .then(async (response: { id: any; encrypted_password:any}[]) => {
              const match = await bcrypt.compare(password, response[0].encrypted_password);
              if(match) {
                dataBase.query('users','email',email)
                .then((result: string | any[]) => {
                   if(!result.length) {
                     dataBase.updateTo({first_name,last_name,email},'users','id',response[0].id)
                     .then((nxtData: any[]) => {
                       delete nxtData[0].encrypted_password
                       delete nxtData[0].id
                       delete nxtData[0].user_image
                      res.status(200).json({Auth:match,User:nxtData[0]})
                     })
                  }else {
                    console.log('email exist',result) 
                    res.status(200).json({Auth:match,Duplicate:true,message: 'make it wrk'})
                  }
                })
              }else {
                res.status(200).json({Auth:match,message: 'Wrong Password'})
              }
            })
}
const filter: RequestHandler = (req,res) => {
  dataBase.filterJoin(req.headers.filter)
  .then((result: any) => res.status(200).json(result))
}
const eventUpdate: RequestHandler = (req,res) => {
  const file = JSON.parse(req.body.imageUpload)
  const user = JSON.parse(req.body.formData)
  jwt.verify(user.user_id, keys.key, function(_err: any, decoded: { id: any; }) {
    if(decoded){
      req.body.user_id = decoded.id
      user.image = file.data
      const eventId = user.eventId
      delete user.eventId
      delete user.image
      user.user_id = decoded.id
  dataBase.update('events',eventId,user)
  .then((response: any) => res.status(200).json(response))
}
  })
}
const eventDelete: RequestHandler = (req,res) => {
  dataBase.deleteEvent(req.body.eventId)
  .then((result: any) => res.status(200).json(result))
}
module.exports = {
    imageUpload,
    postFavorite,
    parkevents,
    updateProfile,
    favorites,
    deleteFavorite,
    filter,
    eventUpdate,
    eventDelete
}