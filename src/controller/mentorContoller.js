import express from 'express'
import mentorService from '../services/mentorService.js'

const mentorController = express.Router()

mentorController.get('/mentor', mentorService.getAllMentor)
mentorController.post('/mentor', mentorService.postMentor)
mentorController.get('/student', mentorService.getStudents)
mentorController.post('/student', mentorService.addStudent)
mentorController.get('/student/unassigned', mentorService.getUnassignedStudents); // Get students without mentor
mentorController.post('/mentor/assign-students', mentorService.assignStudentsToMentor); // Assign students to a mentor
mentorController.put('/student/:studentId/assign-mentor', mentorService.assignOrChangeMentor);
mentorController.get('/mentors/:mentorId/students', mentorService.getStudentsByMentor);
mentorController.get('/students/:studentId/mentor-history', mentorService.getPreviousMentors);
export default mentorController