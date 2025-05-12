const pool = require("../../db");

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

        const getCityQuery = `SELECT * FROM city WHERE state_id 
        AND status = 1 ORDER BY city`;

        const getCityResult = await connection.query(getCityQuery, [ state_id ]);
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


module.exports = {
    getStateWma,
    getCityWma,
    getBloodgroupWma,
    getCourseWma,
    getGenderWma
}