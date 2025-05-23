const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.roles) return res.sendStatus(403);
    const usersRoles = Object.keys(req.body.roles);
    console.log('userroles ', usersRoles )
    console.log('allowedRoles ',allowedRoles )
    const allowed = allowedRoles
      .map((role) => usersRoles.includes(role))
      .find((bool) => bool === true);
    if (!allowed) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
