const express = require("express")
const mongoose  = require("mongoose")
const cors = require("cors")
const { MONGO_USER, MONGO_PASSWORD, MONNGO_IP, MONGO_PORT, SESSION_SECRET, REDIS_URL, REDIS_PORT } = require("./config/config")


const postRouter = require("./routes/postRouter")
const userRouter = require("./routes/userRoutes")
const session =  require("express-session")
const redis = require("redis")
let RedisStore = require("connect-redis")(session)
let redisClient = redis.createClient({
    host:REDIS_URL,
    port: REDIS_PORT
})
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONNGO_IP}:${MONGO_PORT}/?authSource=admin`;
const protect = require("./middleware/authMiddleware")

const connectwithRetry = () => {
    mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("succesfully connected to db"))
.catch((e) => {
        console.log(e)
       
})
}


connectwithRetry()

const app = express()

app.enable("trust proxy")
app.use(cors({}))
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUnintialized: false,
        httpOnly: true,
        maxAge: 30000000
    }
}))

app.use(express.json())

app.get("/api", (req, res) => {
    res.send("<h2>Hi There!!!2d<h2>")
    console.log("lala")
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)
const port  = process.env.PORT || 3000;

app.listen(port, () => {console.log(`listening on ${port}`)})