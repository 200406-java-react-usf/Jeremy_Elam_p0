export class UserProfile {
	user_un: string;
	profile_id: number;
	fav_archetypes: string;
	fav_colors: string;
	card_set: string;
	card_name: string;
	user_info: number;
	constructor (un:string, id:number, archetype: string, color: string,set: string, card: string, user_info: number){
		this.user_un = un;
		this.profile_id =id;
		this.fav_archetypes = archetype;
		this.fav_colors = color;
		this.card_set = set;
		this.card_name = card;
		this.user_info = user_info;
	}
}
