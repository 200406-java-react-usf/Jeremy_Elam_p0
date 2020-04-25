export class UserProfile {
	user_un: string;
	user_id: number;
	fav_archetypes: string;
	fav_colors: string;
	fav_card: string;
	location: string;

	constructor (un:string, id:number, archetype: string, color: string, card: string, location: string){
		this.user_un = un;
		this.user_id =id;
		this.fav_archetypes = archetype;
		this.fav_colors = color;
		this.fav_card = card;
		this.location = location;
	}
}
