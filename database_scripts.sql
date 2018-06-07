Scripts to create database for ecommerce website:

CREATE TABLE pedidos (
    order_id SERIAL PRIMARY KEY,
    client_id int, 
    cod_rastreio_logistica varchar(256),
    id_pagamento varchar(256),
    cep_de_entrega varchar(256)
);


CREATE TABLE itens_do_pedido (
	order_id int,
	item_id varchar(256),
	quantidade int
);


INSERT INTO public.pedidos (client_id, cod_rastreio_logistica, id_pagamento, cep_de_entrega) VALUES (10, value2 , value3, ...);

INSERT INTO itens_do_pedido (order_id, item_id, quantidade) VALUES ();