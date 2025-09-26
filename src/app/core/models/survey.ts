export interface Survey {
	user: string | undefined;
	fullName: string;
	age: number;
	phone: string;
	favGames: string[];
	satisfaction: number;
	revisit: string;
	comments: string;
}