import con from  '../index.js';
import { sendCustomError, sendCustomSuccess, sendInternalServerError } from './common.js';

export const addDrone = (req, res) => {
    try{
        const {
            droneId,
            droneNumber,
            ownerId, 
            model, 
            type, 
            chargePerHour, 
            available, 
            mileage,            
        } = req.body;
        // console.log('Add drone request body', req.body);
        const getDroneByIdQuery = 'SELECT * FROM drone WHERE droneId = ?;';

        const droneUpdateQuery = `UPDATE drone SET
            droneNumber = ?,
            model = ?,
            type = ?,
            chargePerHour = ?,
            available = ?,
            mileage = ?
            WHERE droneId = ?
        `;
        const droneAddQuery = `INSERT INTO drone (
            droneId,
            droneNumber, 
            ownerId, 
            model, 
            type, 
            chargePerHour, 
            available, 
            mileage) VALUES (NULL,?, ?,?,?,?,?,?)
        `;

        const getLastInerstedIdQuery = `SELECT LAST_INSERT_ID();`;

        if(droneId){ //Update
            con.query(droneUpdateQuery, [
                droneNumber, 
                model, 
                type, 
                chargePerHour,
                available,  
                mileage, 
                droneId
            ], (err, result) => {
                if(err){
                    sendInternalServerError(res);
                }
                else{
                    con.query(getDroneByIdQuery, [droneId], (err, result)=>{
                        if(result[0]){
                            sendCustomSuccess(res, { data: result[0]});
                        }
                        else{
                            sendCustomError(res, 404, 'Entity Not Found');
                        }
                    })
                }
            });
        }
        else{ //Add New
            con.query(droneAddQuery, [
                droneNumber,
                ownerId, 
                model, 
                type, 
                chargePerHour,
                available,  
                mileage, 
            ], (err, result) => {
                console.log('Add new drone - Response from DB: ', result);

                if(err){
                    sendInternalServerError(res);
                }
                else{
                    console.log('Sent request to add a Drone');
                    console.log('Now, verifying its persistence in the DB');
                    con.query(getLastInerstedIdQuery, (err, result) => {
                        if(result){
                            let id = result[0]['LAST_INSERT_ID()'];
                            con.query(getDroneByIdQuery, [id], (err, result)=>{
                                if(result[0]){
                                    console.log('')
                                    sendCustomSuccess(res, { data: result[0]});
                                }
                                else{
                                    sendCustomError(res, 404, 'Entity Not Found');
                                }
                            });
                        }
                        else{
                            sendInternalServerError(res);
                        }
                    })
                }
            });
        }
    }
    catch(err){
        sendInternalServerError(res);
    }
} 


//Get Request
export const getDronesByType = (req, res) => {
    try{
        
        const type = req.query.type;
        const filterDronesBasedOnTypeQuery = `SELECT * FROM drone WHERE type = ?`;
        con.query(filterDronesBasedOnTypeQuery, [type], (err, result) => {
            if(err){
                sendInternalServerError(res);
            }
            else{
                console.log(result);
                sendCustomSuccess(res, result);
            }
        });
    }
    catch(err){
        sendInternalServerError(res);
    }
}

export const getDronesByOwner = (req, res) => {
    try{
        const ownerId = req.query.ownerId;
        const filterDronesBasedOnTypeQuery = `SELECT * FROM drone WHERE ownerId = ?`;
        con.query(filterDronesBasedOnTypeQuery, [ownerId], (err, result) => {
            if(err){
                sendInternalServerError(res);
            }
            else{
                console.log(result);
                sendCustomSuccess(res, result);
            }
        });
    }
    catch(err){
        sendInternalServerError(res);
    }
}

export const deleteDronesById = (req, res) => {
    try{
        const droneId = req.query.droneId;
        // const persona = req.query.persona;
        let query;
        query = `DELETE FROM drone_verse.drone WHERE (droneId = '${droneId}');`;
        con.query(query, [droneId], (err, result)=>{
            if(err){
                console.log(err);
                sendInternalServerError(res);
            }
            else{
                sendCustomSuccess(res, result); 
            }
        })
    }
    catch(e){
        sendInternalServerError(e);
    }
}