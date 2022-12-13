import { sendInternalServerError, sendCustomSuccess } from "./common.js";
import con  from '../index.js';

export const addBooking = (req, res) => {
    try{
        const {
            bookingId, 
            droneId,
            customerId, 
            source, 
            destination, 
            bookingDate, 
            charges: chargePerHour, 
            status,            
        } = req.body;

        const getBookingByIdQuery = 'SELECT * FROM booking WHERE bookingId = ?;';

        const bookingUpdateQuery = `UPDATE booking SET
            droneId = ?,
            customerId = ?,
            source = ?,
            destination = ?,
            bookingDate = ?
            chargePerHour = ?,
            status = ?,
            WHERE bookingId = ?;
        `;
        const bookingAddQuery = `INSERT INTO booking (
            bookingId,
            droneId,
            customerId, 
            source, 
            destination, 
            bookingDate, 
            chargePerHour, 
            pilotid,
            status) VALUES (NULL, ?, ?,?,?,?,?,2,?)
        `;

        const getLastInerstedIdQuery = `SELECT LAST_INSERT_ID();`;

        if(bookingId){ //Update
            con.query(bookingUpdateQuery, [
                bookingId,
                droneId,
                customerId, 
                source, 
                destination, 
                bookingDate, 
                chargePerHour, 
                status,
            ], (err, result) => {
                if(err){
                    sendInternalServerError(res);
                }
                else{
                    con.query(getBookingByIdQuery, [bookingId], (err, result)=>{
                        if(result[0]){
                            sendCustomSuccess(res, { data: result[0]});
                        }
                        else{
                            sendCustomError(res, 404, 'Entity Not Found');
                        }
                    });
                }
            });
        }
        else{ //Add New
            con.query(bookingAddQuery, [
                droneId,
                customerId, 
                source, 
                destination, 
                bookingDate, 
                chargePerHour, 
                status,
            ], (err, result) => {

                if(err){
                    console.log(err);
                    sendInternalServerError(res);
                }
                else{
                    con.query(getLastInerstedIdQuery, (err, result) => {
                        if(result){
                            let id = result[0]['LAST_INSERT_ID()'];
                            con.query(getBookingByIdQuery, [id], (err, result)=>{
                                if(result[0]){
                                    sendCustomSuccess(res, { data: result[0]});
                                }
                                else{
                                    sendCustomError(res, 404, 'Entity Not Found');
                                }
                            });
                        }
                        else{
                            console.log(err);
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



// export const getUserBookings = (req, res) => {
//     try{
//         const userId = req.query.userId;
//         const filterBookingsBasedOnTypeQuery = `SELECT * FROM booking WHERE customerId = ?`;
//         con.query(filterBookingsBasedOnTypeQuery, [userId], (err, result) => {
//             if(err){
//                 sendInternalServerError(res);
//             }
//             else{
//                 console.log(result);
//                 sendCustomSuccess(res, result);
//             }
//         });
//     }
//     catch(err){
//         sendInternalServerError(res);
//     }
// }

export const getInProgressBooking = (req, res) => {
    try{
        const userId = req.query.userId;
        const persona = req.query.persona;
        console.log(persona);
        let inProgressBookingsQuery;

        if(persona === 'customer'){
            inProgressBookingsQuery = `select droneNumber, drone.chargePerHour, 
            booking.droneId, bookingId, source, destination, status, customerId 
                    from booking INNER JOIN drone on drone.droneId = booking.droneId 
                    inner join user on booking.customerId = user.userId 
                    where customerId = ? and status = 'In-Progress' and persona = ?;`;
                    con.query(inProgressBookingsQuery, [userId, persona], (err, result)=>{
                        if(err){
                            console.log(err);
                            sendInternalServerError(res);
                        }
                        else{
                            console.log('Bookings', result);
                            sendCustomSuccess(res, result); 
                        }
                    })
        }

        else if(persona === 'admin'){
            inProgressBookingsQuery = `select user.userId , user.userId, user.fname, user.lname, droneNumber, drone.chargePerHour,
            booking.droneId, bookingId, source, destination, status, customerId 
                    from booking INNER JOIN drone on drone.droneId = booking.droneId 
                    inner join user on booking.customerId = user.userId 
                    where status = 'In-Progress';`;
                    con.query(inProgressBookingsQuery, [userId], (err, result)=>{
                        if(err){
                            console.log(err);
                            sendInternalServerError(res);
                        }
                        else{
                            console.log('Bookings', result);
                            sendCustomSuccess(res, result); 
                        }
                    })
        }

        else if(persona === 'owner'){
            inProgressBookingsQuery = `select user.userId , pilot.userid, user.fname, user.lname, droneNumber, drone.chargePerHour,
            booking.droneId, booking.bookingId, source, destination, status, customerId 
                    from booking INNER JOIN drone on drone.droneId = booking.droneId 
                    inner join user on booking.customerId = user.userId 
                    inner join pilot on pilot.userid = ?
                    where status = 'In-Progress';`;
                    con.query(inProgressBookingsQuery, [userId], (err, result)=>{
                        if(err){
                            console.log(err);
                            sendInternalServerError(res);
                        }
                        else{
                            console.log('Bookings', result);
                            sendCustomSuccess(res, result); 
                        }
                    })
        }

    }
    catch(e){
        sendInternalServerError(e);
    }
}

export const getUserBookings = (req, res) => {
    try{
        const userId = req.query.userId;
        const persona = req.query.persona;
        let query;
        if(persona === 'owner'){
            query = `select droneNumber, r.droneId, c.chargePerHour,bookingId, source, destination, status, customerId, r.chargePerHour 
            from booking as r INNER JOIN drone as c on c.droneId = r.droneId 
            where r.pilotid=?`;
        }
        else if(persona === 'admin'){
            query = `select droneNumber, r.droneId, c.chargePerHour,bookingId, source, destination, status, customerId, r.chargePerHour 
            from booking as r INNER JOIN drone as c on c.droneId = r.droneId`;
        }
        else if(persona === 'customer'){
            query = `select droneNumber, booking.droneId, c.chargePerHour,bookingId, source, destination, status, customerId, booking.chargePerHour 
            from user as u INNER JOIN booking on customerId = u.userId 
            INNER JOIN drone as c on c.droneId = booking.droneId 
            where customerId = ?`;
        }

        con.query(query, [userId], (err, result)=>{
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

export const deleteBooking = (req, res) => {
    try{
        const bookingId = req.query.bookingId;
        const persona = req.query.persona;
        let query;
        query = `DELETE FROM drone_verse.booking WHERE (bookingId = '${bookingId}');`;
        con.query(query, [bookingId], (err, result)=>{
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