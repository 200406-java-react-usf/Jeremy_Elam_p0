export class UserInfo {
	id: number;
	user_fn: string;
	user_ln: string;
	user_email: string;
	user_pw: string;
	role: string;

	constructor (us_id:number, fn:string, ln:string, email:string, pw:string, role: string){
		this.id = us_id;
		this.user_fn = fn;
		this.user_ln = ln;
		this.user_email = email;
		this.user_pw = pw;
		this.role = role
	}
}