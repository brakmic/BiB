export interface IMediaEntry {
	url: string[];
	publisher: string;
	form: string[];
	lang: string;
	city: string;
	author: string;
	ed: string;
	year: string;
	isbn: string[];
	title: string;
	oclcnum: string[];
}

export interface IWorldCatEntry {
	stat: string;
	list: IMediaEntry[];
}
