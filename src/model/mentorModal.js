import { dbName, client } from './index.js'
import { ObjectId } from 'mongodb';
const allMentor = async() => {
    await client.connect()
    try {
        const db = client.db(dbName)
        const users = await db.collection('Mentor').find().toArray()
        return users
    } catch (error) {
        throw error
    } finally {
        await client.close()
    }
}

const insertMentor = async(mentor) => {
    await client.connect();
    try {
        const db = client.db(dbName);
        const result = await db.collection('Mentor').insertOne(mentor);
        return {...mentor, _id: result.insertedId };
    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
};

const getAllStudents = async() => {
    await client.connect();
    try {
        const db = client.db(dbName);
        const students = await db.collection('Students').find().toArray();
        return students;
    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
};

const createStudent = async(student) => {
    await client.connect();
    try {
        const db = client.db(dbName);
        const result = await db.collection('Students').insertOne(student);
        return {...student, _id: result.insertedId }; // Return student with inserted ID
    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
};

// Get students without mentors (mentorId is null)
const getUnassignedStudents = async() => {
    await client.connect();
    try {
        const db = client.db(dbName);
        const students = await db.collection('Students').find({ mentorId: { $exists: false } }).toArray();
        return students;
    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
};

// Assign multiple students to a mentor
const assignStudentsToMentor = async(mentorId, studentIds) => {
    await client.connect();
    try {
        const db = client.db(dbName);
        const result = await db.collection('Students').updateMany({ _id: { $in: studentIds.map(id => new ObjectId(id)) } }, // Use ObjectId without deprecation
            { $set: { mentorId: new ObjectId(mentorId) } } // Ensure mentorId is an ObjectId
        );
        return result;
    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
};

const updateStudentMentor = async(studentId, mentorId) => {
    await client.connect();
    try {
        const db = client.db(dbName);

        // Update the student's mentorId
        const result = await db.collection('Students').updateOne({ _id: studentId }, // Match student by _id
            { $set: { mentorId: mentorId } } // Set the new mentorId
        );

        return result; // Return the result of the update
    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
};
// Function to find students by mentorId
const findStudentsByMentor = async(mentorId) => {
    await client.connect();
    try {
        const db = client.db(dbName);

        // Query to find students with the specified mentorId
        const students = await db.collection('Students').find({ mentorId: mentorId }).toArray();

        return students; // Return the list of students
    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
};

// Function to retrieve the mentor history of a student
const findPreviousMentors = async(studentId) => {
    await client.connect();
    try {
        const db = client.db(dbName);

        // Query the student document by _id and project the mentorHistory field
        const student = await db.collection('Students').findOne({ _id: studentId }, { projection: { previousMentors: 1, _id: 0 } } // Only return mentorHistory
        );

        return student ? student.previousMentors : null;
    } catch (error) {
        throw error;
    } finally {
        await client.close();
    }
};

export default {
    allMentor,
    insertMentor,
    getAllStudents,
    createStudent,
    getUnassignedStudents,
    assignStudentsToMentor,
    updateStudentMentor,
    findStudentsByMentor,
    findPreviousMentors
}