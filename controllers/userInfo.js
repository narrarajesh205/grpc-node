const UserModel = require("../models/User/UserModel");
const TenantModel = require("../models/Tenant/TenantModel");
const bcrypt = require('bcryptjs');



class userInfo{
  
  async signup(req, res) {
    try {
      let { TID, FName, LName, Email, Pwd } = req.body;

      if(!FName){
        res.json( { messge: "First Name missing in the request" } );
        return;
      }

      if(!LName){
        res.json( { messge: "Lasr Name missing in the request" } );
        return;
      }

      if(!Email){
        res.json( { messge: "EmailID missing in the request" } );
        return;
      }

      if(!Pwd){
        res.json( { messge: "Password missing in the request" } );
        return;
      }

      //Check user is already existed in Arca
      var existedUser = await UserModel.checkUserExistsByEmail(req.body.Email);
      if (existedUser !== false && existedUser !== undefined && existedUser !== null) {
        res.json( { messge: "User already exists" } );
        return;
      }
      req.body.Pwd = encodeURIComponent(req.body.Pwd);
      let createTenant = 1;
      if(req.body.TID != undefined) createTenant = 0;

      if(createTenant == 1){
        let tenantData = await TenantModel.createTenantByDomain(req.body.Email);
        TID = tenantData.TID;
      }


      let userObject = {
        TID: TID,
        FName: req.body.FName,
        LName: req.body.LName,
        Email: req.body.Email,
        Pwd: req.body.Pwd,
        Status: 'A'
      }

      let signUpUser = await UserModel.createUser(userObject);
      if(signUpUser){
        res.json({Status: "Signup Successfull"});
        return;
      } else{
        res.json({Status: "Signup Failed"});
        return;
      }

    } catch (err) {
      res.status(500).json({ error: err.stack });
    }
  }

  async signin(req, res) {
    try {
      let { email, password } = req.body;

      if(!email){
        res.json( { messge: "EmailID missing in the request" } );
        return;
      }

      if(!password){
        res.json( { messge: "Password missing in the request" } );
        return;
      }

      var existedUser = await UserModel.checkUserExistsByEmail(email);
      let pwd = await bcrypt.compare(password,existedUser.Pwd);
      if(pwd){
        res.json({Status: "Signin Successfull"});
        return;
      } else{
        res.json({Status: "Signin Failed"});
        return;
      }
    } catch (err) {
      res.json(err.stack);
    }
  } //End of Signin function
}

const UserInfo = new userInfo();

module.exports = {
    signup: UserInfo.signup.bind(UserInfo),
    signin: UserInfo.signin.bind(UserInfo),
}
