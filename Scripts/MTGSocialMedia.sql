--set search_path to project_0;
--set search_path to public;
--
--drop view full_profile_info;
--drop view full_card_info;
--drop table profile;
--drop table card_info;
--drop table card_sets;
--drop table users_info;
--drop table card_rarities;
--drop table user_roles;

create table user_roles(
	id serial, 
	name varchar(30) unique not null,
	constraint user_roles_pk primary key (id)
);

 
create table card_rarities (
	id serial,
	card_rarity  varchar(30) unique not null,
	constraint card_rarities_pk primary key(id)
);


create table users_info(
	id serial,
	user_fn varchar(30) not null ,
	user_ln varchar(30) not null,
	user_email varchar(30) not null,
	user_pw varchar(256) not null,
	role int not null,
	constraint user_info_pk primary key (id),
	constraint user_info_role foreign key(role) references user_roles on delete cascade on update cascade
);


create table card_sets(
	id serial, 
	card_set varchar(30) unique not null,
	release_date Date not null, 
	constraint card_sets_pk primary key(id)
);


create table card_info(
	id serial,
	card_name varchar(50)unique not null,
	card_set integer not null,
	card_rarity integer not null,
	card_price float not null,
	constraint card_info_pk primary key(id),
	constraint card_rarity_fk foreign key (card_rarity) references card_rarities,
	constraint card_set_fk foreign key (card_set) references card_sets
);


create table profile (
	profile_id serial,
	user_un varchar(30) not null,
	fav_archetypes varchar(30)not null,
	fav_color varchar(30) not null,
	fav_set int not null,
	fav_card int not null,
	id int not null unique,
	constraint profile_info_pk primary key(profile_id),
	constraint fav_set_fk foreign key (fav_set) references card_sets,
	constraint fav_card_fk foreign key (fav_card) references card_info,
	constraint id foreign key (id) references users_info on delete cascade on update cascade
);

insert into card_rarities (card_rarity) values ('Mythic'), ('Rare'), ('Uncommon'), ('Common');
select * from card_rarities;

insert into user_roles (name) values ('Admin'), ('User');
select * from user_roles;

insert into card_sets (card_set , release_date ) values ('war of the spark', '2019-05-03');
insert into card_sets (card_set , release_date ) 
values ('guilds of ravnica', '2018-10-05'), ('ravnica allegiance', '2019-01-25'), ('core set 2020', '2019-07-12'),
('throne of eldraine', '2019-10-04'), ('ikoria: lair of behemoths', '2020-04-24'), ('theros: beyond death', '2020-01-24');
select * from card_sets;

insert into card_info (card_name, card_set, card_rarity, card_price ) values ('nissa, who shakes the world', 1, 1, 8.96 );
insert into card_info (card_name, card_set, card_rarity, card_price ) values ('shatter the sky', 7, 2, 1.81 );
insert into card_info (card_name, card_set, card_rarity, card_price ) values ('sinister sabotage', 2, 3, 0.01 );
insert into card_info (card_name, card_set, card_rarity, card_price ) values ('lukka, coppercoat outcasst', 6, 1, 5.27);
insert into card_info (card_name, card_set, card_rarity, card_price ) values ('wildwood tracker', 5, 4, 0.01 );
insert into card_info (card_name, card_set, card_rarity, card_price ) values ('chandra''s spitfire', 4, 3, 0.03 );
insert into card_info (card_name, card_set, card_rarity, card_price ) values ('hero of precinct one',3 , 2, 0.14 );

insert into users_info (user_fn , user_ln , user_email ,user_pw, role )
values('jeremy', 'elam', 'jeremyelam@gmail.com','password', 1);
insert into users_info (user_fn , user_ln , user_email ,user_pw, role )
values('kennedy', 'wandelt', 'wandeltk@gmail.com','newerpassword', 2);
insert into users_info (user_fn , user_ln , user_email ,user_pw, role )
values('korey', 'keipe', 'keipek@gmail.com','newpassword', 2);
insert into users_info (user_fn , user_ln , user_email ,user_pw, role  )
values('abraham', 'selenke', 'slenkea@gmail.com','password', 2);
insert into users_info (user_fn , user_ln , user_email ,user_pw, role  )
values('kevin', 'wagenheim', 'wagenheimk@gmail.com','secretpassword', 1);

insert into profile  (user_un, fav_archetypes, fav_color, fav_set, fav_card, id)
values('lazyspell','bant', 'green', 1, 1, 1);
insert into profile  (user_un,fav_archetypes, fav_color, fav_set, fav_card, id)
values('spellyspell','naya', 'white', 4, 3, 2);
insert into profile  (user_un,fav_archetypes, fav_color, fav_set, fav_card, id)
values('spelly','sulti', 'black', 2, 4, 3);
insert into profile  (user_un,fav_archetypes, fav_color, fav_set, fav_card, id)
values('spellyspellspell','mono-blue', 'blue', 3, 2, 4);
insert into profile  (user_un,fav_archetypes, fav_color, fav_set, fav_card, id)
values('lazyqt','esper', 'green', 5, 6, 5);

create view full_card_info as
select card_info.id, card_info.card_name, card_sets.card_set,card_rarities.card_rarity, card_price from card_info 
	join card_sets on card_info.card_set = card_sets.id
	join card_rarities on card_info.card_rarity = card_rarities.id;

select * from profile;
select * from users_info;
select * from card_rarities;
select * from card_info;
select * from user_roles;
select * from card_sets;


create view full_profile_info as
select profile.user_un, profile.profile_id, profile.fav_archetypes , profile.fav_color , card_sets.card_set , card_info.card_name, users_info.id from profile
join users_info on users_info.id =  profile.id
join card_sets on card_sets.id = profile.fav_set 
join card_info on card_info.id = profile.fav_card;

select * from full_profile_info;

select * from full_profile_info where profile.fav_archetypes  = 'bant';
insert into profile(user_un, profile_id ,fav_archetypes, fav_color, fav_set, fav_card, id) values('test',)

select users_info.id, user_fn , user_ln , user_email ,user_pw, name
	from users_info
	left join user_roles 
	on users_info.role = user_roles.id
	
select 
	profile.user_un, 
	profile.profile_id, 
	profile.fav_archetypes , 
	profile.fav_color , 
	card_sets.card_set , 
	card_info.card_name, 
	users_info.id from profile join users_info on users_info.id =  profile.id join card_sets on card_sets.id = profile.fav_set join card_info on card_info.id = profile.fav_card;