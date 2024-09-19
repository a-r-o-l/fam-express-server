import jwt from "jsonwebtoken";

const authenticateToken = (
  req,
  res,
  next
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, account) => {
    if (err) return res.sendStatus(401);
    req.account = account;
    next();
  });
};

export default authenticateToken;
