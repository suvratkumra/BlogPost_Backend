const protected = (req, res, next) => {
    if (req.session.loginAuth) {
        next();
    }
    else {
        res.status(401).json({ status: "Rejected", message: "You are not authorized..." });
        // next();
    }
}

module.exports = protected;