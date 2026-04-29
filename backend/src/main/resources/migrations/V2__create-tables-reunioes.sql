CREATE TABLE reunioes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    participantes_atendidos INT,
    hora_inicio TIMESTAMP,
    hora_termino TIMESTAMP,
    duracao VARCHAR(50),
    tempo_medio_participacao VARCHAR(50),
    data_importacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participantes_reuniao (
    id SERIAL PRIMARY KEY,
    reuniao_id INT REFERENCES reunioes(id) ON DELETE CASCADE,
    nome VARCHAR(255),
    entrada TIMESTAMP,
    saida TIMESTAMP,
    duracao VARCHAR(50),
    email VARCHAR(255),
    upn_id VARCHAR(255),
    funcao VARCHAR(100),
    camera_ligada BOOLEAN,
    levantar_maos BOOLEAN,
    desativar_mudo BOOLEAN
);