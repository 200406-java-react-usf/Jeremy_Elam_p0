export class Cards{
	id: number;
	card_name: string;
	card_set: string;
	card_rarity: string;
	card_price: number;

	constructor(id:number,card_name: string, card_set: string, card_rarity: string, card_price: number){
		this.id = id;
		this.card_name = card_name;
		this.card_set = card_set;
		this.card_rarity = card_rarity;
		this.card_price = card_price;
	}
}