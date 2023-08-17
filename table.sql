create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE(email)
) 
CREATE TABLE category(
    id int NOT null AUTO_INCREMENT,
    name varchar(255) NOT null,
    PRIMARY KEY(id)
) 
CREATE TABLE product(
    id int NOT null AUTO_INCREMENT,
    name varchar(255) NOT null,
    categoyId integer NOT null,
    description varchar(255),
    price integer,
    status varchar(20),
    PRIMARY KEY(id)
)