import dotenv from "dotenv";
import {OAuth2Client} from "google-auth-library";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";

dotenv.config();

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
 // xác minh token có hợp lệ không.
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

  // Lấy email, tên và ggid từ payload
  const { email, name, sub } = payload;

  // Kiểm tra xem user đã tồn tại trong database chưa
  let user = await User.findOne({ email });

  // Nếu user chưa tồn tại, tạo user mới
  if (!user) {
    user = await User.create({
      username: email,
      email,
      googleId: sub,
      isAdmin: false,
    });
  }

  const tokenString = createToken(res, user._id);

  res.status(200).json({
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    token: tokenString,
  });
};


export default googleAuth;
