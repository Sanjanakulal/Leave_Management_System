const jwt = require('jsonwebtoken')
const SECRET_KEY = "LeaveManagement_2026_SecureKey_9x7Kp2";
const authuser = async(req,res,next)=>{
    try {
      const usertoken = await req.header("auth-token")
      if(usertoken){
        const userinfo = await jwt.verify(usertoken,SECRET_KEY)
        console.log(userinfo)
        req.userid = userinfo;
        next();
      }  
      else{
        res.json({success:false,message:"unathorized!! user token"})
      }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"server error"})
    }
}

module.exports = authuser 