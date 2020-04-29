export const isValidId = (id: number): boolean =>{
	return(id && typeof id === 'number' && Number.isInteger(id) && id > 0);
};

export const isValidStrings = (...strs: string[]): boolean => {
	return (strs.filter(str => !str || typeof str !== 'string').length == 0);
};

export const isValidObject = (obj: Object, ...nullableProps: string[]) => {
	return obj && Object.keys(obj).every(key => {
		if (key == 'id') return isValidId(obj['id']);
		if (nullableProps.includes(key)) return true;
		return obj[key];
	});
};

export const isPropertyOf = (prop: string, type: any) =>{
	if(!prop || !type){
		return false;
	}
	let typeCreator = <T>(Type: (new()=>T)): T =>{
		return new Type();
	};
	let tempInstance; 
	try{
		tempInstance = typeCreator(type);
	}catch{
		return false;
	}
	return Object.keys(tempInstance).includes(prop);
};

export const isCardValidObject = (obj: Object, ...nullableProps: string[]) => {
	return obj && Object.keys(obj).every(key => {
		if(key == 'card_price') return isValidPrice(obj['card_price']);
		if (key == 'card_name') return isValidStrings(obj['card_name']);
		if (nullableProps.includes(key)) return true;
		return obj[key];
	});
};
export const isValidPrice = (price: number): boolean =>{
	return(price && typeof price === 'number' && price > 0);
};

export function isEmptyObject<T>(obj: T){
	return obj && Object.keys(obj).length === 0;
}



export default{
	isValidId,
	isValidStrings,
	isValidObject,
	isCardValidObject,
	isValidPrice,
	isEmptyObject,
	isPropertyOf
};