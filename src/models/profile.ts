export class UserProfile {
	user_un: string;
	profile_id: number;
	fav_archetypes: string;
	fav_colors: string;
	card_set: string;
	card_name: string;
	id: number;
	constructor (un:string, profile_id:number, archetype: string, color: string,set: string, card: string, id: number){
		this.user_un = un;
		this.profile_id =profile_id;
		this.fav_archetypes = archetype;
		this.fav_colors = color;
		this.card_set = set;
		this.card_name = card;
		this.id = id;
	}
}
