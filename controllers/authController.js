const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signUp = async (req, res) => {

    const {username, password} = req.body
    try {
        
        const hashpassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username: username,
            userpassword: hashpassword
        })
        req.session.user = newUser
        res.status(201).json({
            satus: 'success',
            data: newUser
        })
    }
    catch(e) {
        console.log(e)
        res.status(400).json({
            status: 'failed'
        })
    }
}


exports.login = async(req, res) => {
    const {username, password} = req.body

     try {
        const user = await User.findOne({username})
        /***console.log(user) ***/
        if(!user) {
            req.session.user = null
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
           
        }
        
        const isCorrect = await bcrypt.compare(password, user.userpassword)

        if(isCorrect) {
            req.session.user = user
            res.status(200).json({
            satus: 'success'
        })
        } else {
            req.session.user = null 
            res.status(400).json({
                status: 'fail',
                message: 'incorrect user or pass'
            })
        }
        
    }
    catch(e) {
        console.log(e)
        res.status(400).json({
            status: 'failed'
        })
    }

}