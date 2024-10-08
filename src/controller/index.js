import express from 'express'
import mentorController from './mentorContoller.js'

const controller = express.Router()

controller.use('/assign', mentorController)

export default controller