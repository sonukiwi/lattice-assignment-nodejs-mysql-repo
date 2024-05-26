const { validationResult } = require("express-validator");
const aws = require("aws-sdk");
const fs = require("fs");
const { fileUploadsFolder } = require("../../constants.json");
const { db } = require("../db_connection");
const { hash_password, execute_use_database_query } = require("../utils");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const DATABASE_NAME = "hospital_app_db";
const PSYCHIATRISTS_TABLE_NAME = "psychiatrists";
const PATIENTS_TABLE_NAME = "patients";

const get_all_psychiatrist_ids = async (tableName) => {
  const query = `SELECT id FROM ${tableName}`;
  const [rows] = await db.query(query);
  return rows.map((row) => row.id);
};

const insert_new_patient = async (
  { name, address, email, phone, password, photoUri, psychiatristId },
  tableName
) => {
  password = await hash_password(password);
  const query = `INSERT INTO ${tableName} (name, address, email, phone, password, photo, psychiatrist_id) VALUES(?, ?, ?, ?, ?, ?, ?)`;
  await db.query(query, [
    name,
    address,
    email,
    phone,
    password,
    photoUri,
    psychiatristId,
  ]);
};

const check_if_patient_already_registered = async (tableName, email) => {
  const query = `SELECT * FROM ${tableName} WHERE email=?`;
  const [rows] = await db.query(query, [email]);
  return rows.length > 0;
};

const register_patient = async (req, res) => {
  let responseDetails = {
    statusCode: 200,
    json: {},
  };
  try {
    const file = req.file;
    if (!file) {
      responseDetails = {
        statusCode: 400,
        json: {
          status: "FAILURE",
          message: "No file uploaded",
        },
      };
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseDetails = {
          statusCode: 400,
          json: {
            status: "FAILURE",
            message: "Invalid input",
            errors: errors.array(),
          },
        };
      } else {
        await execute_use_database_query(DATABASE_NAME);
        console.log("Successfully selected database");
        const isPatientAlreadyRegistered =
          await check_if_patient_already_registered(
            PATIENTS_TABLE_NAME,
            req.body.email
          );
        if (isPatientAlreadyRegistered) {
          responseDetails = {
            statusCode: 400,
            json: {
              status: "FAILURE",
              message: "Patient already registered",
            },
          };
        } else {
          console.log("Valid request. Starting registration process ...");
          const fileContent = fs.readFileSync(
            `${fileUploadsFolder}/${file.filename}`
          );
          const s3UploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file.filename,
            Body: fileContent,
            ContentType: file.mimetype,
          };
          await s3.upload(s3UploadParams).promise();
          console.log("Successfully uploaded file");
          const photoS3Uri = `s3://${process.env.S3_BUCKET_NAME}/${file.filename}`;
          const psychiatristIds = await get_all_psychiatrist_ids(
            PSYCHIATRISTS_TABLE_NAME
          );
          const randomPsychiatristId =
            psychiatristIds[Math.floor(Math.random() * psychiatristIds.length)];

          req.body.photoUri = photoS3Uri;
          req.body.psychiatristId = randomPsychiatristId;

          await insert_new_patient(req.body, PATIENTS_TABLE_NAME);
          console.log("Successfully inserted new patient");

          responseDetails.statusCode = 200;
          responseDetails.json = {
            status: "SUCCESS",
            message: "Patient registered successfully",
          };
        }
      }
      fs.unlinkSync(`${fileUploadsFolder}/${file.filename}`);
      console.log("Successfully deleted file from local folder");
    }
  } catch (err) {
    console.error(err);
    responseDetails = {
      statusCode: 500,
      json: {
        status: "FAILURE",
        message: "Unexpected error. Please try again.",
      },
    };
  }
  return res.status(responseDetails.statusCode).json(responseDetails.json);
};

module.exports = { register_patient };
