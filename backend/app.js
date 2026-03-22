require('dotenv').config();
const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const citizenRouter = require('./routes/citizenRouter')
const departmentRouter = require('./routes/departmentRouter')
const cors = require('cors');
const connectDB = require('./config/mongoose-connection');
const dbgr = require('debug');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get('/', (req, res)=>{
    res.send("backend is running...");
})

app.use('/users',userRouter)
 app.use('/citizen', citizenRouter);
 app.use('/department', departmentRouter);


connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server running");
  });
});