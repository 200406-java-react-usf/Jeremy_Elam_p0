export class UserProfile {
	user_un: string;
	id: number;
	fav_archetypes: string;
	fav_colors: object;
	fav_card: string;
	user_info: number;
	constructor (un:string, id:number, archetype: string, color: object, card: string, user_info: number){
		this.user_un = un;
		this.id =id;
		this.fav_archetypes = archetype;
		this.fav_colors = color;
		this.fav_card = card;
		this.user_info = user_info;
	}
}
