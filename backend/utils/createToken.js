import jwt from "jsonwebtoken";

const createToken = (res, userId, isAdmin = false) => {
  const token = jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token; 
};

export default createToken;