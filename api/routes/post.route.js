import express from 'express'
const router = express.Router()

router.get('/api/test', ( req, res ) => {
    console.log("router is work!")
})

export default router