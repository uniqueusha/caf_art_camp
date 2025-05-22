const pool = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Function to obtain a database connection
const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        throw new Error("Failed to obtain database connection: " + error.message);
    }
};
//errror 422 handler...
error422 = (message, res) => {
    return res.status(422).json({
        status: 422,
        message: message
    });
}

//error 500 handler...
error500 = (error, res) => {
    return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: error
    });
}

//add admin/user
const addUser = async (req, res) => {
    const user_name = req.body.user_name ? req.body.user_name.trim() : "";
    const email_id = req.body.email_id ? req.body.email_id.trim() : "";
    const password = req.body.password ? req.body.password : "";
    if (!user_name) {
        return error422("User Name is required.", res);
    } else if (!email_id) {
        return error422("Email Id required.", res);
    } else if (!password) {
        return error422("Password is required.", res);
    }
    

    //check User Name already is exists or not
    const isExistUserNameQuery = `SELECT * FROM users WHERE LOWER(TRIM(user_name))= ?`;
    const isExistUserNameResult = await pool.query(isExistUserNameQuery, [
        user_name.toLowerCase(),
    ]);
    if (isExistUserNameResult[0].length > 0) {
        return error422(" User Name is already exists.", res);
    }

    // Check if email_id exists
    const checkUserQuery = "SELECT * FROM users WHERE LOWER(TRIM(email_id)) = ? AND status = 1";
    const checkUserResult = await pool.query(checkUserQuery, [email_id.toLowerCase()]);
    if (checkUserResult[0].length > 0) {
        return error422('Email id is already exists.', res);
    }
    

    // Attempt to obtain a database connection
    let connection = await getConnection();
    try {
        //Start the transaction
        await connection.beginTransaction();
        //insert into user
        const insertUserQuery = `INSERT INTO users (user_name, email_id) VALUES (?, ?)`;
        const insertUserValues = [ user_name, email_id];
        const insertuserResult = await connection.query(insertUserQuery, insertUserValues);
        const user_id = insertuserResult[0].insertId;

        const hash = await bcrypt.hash(password, 10); // Hash the password using bcrypt

        //insert into Untitled
        const insertUntitledQuery =
            "INSERT INTO untitleds (user_id, extenstions) VALUES (?,?)";
        const insertUntitledValues = [user_id, hash];
        const untitledResult = await connection.query(insertUntitledQuery, insertUntitledValues)

        //commit the transation
        await connection.commit();
        res.status(200).json({
            status: 200,
            message: `User added successfully`,
        });
    } catch (error) {
        await connection.rollback();
        return error500(error, res);
    } finally {
        await connection.release();
    }
};

//Login user...
const userLogin = async (req, res) => {
    const email_id = req.body.email_id ? req.body.email_id.trim() : "";
    const password = req.body.password ? req.body.password : "";
    if (!email_id) {
        return error422("Email Id is Required.", res);
    } else if (!password) {
        return error422("Password is Required.", res);
    }
    // Attempt to obtain a database connection
    let connection = await getConnection();
    try {
        //Start the transaction
        await connection.beginTransaction();
        // Check if the user with the provided user email id exists or not
        const checkUserQuery = "SELECT * FROM users WHERE LOWER(TRIM(email_id)) = ? AND status = 1";
        const checkUserResult = await connection.query(checkUserQuery, [email_id.toLowerCase()]);
        const check_user = checkUserResult[0][0];

        if (!check_user) {
            return error422("Authentication failed.", res);
        }
        // Check if the user with the provided Untitled id exists
        const checkUserUntitledQuery = "SELECT * FROM untitleds WHERE user_id = ?";
        const [checkUserUntitledResult] = await connection.query(checkUserUntitledQuery, [check_user.user_id]);
        const user_untitled = checkUserUntitledResult[0];

        if (!user_untitled) {
            return error422("Authentication failed.", res);
        }

        const isPasswordValid = await bcrypt.compare(password, user_untitled.extenstions);
        if (!isPasswordValid) {
            return error422("Password wrong.", res);
        }
        // Generate a JWT token
        const token = jwt.sign(
            {
                user_id: user_untitled.user_id,
                email_id: check_user.email_id,
            },
            "secret_this_should_be", // Use environment variable for secret key
            { expiresIn: "10h" }
        );
        const userDataQuery = `SELECT u.* FROM users u
        WHERE u.user_id = ? `;
        let userDataResult = await connection.query(userDataQuery, [check_user.user_id]);

        // Commit the transaction
        await connection.commit();
        return res.status(200).json({
            status: 200,
            message: "Authentication successfully",
            token: token,
            expiresIn: 36000000, // 10 hour in seconds,
            data: userDataResult[0][0],
        });

    } catch (error) {
        return error500(error, res)
    } finally {
        await connection.release();
    }
};


//State List Active
const getStateWma = async (req, res) => {

    // attempt to obtain a database connection
    let connection = await getConnection();

    try {

        //start a transaction
        await connection.beginTransaction();

        const getStateQuery = `SELECT * FROM state 
        WHERE status = 1 ORDER BY state`;

        const getStateResult = await connection.query(getStateQuery);
        const state = getStateResult[0];

        // Commit the transaction
        await connection.commit();

        return res.status(200).json({
            status: 200,
            message: "State retrieved successfully.",
            data: state,
        });
    } catch (error) {
        return error500(error, res);
    } finally {
        if (connection) connection.release()
    }

}

//City List Active
const getCityWma = async (req, res) => {
    const { state_id } = req.query;

    // attempt to obtain a database connection
    let connection = await getConnection();

    try {

        //start a transaction
        await connection.beginTransaction();

        let getCityQuery = `SELECT * FROM city WHERE 1 
        AND status = 1`;
        if (state_id) {
            getCityQuery += ` AND state_id = ${state_id}`;
        }
        getCityQuery += ` ORDER BY city`;
        const getCityResult = await connection.query(getCityQuery);
        const city = getCityResult[0];


        // Commit the transaction
        await connection.commit();

        return res.status(200).json({
            status: 200,
            message: "City retrieved successfully.",
            data: city,
        });
    } catch (error) {    
        return error500(error, res);
    } finally {
        if (connection) connection.release()
    }

}

//Bloodgroup List Active
const getBloodgroupWma = async (req, res) => {
    
    // attempt to obtain a database connection
    let connection = await getConnection();

    try {

        //start a transaction
        await connection.beginTransaction();

        const getBloodgroupQuery = `SELECT * FROM bloodgroup  
        WHERE status = 1 ORDER BY bloodgroup`;

        const getBloodgroupResult = await connection.query(getBloodgroupQuery);
        const bloodgroup = getBloodgroupResult[0];

        // Commit the transaction
        await connection.commit();

        return res.status(200).json({
            status: 200,
            message: "Bloodgroup retrieved successfully.",
            data: bloodgroup,
        });
    } catch (error) {
        return error500(error, res);
    } finally {
        if (connection) connection.release()
    }

}

//Course List Active
const getCourseWma = async (req, res) => {
    
    // attempt to obtain a database connection
    let connection = await getConnection();

    try {

        //start a transaction
        await connection.beginTransaction();

        const getCourseQuery = `SELECT * FROM course  
        WHERE status = 1 ORDER BY course`;

        const getCourseResult = await connection.query(getCourseQuery);
        const course = getCourseResult[0];

        // Commit the transaction
        await connection.commit();

        return res.status(200).json({
            status: 200,
            message: "Course retrieved successfully.",
            data: course,
        });
    } catch (error) {
        return error500(error, res);
    } finally {
        if (connection) connection.release()
    }

}

//Gender List Active
const getGenderWma = async (req, res) => {
    
    // attempt to obtain a database connection
    let connection = await getConnection();

    try {

        //start a transaction
        await connection.beginTransaction();

        const getGenderQuery = `SELECT * FROM gender  
        WHERE status = 1 ORDER BY gender`;

        const getGenderResult = await connection.query(getGenderQuery);
        const gender = getGenderResult[0];

        // Commit the transaction
        await connection.commit();

        return res.status(200).json({
            status: 200,
            message: "Gender retrieved successfully.",
            data: gender,
        });
    } catch (error) {
        return error500(error, res);
    } finally {
        if (connection) connection.release()
    }

}



//PDF Document Download 
const getDocumentDownload = async (req, res) => {
    let connection = await getConnection();
    try {
        await connection.beginTransaction();
        const filePath = path.join(__dirname, "..", "..", "document", "CAF ART CAMP - Konark Chapter 2025-26 (1).pdf");

        if (fs.existsSync(filePath)) {
            res.download(filePath, "Details-of-Art-Camp.pdf"); // Triggers file download
        } else {
            res.status(404).json({ message: "File not found" });
        }
    
        // res.status(200).json({
        //     status: 200,
        //     message: "PDF Donload successfully",
        // });
    } catch (error) {
        return error500(error, res);
    } finally {
        if (connection) connection.release();
    }
};




const getStudentDocumentDownload = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        await connection.beginTransaction();

        const { student_id } = req.query;

        const getStudentsQuery = `
            SELECT sp.pdf_location, s.student_name 
            FROM student_pdf sp
            LEFT JOIN student s ON s.student_id = sp.student_id
            WHERE sp.student_id = ?
        `;

        const [rows] = await connection.query(getStudentsQuery, [student_id]);
        
        if (!rows.length) {
            return res.status(404).json({ message: "No document found for this student" });
        }

        const pdfLocation = rows[0].pdf_location;
        const studentName = rows[0].student_name;

        // Define actual path to the PDF file
        // const filePath = path.join(__dirname, '..', '..', pdfLocation);
        const filePath = path.join(__dirname, '..','..', pdfLocation);
        // Format student name for filename (remove spaces, special characters, etc.)
        const safeStudentName = studentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
        const downloadFileName = `${safeStudentName}.pdf`;
        
        if (fs.existsSync(filePath)) {
            return res.download(filePath, downloadFileName);
        } else {
            return res.status(404).json({ message: "File not found on server" });
        }
    } catch (error) {
        return error500(error, res);
    } finally {
        if (connection) connection.release();
    }
};





module.exports = {
    addUser,
    getStateWma,
    getCityWma,
    getBloodgroupWma,
    getCourseWma,
    getGenderWma,
    userLogin,
    getDocumentDownload,
    getStudentDocumentDownload
}