export interface UserSchema{
	id: number;
	user_fn: string;
	user_ln: string;
	user_email: string;
	user_pw: string;
	name: string;
}

export interface ProfileSchema{
	user_un: string;
	profile_id: number;
	fav_archetypes: string;
	fav_colors: string;
	card_set: string;
	card_name: string;
	user_info: number;
}

export interface CardSchema{
	id: number;
	card_name: string;
	card_set: string;
	card_rarity: string;
	card_price: number;
}