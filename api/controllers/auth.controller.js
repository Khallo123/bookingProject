import argon2 from 'argon2'
import prisma from '../lib/prisma.js'
import { defaultErrorMessage } from '../constants/constant.js'

export const register = async (req , res)=>{
    try {
        const {username, email, password} = req.body

    //Hash the password
    const hashedPassword = await argon2.hash(password, 10)

    // Created a new user
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })

    res.status(201).json({
        isSuccess: true,
        message: "User successfully created!"
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message: defaultErrorMessage
        })
    }
}

export const login = async (req , res)=>{
    try {
        const {username, password} = req.body


        //CHECK IF THE USER EXCISTED

        const user = await prisma.user.findUnique({
            where: {username}
        })
         
        if(!user){
            res.status(401).json({
                isSuccess: false,
                message: "Inviled Credentials!"
            })

            return
        }
         

        // CHECK THE PASSWORD

        const isPasswordValid = await argon2.verify(password, user.password)

        if(!isPasswordValid){
            res.status(401).json({
                isSuccess: false,
                message: "Inviled Credentials!"
            })

            return
        }

        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message: defaultErrorMessage
        })
    }
}

export const logout = (req , res)=>{
    //db oprations
}