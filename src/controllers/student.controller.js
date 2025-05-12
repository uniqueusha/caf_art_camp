const pool = require("../../db");
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

// add student...
const addStudent = async (req, res) => {
    const college_name = req.body.college_name ? req.body.college_name.trim() : '';
    const address = req.body.address ? req.body.address.trim() : '';
    const city_id = req.body.city_id ? req.body.city_id : '';
    const state_id = req.body.state_id ? req.body.state_id : '';
    const pin_code = req.body.pin_code ? req.body.pin_code : '';
    const college_phone = req.body.college_phone ? req.body.college_phone.trim() : '';
    const college_email_id = req.body.college_email_id ? req.body.college_email_id.trim() : '';
    const hod_name = req.body.hod_name ? req.body.hod_name.trim() : '';
    const phone_number = req.body.phone_number ? req.body.phone_number : '';
    const hod_email_id = req.body.hod_email_id ? req.body.hod_email_id.trim() : '';
    const student_name = req.body.student_name ? req.body.student_name.trim() : '';
    const mobile1 = req.body.mobile1 ? req.body.mobile1 : '';
    const mobile2 = req.body.mobile2 ? req.body.mobile2 : '';
    const studnet_email_id = req.body.studnet_email_id ? req.body.studnet_email_id.trim() : '';
    const gender_id = req.body.gender_id ? req.body.gender_id : '';
    const meals = req.body.meals ? req.body.meals.trim() : '';
    const bloodgroup_id = req.body.bloodgroup_id ? req.body.bloodgroup_id : '';
    const course_id = req.body.course_id ? req.body.course_id : '';
    const year = req.body.year ? req.body.year : '';

    const studentLanguage = req.body.studentLanguage ? req.body.studentLanguage : [];
    const studentPDF = req.body.studentPDF ? req.body.studentPDF : [];


    if (!college_name) {
        return error422("College name is required.", res);
    } else if (!address) {
        return error422("Address is required.", res);
    } else if (!city_id) {
        return error422("City id is required.", res);
    } else if (!state_id) {
        return error422("State id is required.", res);
    } else if (!pin_code) {
        return error422("Pin code is required.", res);
    } else if (!college_phone) {
        return error422("College phone is required.", res);
    } else if (!college_email_id) {
        return error422("College email id is required.", res);
    } else if (!hod_name) {
        return error422("HOD name is required.", res);
    } else if (!phone_number) {
        return error422("Phone number is required.", res);
    } else if (!hod_email_id) {
        return error422("HOD email id is required.", res);
    } else if (!student_name) {
        return error422("Student name is required.", res);
    } else if (!mobile1) {
        return error422("Mobile1 is required.", res);
    } else if (!mobile2) {
        return error422("mobile2 is required.", res);
    } else if (!studnet_email_id) {
        return error422("Studnet email id is required.", res);
    } else if (!gender_id) {
        return error422("Gender id is required.", res);
    } else if (!meals) {
        return error422("Meals is required.", res);
    } else if (!bloodgroup_id) {
        return error422("Bloodgroup id is required.", res);
    } else if (!course_id) {
        return error422("Course id is required.", res);
    } else if (!year) {
        return error422("Year is required.", res);
    }



    // Check if city exists
    const cityQuery = "SELECT * FROM city WHERE city_id = ? ";
    const cityResult = await pool.query(cityQuery, [city_id]);
    if (cityResult[0].length == 0) {
        return error422("City Not Found.", res);
    }

    // Check if state exists
    const stateQuery = "SELECT * FROM state WHERE state_id = ? ";
    const stateResult = await pool.query(stateQuery, [state_id]);
    if (stateResult[0].length == 0) {
        return error422("State Not Found.", res);
    }

    // Check if gender exists
    const genderQuery = "SELECT * FROM gender WHERE gender_id = ? ";
    const genderResult = await pool.query(genderQuery, [gender_id]);
    if (genderResult[0].length == 0) {
        return error422("Gender Not Found.", res);
    }

    // Check if course exists
    const courseQuery = "SELECT * FROM course WHERE course_id = ? ";
    const courseResult = await pool.query(courseQuery, [course_id]);
    if (courseResult[0].length == 0) {
        return error422("Course Not Found.", res);
    }

    // Check if bloodgroup exists
    const bloodgroupQuery = "SELECT * FROM bloodgroup WHERE bloodgroup_id = ? ";
    const bloodgroupResult = await pool.query(bloodgroupQuery, [bloodgroup_id]);
    if (bloodgroupResult[0].length == 0) {
        return error422("Bloodgroup Not Found.", res);
    }

    // attempt to obtain a database connection
    let connection = await getConnection();

    try {

        //start a transaction
        await connection.beginTransaction();

        //insert into Student
        const insertStudentQuery = `INSERT INTO student (college_name, address, city_id, state_id, pin_code, college_phone, college_email_id, hod_name, phone_number, hod_email_id, student_name, mobile1, mobile2, studnet_email_id, gender_id, meals, bloodgroup_id, course_id, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertStudentValues = [college_name, address, city_id, state_id, pin_code, college_phone, college_email_id, hod_name, phone_number, hod_email_id, student_name, mobile1, mobile2, studnet_email_id, gender_id, meals, bloodgroup_id, course_id, year];
        const studentResult = await connection.query(insertStudentQuery, insertStudentValues);
        const student_id = studentResult[0].insertId;

        //insert into task stusent language details in Array
        let stusentLanguageArray = studentLanguage
        for (let index = 0; index < stusentLanguageArray.length; index++) {
            const element = stusentLanguageArray[index];
            const knowlanguage = element.knowlanguage ? element.knowlanguage.trim() : '';
            console.log(knowlanguage);


            if (!knowlanguage) {
                await query("ROLLBACK");
                return error422("Know language is require", res);
            }

            let insertStusentLanguageQuery = 'INSERT INTO student_language ( student_id, knowlanguage) VALUES (?, ?)';
            let insertStusentLanguagevalues = [student_id, knowlanguage];
            let insertStusentLanguageResult = await connection.query(insertStusentLanguageQuery, insertStusentLanguagevalues);
        }



        const fs = require('fs');
        const path = require('path');

        let studentPDFArray = studentPDF;
        for (let i = 0; i < studentPDFArray.length; i++) {
            const element = studentPDFArray[i];
            const base64PDF = element.pdf_location ? element.pdf_location.trim() : '';

            if (!base64PDF) {
                await connection.query("ROLLBACK");
                return error422("PDF Base64 content is required", res);
            }

            try {
                // Decode base64 to buffer
                const pdfBuffer = Buffer.from(base64PDF, 'base64');

                // Check file size (10MB)
                if (pdfBuffer.length > 10 * 1024 * 1024) {
                    await connection.query("ROLLBACK");
                    return error422("PDF file size under 10MB", res);
                }

                // Generate a unique filename
                const fileName = `student_${student_id}_${Date.now()}.pdf`;
                const filePath = path.join(__dirname, "..", "..","uploads", fileName); // Adjust path as needed

                // Write the file
                fs.writeFileSync(filePath, pdfBuffer);

                // Save relative path to DB (for example: uploads/pdfs/student_1234567890.pdf)
                const dbFilePath = `uploads/pdfs/${fileName}`;

                let insertStusentPDFQuery = 'INSERT INTO student_pdf (student_id, pdf_location) VALUES (?, ?)';
                let insertStusentPDFvalues = [student_id, dbFilePath];
                await connection.query(insertStusentPDFQuery, insertStusentPDFvalues);

            } catch (err) {
                await connection.query("ROLLBACK");
                return error500("Error processing PDF: " + err.message, res);
            }
        }


        // Commit the transaction
        await connection.commit();
        res.status(200).json({
            status: 200,
            message: "Student added successfully",
        });
    } catch (error) {
        return error500(error, res);
    } finally {
        if (connection) connection.release()
    }
}

module.exports = {
    addStudent
}