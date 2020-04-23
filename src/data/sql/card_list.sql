drop table card_list;
create table card_list(
	card_name varchar(30) NOT NULL PRIMARY KEY,
	card_set varchar(30),
	card_rarity varchar(30),
	card_price int
);

select * from card_list