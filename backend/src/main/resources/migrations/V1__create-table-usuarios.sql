CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);

INSERT INTO usuarios (email, senha, role) 
VALUES ('admin@ufu', '$2a$10$fW3N5.eXo.ZpBvT.N6XmOun6qM/jS.pT1WvI2V6K8Yv5R2jZkK/2G', 'ADMIN');