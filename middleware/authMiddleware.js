const protect  = (req, res, next) => {
    const {user} = req.session

    console.log(user)

    if(user == null) {
        return res.status(401).json({status: 'fail', message:'unathorized' })
    }

    req.user = user

    next();
}


module.exports = protect