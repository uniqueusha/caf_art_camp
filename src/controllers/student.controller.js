const pool = require("../../db");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

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
    message: message,
  });
};

//error 500 handler...
error500 = (error, res) => {
  return res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    error: error,
  });
};

// add student...
const addStudent = async (req, res) => {
  const college_name = req.body.college_name
    ? req.body.college_name.trim()
    : "";
  const address = req.body.address ? req.body.address.trim() : "";
  const city= req.body.city ? req.body.city : "";
  const state_id = req.body.state_id ? req.body.state_id : "";
  const pin_code = req.body.pin_code ? req.body.pin_code : "";
  const college_phone = req.body.college_phone ? req.body.college_phone : "";
  const college_email_id = req.body.college_email_id
    ? req.body.college_email_id.trim()
    : "";
  const hod_name = req.body.hod_name ? req.body.hod_name.trim() : "";
  const phone_number = req.body.phone_number ? req.body.phone_number : "";
  const hod_email_id = req.body.hod_email_id
    ? req.body.hod_email_id.trim()
    : "";
  const student_name = req.body.student_name
    ? req.body.student_name.trim()
    : "";
  const mobile1 = req.body.mobile1 ? req.body.mobile1 : "";
  const mobile2 = req.body.mobile2 ? req.body.mobile2 : "";
  const studnet_email_id = req.body.studnet_email_id
    ? req.body.studnet_email_id.trim()
    : "";
  const gender_id = req.body.gender_id ? req.body.gender_id : "";
  const meals = req.body.meals ? req.body.meals.trim() : "";
  const bloodgroup_id = req.body.bloodgroup_id ? req.body.bloodgroup_id : "";
  const course_id = req.body.course_id ? req.body.course_id : "";
  const year = req.body.year ? req.body.year : "";

  const studentLanguage = req.body.studentLanguage
    ? req.body.studentLanguage
    : [];
  const studentPDF = req.body.studentPDF ? req.body.studentPDF : [];

  if (!college_name) {
    return error422("College name is required.", res);
  } else if (!address) {
    return error422("Address is required.", res);
  } else if (!city) {
    return error422("City is required.", res);
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

  //check studnet Email id already is exists or not
  const isExistStudentEmailQuery = `SELECT * FROM student WHERE studnet_email_id= ?`;
  const isExistStudentEmailResult = await pool.query(isExistStudentEmailQuery, [
    studnet_email_id,
  ]);
  if (isExistStudentEmailResult[0].length > 0) {
    return error422(" Student email is already exists.", res);
  }

  //check Mobile Number already is exists or not
  const isExistMobileNumberQuery = `SELECT * FROM student WHERE mobile1 = ?`;
  const isExistMobileNumberResult = await pool.query(isExistMobileNumberQuery, [
    mobile1,
  ]);
  if (isExistMobileNumberResult[0].length > 0) {
    return error422(" First Mobile Number is already exists.", res);
  }

  //check Mobile Number already is exists or not
  const isExistMobileNumber2Query = `SELECT * FROM student WHERE mobile2 = ?`;
  const isExistMobileNumber2Result = await pool.query(
    isExistMobileNumber2Query,
    [mobile2]
  );
  if (isExistMobileNumber2Result[0].length > 0) {
    return error422(" Second Mobile Number is already exists.", res);
  }

  // //check Mobile Number already is exists or not
  // const isExistPhoneNumber2Query = `SELECT * FROM student WHERE mobile2 = ?`;
  // const isExistMobileNumber2Result = await pool.query(isExistMobileNumber2Query, [mobile2]);
  // if (isExistMobileNumber2Result[0].length > 0) {
  //     return error422(" Second Mobile Number is already exists.", res);
  // }

  // Check if city exists
  // const cityQuery = "SELECT * FROM city WHERE city_id = ? ";
  // const cityResult = await pool.query(cityQuery, [city_id]);
  // if (cityResult[0].length == 0) {
  //   return error422("City Not Found.", res);
  // }

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
    const insertStudentQuery = `INSERT INTO student (college_name, address, city, state_id, pin_code, college_phone, college_email_id, hod_name, phone_number, hod_email_id, student_name, mobile1, mobile2, studnet_email_id, gender_id, meals, bloodgroup_id, course_id, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const insertStudentValues = [
      college_name,
      address,
      city,
      state_id,
      pin_code,
      college_phone,
      college_email_id,
      hod_name,
      phone_number,
      hod_email_id,
      student_name,
      mobile1,
      mobile2,
      studnet_email_id,
      gender_id,
      meals,
      bloodgroup_id,
      course_id,
      year,
    ];
    const studentResult = await connection.query(
      insertStudentQuery,
      insertStudentValues
    );
    const student_id = studentResult[0].insertId;

    //insert into task stusent language details in Array
    let stusentLanguageArray = studentLanguage;
    for (let index = 0; index < stusentLanguageArray.length; index++) {
      const element = stusentLanguageArray[index];
      const knowlanguage = element.knowlanguage
        ? element.knowlanguage.trim()
        : "";

      if (!knowlanguage) {
        await query("ROLLBACK");
        return error422("Know language is require", res);
      }

      let insertStusentLanguageQuery =
        "INSERT INTO student_language ( student_id, knowlanguage) VALUES (?, ?)";
      let insertStusentLanguagevalues = [student_id, knowlanguage];
      let insertStusentLanguageResult = await connection.query(
        insertStusentLanguageQuery,
        insertStusentLanguagevalues
      );
    }

    let studentPDFArray = studentPDF;
    for (let i = 0; i < studentPDFArray.length; i++) {
      const element = studentPDFArray[i];
      const base64PDF = element.pdf_location ? element.pdf_location.trim() : "";

      if (!base64PDF) {
        await connection.query("ROLLBACK");
        return error422("PDF Base64 content is required", res);
      }

      try {
        // Decode base64 to buffer
        const pdfBuffer = Buffer.from(base64PDF, "base64");

        // Check file size (10MB)
        if (pdfBuffer.length > 10 * 1024 * 1024) {
          await connection.query("ROLLBACK");
          return error422("PDF file size under 10MB", res);
        }

        // Generate a unique filename
        const fileName = `student_${student_id}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, "..", "..", "uploads", fileName); // Adjust path as needed

        // Write the file
        fs.writeFileSync(filePath, pdfBuffer);

        // Save relative path to DB (for example: uploads/pdfs/student_1234567890.pdf)
        const dbFilePath = `uploads/${fileName}`;

        let insertStusentPDFQuery =
          "INSERT INTO student_pdf (student_id, pdf_location) VALUES (?, ?)";
        let insertStusentPDFvalues = [student_id, dbFilePath];

        await connection.query(insertStusentPDFQuery, insertStusentPDFvalues);
      } catch (err) {
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
    if (connection) connection.release();
  }
};

// get student list...
const getStudents = async (req, res) => {
  const {
    page,
    perPage,
    key,
    fromDate,
    toDate,
    city,
    state_id,
    gender_id,
    bloodgroup_id,
    course_id,
    status,
  } = req.query;

  // attempt to obtain a database connection
  let connection = await getConnection();

  try {
    //start a transaction
    await connection.beginTransaction();

    let getStudentsQuery = `SELECT s.*,st.state, g.gender, b.bloodgroup, cr.course FROM student s
        LEFT JOIN state st
        ON s.state_id = st.state_id
        LEFT JOIN gender g
        ON s.gender_id = g.gender_id
        LEFT JOIN bloodgroup b
        ON s.bloodgroup_id = b.bloodgroup_id
        LEFT JOIN course cr
        ON s.course_id = cr.course_id
        WHERE 1`;

    let countQuery = `SELECT COUNT(*) AS total FROM student s
        LEFT JOIN state st
        ON s.state_id = st.state_id
        LEFT JOIN gender g
        ON s.gender_id = g.gender_id
        LEFT JOIN bloodgroup b
        ON s.bloodgroup_id = b.bloodgroup_id
        LEFT JOIN course cr
        ON s.course_id = cr.course_id
        WHERE 1`;

    if (key) {
      const lowercaseKey = key.toLowerCase().trim();
      if (lowercaseKey === "activated") {
        getStudentsQuery += ` AND status = 1`;
        countQuery += ` AND status = 1`;
      } else if (lowercaseKey === "deactivated") {
        getStudentsQuery += ` AND status = 0`;
        countQuery += ` AND status = 0`;
      } else {
        getStudentsQuery += ` AND (LOWER(s.college_name) LIKE '%${lowercaseKey}%' || LOWER(s.studnet_email_id) LIKE '%${lowercaseKey}%' || LOWER(s.student_name) LIKE '%${lowercaseKey}%' || LOWER(s.mobile1) LIKE '%${lowercaseKey}%' || LOWER(s.city) LIKE '%${lowercaseKey}%' || LOWER(st.state) LIKE '%${lowercaseKey}%')`;
        countQuery += ` AND (LOWER(s.college_name) LIKE '%${lowercaseKey}%' || LOWER(s.studnet_email_id) LIKE '%${lowercaseKey}%' || LOWER(s.student_name) LIKE '%${lowercaseKey}%' || LOWER(s.mobile1) LIKE '%${lowercaseKey}%' || LOWER(s.city) LIKE '%${lowercaseKey}%' || LOWER(st.state) LIKE '%${lowercaseKey}%')`;
      }
    }

    // from date and to date
    if (fromDate && toDate) {
      getStudentsQuery += ` AND DATE(s.cts) BETWEEN '${fromDate}' AND '${toDate}'`;
      countQuery += ` AND DATE(s.cts) BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if (status) {
      getStudentsQuery += ` AND s.status = ${status}`;
      countQuery += `  AND s.status = ${status}`;
    }

    if (city) {
      getStudentsQuery += ` AND s.city = ${city}`;
      countQuery += `  AND s.city = ${city}`;
    }

    if (state_id) {
      getStudentsQuery += ` AND s.state_id = ${state_id}`;
      countQuery += `  AND s.state_id = ${state_id}`;
    }

    if (gender_id) {
      getStudentsQuery += ` AND s.gender_id = ${gender_id}`;
      countQuery += `  AND s.gender_id = ${gender_id}`;
    }

    if (bloodgroup_id) {
      getStudentsQuery += ` AND s.bloodgroup_id = ${bloodgroup_id}`;
      countQuery += `  AND s.bloodgroup_id = ${bloodgroup_id}`;
    }

    if (course_id) {
      getStudentsQuery += ` AND s.course_id = ${course_id}`;
      countQuery += `  AND s.course_id = ${course_id}`;
    }

    getStudentsQuery += " ORDER BY s.cts DESC";

    // Apply pagination if both page and perPage are provided
    let total = 0;
    if (page && perPage) {
      const totalResult = await connection.query(countQuery);
      total = parseInt(totalResult[0][0].total);
      const start = (page - 1) * perPage;
      getStudentsQuery += ` LIMIT ${perPage} OFFSET ${start}`;
    }

    const result = await connection.query(getStudentsQuery);
    const students = result[0];

    //get footer
    for (let i = 0; i < students.length; i++) {
      const studentId = students[i].student_id;

      let studentLanguageQuery = `SELECT sl.* FROM student_language sl
            WHERE sl.student_id = ${studentId}`;
      studentLanguageResult = await connection.query(studentLanguageQuery);
      students[i]["studentLanguage"] = studentLanguageResult[0];

      let studentPdfQuery = `SELECT sp.* FROM student_pdf sp
            WHERE sp.student_id = ${studentId}`;
      studentPdfResult = await connection.query(studentPdfQuery);
      students[i]["studentPdf"] = studentPdfResult[0];
    }

    // Commit the transaction
    await connection.commit();
    const data = {
      status: 200,
      message: "Students retrieved successfully",
      data: students,
    };
    // Add pagination information if provided
    if (page && perPage) {
      data.pagination = {
        per_page: perPage,
        total: total,
        current_page: page,
        last_page: Math.ceil(total / perPage),
      };
    }

    return res.status(200).json(data);
  } catch (error) {
    return error500(error, res);
  } finally {
    if (connection) connection.release();
  }
};

// get task by id student...
const getStudent = async (req, res) => {
  const studentId = parseInt(req.params.id);

  // const { assigned_to, user_id, task_footer_id } = req.query;

  // attempt to obtain a database connection
  let connection = await getConnection();

  try {
    //start a transaction
    await connection.beginTransaction();

    let taskQuery = `SELECT s.*, st.state, g.gender, b.bloodgroup, cr.course FROM student s
        LEFT JOIN state st
        ON s.state_id = st.state_id
        LEFT JOIN gender g
        ON s.gender_id = g.gender_id
        LEFT JOIN bloodgroup b
        ON s.bloodgroup_id = b.bloodgroup_id
        LEFT JOIN course cr
        ON s.course_id = cr.course_id
        WHERE s.student_id = ?`;

    const studentResult = await connection.query(taskQuery, [studentId]);

    if (studentResult[0].length == 0) {
      return error422("Student Not Found.", res);
    }
    const student = studentResult[0][0];

    //get footer
    let studentLanguageQuery = `SELECT sl.* FROM student_language sl
            WHERE sl.student_id =?`;

    let studentLanguageResult = await connection.query(studentLanguageQuery, [
      studentId,
    ]);
    student["studentLanguage"] = studentLanguageResult[0];

    let studentPdfQuery = `SELECT sp.* FROM student_pdf sp
            WHERE sp.student_id = ?`;
    let studentPdfResult = await connection.query(studentPdfQuery, [studentId]);
    student["studentPdf"] = studentPdfResult[0];

    return res.status(200).json({
      status: 200,
      message: "Student Retrived Successfully",
      data: student,
    });
  } catch (error) {
    return error500(error, res);
  } finally {
    if (connection) connection.release();
  }
};

//student update...
const updateStudent = async (req, res) => {
  const studentId = parseInt(req.params.id);
  const college_name = req.body.college_name
    ? req.body.college_name.trim()
    : "";
  const address = req.body.address ? req.body.address.trim() : "";
  const city = req.body.city ? req.body.city : "";
  const state_id = req.body.state_id ? req.body.state_id : "";
  const pin_code = req.body.pin_code ? req.body.pin_code : "";
  const college_phone = req.body.college_phone
    ? req.body.college_phone.trim()
    : "";
  const college_email_id = req.body.college_email_id
    ? req.body.college_email_id.trim()
    : "";
  const hod_name = req.body.hod_name ? req.body.hod_name.trim() : "";
  const phone_number = req.body.phone_number ? req.body.phone_number : "";
  const hod_email_id = req.body.hod_email_id
    ? req.body.hod_email_id.trim()
    : "";
  const student_name = req.body.student_name
    ? req.body.student_name.trim()
    : "";
  const mobile1 = req.body.mobile1 ? req.body.mobile1 : "";
  const mobile2 = req.body.mobile2 ? req.body.mobile2 : "";
  const studnet_email_id = req.body.studnet_email_id
    ? req.body.studnet_email_id.trim()
    : "";
  const gender_id = req.body.gender_id ? req.body.gender_id : "";
  const meals = req.body.meals ? req.body.meals.trim() : "";
  const bloodgroup_id = req.body.bloodgroup_id ? req.body.bloodgroup_id : "";
  const course_id = req.body.course_id ? req.body.course_id : "";
  const year = req.body.year ? req.body.year : "";

  const studentLanguage = req.body.studentLanguage
    ? req.body.studentLanguage
    : [];
  const studentPDF = req.body.studentPDF ? req.body.studentPDF : [];

  if (!college_name) {
    return error422("College name is required.", res);
  } else if (!address) {
    return error422("Address is required.", res);
  } else if (!city) {
    return error422("City is required.", res);
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

  //check studnet Email id already is exists or not
  const isExistStudentEmailQuery = `SELECT * FROM student WHERE studnet_email_id = ? AND student_id != ?`;
  const isExistStudentEmailResult = await pool.query(isExistStudentEmailQuery, [
    studnet_email_id,
    studentId,
  ]);
  if (isExistStudentEmailResult[0].length > 0) {
    return error422(" Student email is already exists.", res);
  }

  //check Mobile Number already is exists or not
  const isExistMobileNumberQuery = `SELECT * FROM student WHERE mobile1 = ? AND student_id != ?`;
  const isExistMobileNumberResult = await pool.query(isExistMobileNumberQuery, [
    mobile1,
    studentId,
  ]);
  if (isExistMobileNumberResult[0].length > 0) {
    return error422(" First Mobile Number is already exists.", res);
  }

  //check Mobile Number already is exists or not
  const isExistMobileNumber2Query = `SELECT * FROM student WHERE mobile2 = ? AND student_id != ?`;
  const isExistMobileNumber2Result = await pool.query(
    isExistMobileNumber2Query,
    [mobile2, studentId]
  );
  if (isExistMobileNumber2Result[0].length > 0) {
    return error422(" Second Mobile Number is already exists.", res);
  }

  // // Check if city exists
  // const cityQuery = "SELECT * FROM city WHERE city_id = ? ";
  // const cityResult = await pool.query(cityQuery, [city_id]);
  // if (cityResult[0].length == 0) {
  //   return error422("City Not Found.", res);
  // }

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

    // Check if student exists
    const studentQuery = "SELECT * FROM student WHERE student_id  = ? ";
    const studentResult = await connection.query(studentQuery, [studentId]);
    if (studentResult[0].length == 0) {
      return error422("Student Header Not Found.", res);
    }

    // Update the student record with new data
    let updateQuery = `
            UPDATE student
            SET college_name = ?, address = ?, city = ?, state_id = ?, pin_code = ?, college_phone = ?, college_email_id = ?, hod_name = ?, phone_number = ?, hod_email_id = ?, student_name = ?, mobile1 = ?, mobile2 = ?, studnet_email_id = ?, gender_id = ?, meals = ?, bloodgroup_id = ?, course_id = ?, year = ?
            WHERE student_id = ?`;

    let updateResult = await connection.query(updateQuery, [
      college_name,
      address,
      city,
      state_id,
      pin_code,
      college_phone,
      college_email_id,
      hod_name,
      phone_number,
      hod_email_id,
      student_name,
      mobile1,
      mobile2,
      studnet_email_id,
      gender_id,
      meals,
      bloodgroup_id,
      course_id,
      year,
      studentId,
    ]);

    //insert into student footer details in Array
    let studentLanguageArray = studentLanguage;
    for (let index = 0; index < studentLanguageArray.length; index++) {
      const element = studentLanguageArray[index];
      const student_language_id = element.student_language_id
        ? element.student_language_id.trim()
        : "";
      const knowlanguage = element.knowlanguage
        ? element.knowlanguage.trim()
        : "";

      if (!knowlanguage) {
        await query("ROLLBACK");
        return error422("Know language is require", res);
      }

      if (student_language_id) {
        let updateStusentLanguageQuery = `UPDATE student_language SET knowlanguage = ? WHERE student_id= ? AND student_language_id = ?  `;
        let updateStusentLanguagevalues = [
          knowlanguage,
          studentId,
          student_language_id,
        ];
        let updateStusentLanguageResult = await connection.query(
          updateStusentLanguageQuery,
          updateStusentLanguagevalues
        );
      } else {
        let insertStusentLanguageQuery =
          "INSERT INTO student_language ( student_id, knowlanguage) VALUES (?, ?)";
        let insertStusentLanguagevalues = [studentId, knowlanguage];
        let insertStusentLanguageResult = await connection.query(
          insertStusentLanguageQuery,
          insertStusentLanguagevalues
        );
      }
    }
    let studentPDFArray = studentPDF;
    for (let i = 0; i < studentPDFArray.length; i++) {
      const element = studentPDFArray[i];
      const student_pdf_id = element.student_pdf_id
        ? element.student_pdf_id
        : "";
      const base64PDF = element.pdf_location ? element.pdf_location.trim() : "";

      if (!base64PDF) {
        await connection.query("ROLLBACK");
        return error422("PDF Base64 content is required", res);
      }

      try {
        // Decode base64 to buffer
        const pdfBuffer = Buffer.from(base64PDF, "base64");

        // Check file size (10MB)
        if (pdfBuffer.length > 10 * 1024 * 1024) {
          await connection.query("ROLLBACK");
          return error422("PDF file size under 10MB", res);
        }

        // Generate a unique filename
        const fileName = `student_${studentId}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, "..", "..", "uploads", fileName); // Adjust path as needed

        // Write the file
        fs.writeFileSync(filePath, pdfBuffer);

        // Save relative path to DB (for example: uploads/pdfs/student_1234567890.pdf)
        const dbFilePath = `uploads/${fileName}`;

        // if (student_pdf_id) {
        let updateStusentPDFQuery = `UPDATE student_pdf SET pdf_location = ? WHERE student_id= ? AND student_pdf_id = ?  `;
        let updateStusentPDFvalues = [dbFilePath, studentId, student_pdf_id];
        let updateStusentPDFResult = await connection.query(
          updateStusentPDFQuery,
          updateStusentPDFvalues
        );
        // } else {

        //     let insertStusentPDFQuery = 'INSERT INTO student_pdf (student_id, pdf_location) VALUES (?, ?)';
        //     let insertStusentPDFvalues = [studentId, dbFilePath];
        //     await connection.query(insertStusentPDFQuery, insertStusentPDFvalues);

        // }
      } catch (err) {
        await connection.query("ROLLBACK");
        return error500("Error processing PDF: " + err.message, res);
      }
    }

    // Commit the transaction
    await connection.commit();

    return res.status(200).json({
      status: 200,
      message: "Task updated successfully.",
    });
  } catch (error) {
    return error500(error, res);
  } finally {
    if (connection) connection.release();
  }
};

//download
const getStudentDownload = async (req, res) => {
  const {
    key,
    fromDate,
    toDate,
    city,
    state_id,
    gender_id,
    bloodgroup_id,
    course_id,
  } = req.query;

  let connection = await getConnection();
  try {
    await connection.beginTransaction();

    let getStudentsQuery = `SELECT s.*,st.state, g.gender, b.bloodgroup, cr.course FROM student s
        LEFT JOIN state st
        ON s.state_id = st.state_id
        LEFT JOIN gender g
        ON s.gender_id = g.gender_id
        LEFT JOIN bloodgroup b
        ON s.bloodgroup_id = b.bloodgroup_id
        LEFT JOIN course cr
        ON s.course_id = cr.course_id
      WHERE 1 AND s.status = 1`;;

    if (key) {
      const lowercaseKey = key.toLowerCase().trim();
      getStudentsQuery += ` AND (LOWER(s.college_name) LIKE '%${lowercaseKey}%' || LOWER(s.studnet_email_id) LIKE '%${lowercaseKey}%' || LOWER(s.student_name) LIKE '%${lowercaseKey}%' || LOWER(s.mobile1) LIKE '%${lowercaseKey}%' || LOWER(s.city) LIKE '%${lowercaseKey}%' || LOWER(st.state) LIKE '%${lowercaseKey}%')`;
    }

    // from date and to date
    if (fromDate && toDate) {
      getStudentsQuery += ` AND DATE(s.cts) BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    if (city) {
      getStudentsQuery += ` AND s.city = ${city}`;
    }

    if (state_id) {
      getStudentsQuery += ` AND s.state_id = ${state_id}`;
    }

    if (gender_id) {
      getStudentsQuery += ` AND s.gender_id = ${gender_id}`;
    }

    if (bloodgroup_id) {
      getStudentsQuery += ` AND s.bloodgroup_id = ${bloodgroup_id}`;
    }

    if (course_id) {
      getStudentsQuery += ` AND s.course_id = ${course_id}`;
    }

    getStudentsQuery += " ORDER BY s.cts DESC";

    let result = await connection.query(getStudentsQuery);
    let students = result[0];

    if (students.length === 0) {
      return error422("No data found.", res);
    }

    //get footer
    for (let i = 0; i < students.length; i++) {
      const studentId = students[i].student_id;

      let studentLanguageQuery = `SELECT sl.* FROM student_language sl
            WHERE sl.student_id = ${studentId}`;
      studentLanguageResult = await connection.query(studentLanguageQuery);
      students[i]["studentLanguage"] = studentLanguageResult[0];

      let studentPdfQuery = `SELECT sp.* FROM student_pdf sp
            WHERE sp.student_id = ${studentId}`;
      studentPdfResult = await connection.query(studentPdfQuery);
      students[i]["studentPdf"] = studentPdfResult[0];
    }
    // Add "Sr No" column
    students = students.map((item, index) => ({
     "Sr No": students.length - index, 
      Date: item.cts,
      "College Name": item.college_name,
      Address: item.address,
      "State": item.state,
      "City": item.city,
      "Pin Code": item.pin_code,
      "Phone Number": item.college_phone,
      "College Email Id": item.college_email_id,
      "Hod Name": item.hod_name,
      "HOD Mobile Number": item.phone_number,
      "Hod Email Id": item.hod_email_id,
      "Student Name": item.student_name,
      "Mobile Number 1": item.mobile1,
      "Mobile Number 2": item.mobile2,
      "Studnet Email Id": item.studnet_email_id,
      "Gender": item.gender,
      "Meals": item.meals,
      "Blood Group": item.bloodgroup,
      "Course": item.course,
      "Year": item.year,
   
      Status: item.status === 1 ? "activated" : "deactivated",
      "Languages Known": item.studentLanguage
        .map((lang) => lang.knowlanguage)
        .join(", "),
      "PDF Files": item.studentPdf
        .map(
          (pdf) =>
            `https://wmits.xyz:3002/v1/api/admin/student-document-download?student_id=${item.student_id}`
        )
        .join(", "),
    }));

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Create a worksheet and add only required columns
    const worksheet = xlsx.utils.json_to_sheet(students);

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "StudentsInfo");

    // Create a unique file name
    const excelFileName = `exported_data_${Date.now()}.xlsx`;

    // Write the workbook to a file
    xlsx.writeFile(workbook, excelFileName);

    // Send the file to the client
    res.download(excelFileName, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error downloading the file.");
      } else {
        fs.unlinkSync(excelFileName);
      }
    });

    await connection.commit();
  } catch (error) {
    return error500(error, res);
  } finally {
    if (connection) connection.release();
  }
};

// get student count...
const getStudentsCount = async (req, res) => {
  // attempt to obtain a database connection
  let connection = await getConnection();

  try {
    //start a transaction
    await connection.beginTransaction();

    let getStudentsQuery = `SELECT COUNT(*) AS total FROM student s
        LEFT JOIN state st
        ON s.state_id = st.state_id
        LEFT JOIN gender g
        ON s.gender_id = g.gender_id
        LEFT JOIN bloodgroup b
        ON s.bloodgroup_id = b.bloodgroup_id
        LEFT JOIN course cr
        ON s.course_id = cr.course_id
        WHERE 1`;

    const result = await connection.query(getStudentsQuery);
    const studentsCount = result[0];

    // Commit the transaction
    await connection.commit();
    const data = {
      status: 200,
      message: "Students Count successfully",
      data: studentsCount,
    };

    return res.status(200).json(data);
  } catch (error) {
    return error500(error, res);
  } finally {
    if (connection) connection.release();
  }
};

const getMonthWiseStudentsCount = async (req, res) => {
  const currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ); // 1st of the month
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ); // Last day of the month

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  let connection = await getConnection();

  try {
    await connection.beginTransaction();

    //Corrected query: Group by DATE(s.cts)
    let studentCountQuery = `
        SELECT DATE(s.cts) AS date, COUNT(*) AS total 
        FROM student s
        LEFT JOIN state st ON s.state_id = st.state_id
        LEFT JOIN gender g ON s.gender_id = g.gender_id
        LEFT JOIN bloodgroup b ON s.bloodgroup_id = b.bloodgroup_id
        LEFT JOIN course cr ON s.course_id = cr.course_id
        WHERE DATE(s.cts) BETWEEN ? AND ?
        GROUP BY DATE(s.cts)
        ORDER BY DATE(s.cts)`;

    const [studentCounts] = await connection.query(studentCountQuery, [
      formattedStartDate,
      formattedEndDate,
    ]);

    // Create a list of all dates in the current month
    const allDatesInMonth = [];
    let dateIterator = new Date(startDate);
    while (dateIterator <= endDate) {
      allDatesInMonth.push(formatDate(dateIterator));
      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    // Map query result to object
    const studentCountMap = {};
    studentCounts.forEach((row) => {
      const formattedRowDate = formatDate(new Date(row.date));
      studentCountMap[formattedRowDate] = {
        total: row.total,
      };
    });

    // Construct final result
    const finalResult = allDatesInMonth.map((date) => {
      const counts = studentCountMap[date] || { total: 0 };
      return {
        date,
        total: counts.total,
      };
    });

    await connection.commit();
    return res.status(200).json({
      status: 200,
      message: "Date-wise student count retrieved successfully",
      data: finalResult,
    });
  } catch (error) {
    return error500(error, res);
  } finally {
    if (connection) connection.release();
  }
};

//student status change
const onStatusChange = async (req, res) => {
  const studentId = parseInt(req.params.id);
  const status = parseInt(req.query.status); // Validate and parse the status parameter
  // Attempt to obtain a database connection
  let connection = await getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();
    // Check if the student  exists
    const studentQuery = "SELECT * FROM student WHERE student_id = ?";
    const studentResult = await connection.query(studentQuery, [studentId]);

    if (studentResult[0].length == 0) {
      return res.status(404).json({
        status: 404,
        message: "Student Not Found.",
      });
    }

    // Validate the status parameter
    if (status !== 0 && status !== 1) {
      return res.status(400).json({
        status: 400,
        message:
          "Invalid status value. Status must be 0 (inactive) or 1 (active).",
      });
    }

    // Soft update the student status
    const updateQuery = `
              UPDATE student
              SET status = ?
              WHERE student_id = ?`;

    await connection.query(updateQuery, [status, studentId]);

    const statusMessage = status === 1 ? "activated" : "deactivated";
    //commit the transation
    await connection.commit();
    return res.status(200).json({
      status: 200,
      message: `Student ${statusMessage} successfully.`,
    });
  } catch (error) {
    return error500(error, res);
  } finally {
    await connection.release();
  }
};
// Change status of multiple students
const onSoftDeleteMultipleStudents = async (req, res) => {
  let { studentIds } = req.body;

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "studentIds must be a non-empty array",
    });
  }

  const status = 0; // soft delete = inactive

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const updateQuery = `UPDATE student SET status = ? WHERE student_id = ?`;

    for (const rawId of studentIds) {
      const id = parseInt(rawId);
      if (isNaN(id)) {
        await connection.rollback();
        return res.status(400).json({
          status: 400,
          message: `Invalid student_id: ${rawId}`,
        });
      }
      await connection.query(updateQuery, [status, id]);
    }

    await connection.commit();

    return res.status(200).json({
      status: 200,
      message: `Selected students Delete successfully.`,
    });
  } catch (error) {
    console.error("Error during soft delete:", error.message);
    await connection.rollback();
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    await connection.release();
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  getStudentDownload,
  getStudentsCount,
  getMonthWiseStudentsCount,
  onStatusChange,
  onSoftDeleteMultipleStudents
};
