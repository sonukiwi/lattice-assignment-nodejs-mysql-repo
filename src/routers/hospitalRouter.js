const express = require("express");
const hospitalRouter = express.Router();
const multer = require("multer");
const constants = require("../../constants.json");
const { register_patient } = require("../controllers/registerPatient");
const {
  fetch_psychiatrists_by_hospital,
} = require("../controllers/fetchPsychiatristsByHospital");
const {
  registerPatientValidator,
} = require("../validators/registerPatientValidator");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, constants.uploadsLocation); // directory where files will be saved
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // unique file name
  },
});

const multerUpload = multer({ storage });

hospitalRouter.post(
  "/patients",
  multerUpload.single("photo"),
  registerPatientValidator,
  register_patient
);

hospitalRouter.get("/:id/psychiatrists", fetch_psychiatrists_by_hospital);

module.exports = { hospitalRouter };
