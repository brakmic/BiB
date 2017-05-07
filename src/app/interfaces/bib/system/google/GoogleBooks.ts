export interface IndustryIdentifier {
    type: string;
    identifier: string;
}

// tslint:disable-next-line:interface-name
export interface ReadingMode {
    text: boolean;
    image: boolean;
}

// tslint:disable-next-line:interface-name
export interface VolumeInfo {
    title: string;
    authors: string[];
    publishedDate: string;
    industryIdentifiers: IndustryIdentifier[];
    readingModes: ReadingMode;
    pageCount: number;
    printType: string;
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    imageLinks: ImageLink;
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
}

export interface ImageLink {
    smallThumbnail: string;
    thumbnail: string;
}

// tslint:disable-next-line:interface-name
export interface SaleInfo {
    country: string;
    saleability: string;
    isEbook: boolean;
}

// tslint:disable-next-line:interface-name
export interface Epub {
    isAvailable: boolean;
}

// tslint:disable-next-line:interface-name
export interface Pdf {
    isAvailable: boolean;
}

// tslint:disable-next-line:interface-name
export interface AccessInfo {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: Epub;
    pdf: Pdf;
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
}

// tslint:disable-next-line:interface-name
export interface SearchInfo {
    textSnippet: string;
}

export interface Item {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: VolumeInfo;
    saleInfo: SaleInfo;
    accessInfo: AccessInfo;
    searchInfo: SearchInfo;
}

// tslint:disable-next-line:interface-name
export interface IGoogleBook {
    kind: string;
    totalItems: number;
    items: Item[];
}
