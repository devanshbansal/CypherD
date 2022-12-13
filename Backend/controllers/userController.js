import con from "../index.js";
import pkg1 from 'bcryptjs';
const { compare, genSalt, hash: _hash } = pkg1;
import { createJWT, verifyToken } from "../services/userService.js";
import { sendCustomSuccess, sendInternalServerError } from "./common.js";

export const signUp = async(req, res) => {
    var fname = req.body.firstName;
    var lname = req.body.lastName;
    var email = req.body.email;
    var persona = req.body.persona;
    const password = req.body.password;
  
    var sql_findEmail = "SELECT * FROM user WHERE email = ?";
    var sql_insert = "INSERT INTO user (persona,fname,lname,email,pwd) VALUES (?,?,?,?,?)";
    async function hashPassword(password) {
      const salt = await genSalt(10);
      const hash = await _hash(password, salt);
      return hash;
    }
  
    hashPassword(password).then((customerPassword) => {
      con.query(sql_findEmail, [email], function (err, result) {
        if (err) {
          res.status(205).json({
            success:false,
            message: 'Internal Server Error',
          });
        }
        else {
          if (result && result[0] == null) {
            con.query(sql_insert, [persona,fname,lname, email, customerPassword], function (err, result) {
              if (err) {
                res.status(205).json({
                  success:false,
                  message: 'Sign up failed',
                });
              }
              else {
                
                res.status(200).json({
                  success: true,
                  payload: {
                    data: result[0],
                  }
                })
              }
            });
          }
          else {
            console.log('SQL Error:', err);
            res.status(205).json({
              success:false,
              message: 'Email Already exists',
            });
          }
        }
      });
    });
  };


export const signIn = (req, res) => {
    const {email, pwd} = req.body;
    var sql_findEmail = "SELECT * FROM user where email = ?";
    try{
      con.query(sql_findEmail, [email], (err, result) => {
        console.log(err); 
        if(result[0]){
          const { userId } = result[0];
          const accessToken = createJWT(email, result[0].userId, 3600);
          const tokenVerified = verifyToken(accessToken);
          if(tokenVerified){
            res.status(200).json({
              success:true,
              payload: {
                data: result, 
                token: accessToken,
              },
            })
          }
          else{
            res.status(401).json({
              success: false,
              message: ['Unauthorized User']
            });
          }
        }
        else {
          res.status(404).json({ errors: ['Could not find entity'] });
        }
      });
    }
    catch(err){
      res.status(500).json({
        success: false,
        message: err,
      })
    }
    
}  


export const checkTokenValidation = (req, res) => {
  const { token } = req.params;
  const tokenVerified = verifyToken(token);
    if(tokenVerified){
      res.status(200).json({
            success: true,
            payload:{
              token,
            }
        });
    }
    else{
      res.status(401).json({
        success: false,
        message: 'Unauthorized User'
      });
    }
}

export const updateUser = ( req, res) => {
  try{
    const { 
      userId, 
      email, 
      pwd, 
      fname, 
      lname, 
      phone, 
      address, 
      zip, 
      country, 
      walletBalance, 
      paymentPlan
    } = req.body;

    const updateQuery = `UPDATE user SET
      email = ?,
      fname = ?,
      lname = ?,
      phone = ?,
      address = ?,
      zip = ?,
      country = ?,
      walletBalance = ?,
      paymentPlan = ? 
      WHERE userId = ?
    `;

    const getUserByIdQuery = 'SELECT * FROM user WHERE userId = ?';

    con.query(updateQuery, [email, 
      fname, 
      lname, 
      phone, 
      address, 
      zip, 
      country, 
      walletBalance, 
      paymentPlan,
      userId,
    ], (err, result1) => {
      if(err){
        res.status(500).json({
          message: 'Internal Server Error'
        })
      }
      else{
        con.query(getUserByIdQuery, [userId], (err, result2)=>{
          console.log(result2);
          if(result2[0]){
            res.status(200).json({
              success:true,
              payload: {
                data: result2[0],
              }
            });
          }
          else{
            res.status(500).json({
              success: false,
              message: 'User Not Found',
            });
          }
        })
      }
    })
  } 
  catch(err){
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

//GET request
export const getUser = (req, res) => {
  try{
    const userId = req.params.userId;

    const getUserByIdQuery = `SELECT * FROM user WHERE userId = ?`;
    con.query(getUserByIdQuery, [userId], (err, result)=>{
      if(err){
        sendInternalServerError(res);
      }
      else{
        sendCustomSuccess(res, result[0]);
      }
    });  
  }
  catch(err){
    sendInternalServerError(res);
  }
}