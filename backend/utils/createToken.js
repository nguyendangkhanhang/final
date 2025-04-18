import jwt from "jsonwebtoken";

const createToken = (res, userId, isAdmin = false) => {
  const token = jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie(isAdmin ? "adminToken" : "jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
  });

  return token; // Trả về token để gửi cho frontend
};

export default createToken;
