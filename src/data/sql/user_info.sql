DROP TABLE user_info;
CREATE TABLE user_info(
	user_id INT NOT NULL PRIMARY KEY,
	user_firstName VARCHAR(30), 
	user_lastName VARCHAR(30),
	user_email VARCHAR(30),
	user_password VARCHAR(30),
	user_dob DATE
)

SELECT * FROM user_info