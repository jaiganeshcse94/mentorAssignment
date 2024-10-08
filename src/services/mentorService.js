import mentorModal from '../model/mentorModal.js';
import { ObjectId } from 'mongodb';
const getAllMentor = async(req, res) => {
    try {
        let mentor = await mentorModal.allMentor()
        res.status(200).send({
            message: "Data Fetch Successfull",
            data: mentor
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}
const postMentor = async(req, res) => {
    try {
        let mentor = req.body
        let newMentor = await mentorModal.insertMentor(mentor);
        res.status(201).json({
            message: "Data Posted Successfull",
            data: newMentor
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getStudents = async(req, res) => {
    try {
        const students = await mentorModal.getAllStudents();
        res.status(200).send({
            message: "Data Fetch Successfull",
            data: students
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
};

const addStudent = async(req, res) => {
    try {
        const student = req.body;
        const newStudent = await mentorModal.createStudent(student);
        res.status(201).json({
            message: "Data Posted Successfull",
            data: newStudent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get students who do not have a mentor assigned
const getUnassignedStudents = async(req, res) => {
    try {
        const students = await mentorModal.getUnassignedStudents();
        res.status(200).json({
            message: `data load sucessfull`,
            data: students
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign multiple students to a mentor
const assignStudentsToMentor = async(req, res) => {
    try {
        const { mentorId, studentIds } = req.body; // mentorId and studentIds from request body
        const result = await mentorModal.assignStudentsToMentor(mentorId, studentIds);
        res.status(200).json({
            message: `${result.modifiedCount} students assigned to mentor`,
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignOrChangeMentor = async(req, res) => {
    try {
        const { studentId } = req.params; // Extract studentId from URL
        const { mentorId } = req.body; // Extract mentorId from request body

        // Validate both studentId and mentorId
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }
        if (!ObjectId.isValid(mentorId)) {
            return res.status(400).json({ message: 'Invalid mentor ID format' });
        }

        // Convert to ObjectId
        const studentObjectId = new ObjectId(studentId);
        const mentorObjectId = new ObjectId(mentorId);

        // Update the student with the new mentor
        const result = await mentorModel.updateStudentMentor(studentObjectId, mentorObjectId);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({
            message: 'Mentor assigned/changed successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentsByMentor = async(req, res) => {
    try {
        const { mentorId } = req.params; // Get mentorId from URL parameters

        // Validate mentorId
        if (!ObjectId.isValid(mentorId)) {
            return res.status(400).json({ message: 'Invalid mentor ID format' });
        }

        const students = await mentorModal.findStudentsByMentor(new ObjectId(mentorId));

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found for this mentor' });
        }
        res.status(200).json({
            message: `data success`,
            data: students
        }); // Return the list of students
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getPreviousMentors = async(req, res) => {
    try {
        const { studentId } = req.params; // Extract studentId from the URL

        // Validate studentId
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }

        // Fetch the student's mentor history
        const mentorHistory = await mentorModal.findPreviousMentors(new ObjectId(studentId));

        if (!mentorHistory || mentorHistory.length === 0) {
            return res.status(404).json({ message: 'No previous mentors found for this student' });
        }

        res.status(200).json({
            message: `data success`,
            data: mentorHistory
        }); // Return the mentor history
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getAllMentor,
    postMentor,
    getStudents,
    addStudent,
    getUnassignedStudents,
    assignStudentsToMentor,
    assignOrChangeMentor,
    getStudentsByMentor,
    getPreviousMentors
};