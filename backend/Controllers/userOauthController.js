// controllers.js

import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

import { hash, compare as _compare } from "bcrypt";

const securePassword = async (password) => {
  try {
    const hashPassword = await hash(password, 10);
    return hashPassword;
  } catch (error) {
    console.log(error.message);
  }
};

export async function userRegistration(req, res) {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    const secPassword = await securePassword(password);
    const exist = await User.findOne({ email: email });
    if (exist) {
      res.json({
        alert: "Given email is already exist, please login.",
        status: false,
      });
    } else {
      const user = new User({
        name: name,
        email: email,
        password: secPassword,
      });
      const userData = await user.save();
      let token = sign({ userId: userData._id }, process.env.SECRET_TOKEN, {
        expiresIn: "1h",
      });
      res.json({ userData, status: true, token });
    }
  } catch (error) {
    console.log(error.message);
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email: email });
    if (exist) {
      const compare = await _compare(password, exist.password);
      if (compare) {
        let token = sign({ userId: exist._id }, process.env.SECRET_TOKEN, {
          expiresIn: "1h",
        });
        res.json({ userData: exist, status: true, token });
      } else {
        res.json({ err: "pass", alert: "Incorrect password !!" });
      }
    } else {
      res.json({
        err: "email",
        alert: "Account isn't exist, please register.",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}


// import { CognitoIdentityServiceProvider } from "aws-sdk";

// const cognito = new CognitoIdentityServiceProvider();

// function generateJwtToken(email){
//   const payload = {email:email};
//   const options = {
//     expiresIn: '3h', 
//   };
//   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
//   return token;
// }

// export async function userRegistration(req, res) {
//   try {
//     const { name, email, password } = req.body;
    
//     await cognito.signUp({
//       ClientId: process.env.AWS_COGNITO_CLIENT_ID,
//       Username: email,
//       Password: password,
//       UserAttributes: [
//         { Name: "name", Value: name },
//         { Name: "email", Value: email }
//       ]
//     }).promise();

//     const token = generateJwtToken(email); 

//     let user = {
//       username: name,
//       email : email,
//       token : token
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("User registration error:", error);
//     res.status(500).json({ error: "User registration failed" });
//   }
// }

// export async function userLogin(req, res) {
//   try {
//     const { email, password } = req.body;

//     const authResult = await cognito.adminInitiateAuth({
//       AuthFlow: "ADMIN_NO_SRP_AUTH",
//       UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
//       ClientId: process.env.AWS_COGNITO_CLIENT_ID,
//       AuthParameters: {
//         USERNAME: email,
//         PASSWORD: password
//       }
//     }).promise();

//     const token = generateJwtToken(email); 

//     // Return token to client
//     res.json({ token });
//   } catch (error) {
//     console.error("User login error:", error);
//     res.status(500).json({ error: "User login failed" });
//   }
// }
