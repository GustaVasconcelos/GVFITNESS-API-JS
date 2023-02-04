import express from "express";
import cors from 'cors'
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import Routes from "./src/routes.js";
import connectDatabase from "./src/database/db.js";

dotenv.config()

const app = express()


app.use(cors())

app.use(cookieParser())
app.use(express.json())
connectDatabase()

app.use(Routes)

const port = process.env.PORT || 5000

app.listen(port,(req,res) =>{
    console.log("Servidor rodando na porta "+port)
})
