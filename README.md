## To run the app locally, do following:

1. Clone repo:
   Run command "git clone https://github.com/sonukiwi/lattice-assignment-nodejs-mysql-repo.git"

2. Change to source code folder:
   Run command "cd lattice-assignment-nodejs-mysql-repo"

3. Install dependencies:
   Run command "npm install"

4. Run app:
   Run command "npm start"

Wait some time till you see "Server running on port ..." message in terminal.
Once you see above message, that means you have successfully run this app locally.

## Major libraries/frameworks used:

1. express: Express enables to build REST APIs faster and efficiently. It's simple to implement and has very big community.
2. mysql2: This library has been used to connect to MySQL database.
3. dotenv: This library has been used to load environment variables.
4. body-parser: This library has been used to parse HTTP request's body.
5. bcrypt: This library has been used to hash passwords so that hash of password is stored in database, not the password itself.
6. express-validator: This library has been used to validate incoming requests. It offers many built-in methods/mechanisms to validate data. Examples: Email validation, Length checking, Pattern matching, etc.
7. multer: This library has been used to streamline file uploading process. Using this library, file is first uploaded to local folder and then uploaded to S3 bucket thereafter.

## API Endpoints:

1. Register Patient : https://safe-waters-24787-76b424a936c8.herokuapp.com/v1/hospital/patients ( POST )
2. Fetch Psychiatrists : https://safe-waters-24787-76b424a936c8.herokuapp.com/v1/hospital/<hospital_id>/psychiatrists ( GET )

## Postman collection link : https://drive.google.com/file/d/1r_281Hv1zF39rmsCX3byuOusiEPHNpFR/view?usp=sharing

( Please download postman collection from above link and import in postman to test APIs)

## Overall working of APIs:

There are following three tables in this app:

1. Hospitals
2. Psychiatrists
3. Patients

Hospitals list was pre-defined in assignment.
There are minimum 5 psychiatrists in each hospital.
Each patient gets assigned to a psychiatrist. A random psychiatrist of all the available psychiatrists is chosen for a new patient.
