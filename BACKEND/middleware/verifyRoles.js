const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const rolesArray = [...allowedRoles];
    if (!req.user?.roles) return res.sendStatus(403);
    const usersRoles = Object.values(req.body.roles);
    console.log("userroles ", usersRoles);
    console.log("rolesArray ", rolesArray);
    const allowed = rolesArray
      .map((role) => usersRoles.includes(role))
      .find((bool) => bool === true);
    if (!allowed) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
