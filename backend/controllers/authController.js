import dotenv from "dotenv";
import {OAuth2Client} from "google-auth-library";
import axios from "axios";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";

dotenv.config();

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

async function verifyGoogleToken(token){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

const googleAuth = async (req, res) => {
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);
  
    const { email, name, sub } = payload;
  
    let user = await User.findOne({ email });
  
    if (!user) {
      user = await User.create({
        username: email,
        email,
        googleId: sub,
        isAdmin: false, // mặc định
      });
    }
  
    createToken(res, user._id); // tạo cookie jwt
  
    res.status(200).json({ user });
};

export default googleAuth;
