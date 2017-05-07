// tslint:disable-next-line:interface-name
export interface AuthorData {
	name: string;
	id: string;
}

// tslint:disable-next-line:interface-name
export interface Data {
	urls_text: string;
	marc_enc_level: string;
	lcc_number: string;
	isbn10: string;
	notes: string;
	physical_description_text: string;
	title: string;
	title_long: string;
	publisher_name: string;
	dewey_normal: string;
	book_id: string;
	edition_info: string;
	awards_text: string;
	author_data: AuthorData[];
	title_latin: string;
	subject_ids: any[];
	summary: string;
	isbn13: string;
	dewey_decimal: string;
	publisher_id: string;
	language: string;
	publisher_text: string;
}

export interface ISBNDbBook {
	index_searched: string;
	data: Data[];
}
