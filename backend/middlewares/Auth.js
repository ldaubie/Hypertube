const Auth = {
	isLoggedIn: function(req, res, next) {
		if (req.user)
			next();
		else
			res.status(401).send({status: 'error', message: "unauthorized"});
	}
};

module.exports = Auth;