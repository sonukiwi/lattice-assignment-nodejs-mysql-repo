const { db } = require("../db_connection");
const { execute_use_database_query, is_value_numeric } = require("../utils");

const DATABASE_NAME = "hospital_app_db";
const PSYCHIATRISTS_TABLE_NAME = "psychiatrists";
const PATIENTS_TABLE_NAME = "patients";
const HOSPITALS_TABLE_NAME = "hospitals";

const is_hospital_id_valid = async (tableName, hospitalId) => {
  const query = `SELECT * FROM ${tableName} WHERE id = ${hospitalId}`;
  const [rows] = await db.query(query);
  if (rows.length === 0) {
    return false;
  }
  return true;
};

const get_hospital_details = async (
  hospitalsTableName,
  patientsTableName,
  psychiatristsTableName,
  hospitalId
) => {
  const query = `SELECT 
  h.name AS hospital_name,
  COUNT(DISTINCT p.id) AS total_psychiatrists_count,
  COUNT(pt.id) AS total_patients_count,
  JSON_ARRAYAGG(
      JSON_OBJECT(
          'psychiatrist_id', p.id,
          'psychiatrist_name', p.name,
          'patients_count', COALESCE(pc.patient_count, 0)
      )
  ) AS psychiatrist_details
FROM 
  ${hospitalsTableName} h
LEFT JOIN 
  ${psychiatristsTableName} p ON h.id = p.hospital_id
LEFT JOIN (
  SELECT 
      psychiatrist_id, COUNT(*) AS patient_count
  FROM 
      ${patientsTableName}
  GROUP BY 
      psychiatrist_id
) pc ON p.id = pc.psychiatrist_id
LEFT JOIN 
  ${patientsTableName} pt ON p.id = pt.psychiatrist_id
WHERE 
  h.id = ?
GROUP BY 
  h.id`;
  const [rows] = await db.query(query, [hospitalId]);
  return rows[0];
};

const fetch_psychiatrists_by_hospital = async (req, res) => {
  let responseDetails = {
    statusCode: 200,
    json: {},
  };
  try {
    await execute_use_database_query(DATABASE_NAME);
    console.log("Successfully selected database");
    const { id: hospitalId } = req.params;
    const isHospitalIdNumeric = is_value_numeric(hospitalId);
    if (isHospitalIdNumeric === false) {
      responseDetails = {
        statusCode: 400,
        json: {
          status: "FAILURE",
          message: "Invalid hospital id.",
        },
      };
    } else {
      const isHospitalIdValid = await is_hospital_id_valid(
        HOSPITALS_TABLE_NAME,
        hospitalId
      );
      if (isHospitalIdValid === false) {
        responseDetails = {
          statusCode: 400,
          json: {
            status: "FAILURE",
            message: "Invalid hospital id.",
          },
        };
      } else {
        console.log("Hospital id is valid. Getting required info ...");
        const hospitalDetails = await get_hospital_details(
          HOSPITALS_TABLE_NAME,
          PATIENTS_TABLE_NAME,
          PSYCHIATRISTS_TABLE_NAME,
          hospitalId
        );
        hospitalDetails.psychiatrist_details =
          hospitalDetails.psychiatrist_details.filter(
            (item, index, self) =>
              index ===
              self.findIndex((t) => t.psychiatrist_id === item.psychiatrist_id)
          );
        responseDetails.statusCode = 200;
        responseDetails.json = {
          status: "SUCCESS",
          message: "Successfully fetched psychiatrists.",
          data: hospitalDetails,
        };
      }
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

module.exports = { fetch_psychiatrists_by_hospital };
