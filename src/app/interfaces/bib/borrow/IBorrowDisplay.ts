export interface IBorrowDisplay {
    ID: number;
    ReaderID: number;
    MediumID: number;
    ReaderName: string;
    MediumTitle: string;
    BorrowDate: string;
    ReturnDate: string;
    IsOverdue: boolean;
}
