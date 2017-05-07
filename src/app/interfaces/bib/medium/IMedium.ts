export interface IMedium {
    ID: number;
    Title: string;
    Author: string;
    Description: string;
    Year: number;
    ISBN: string;
    Picture: string;
    Type: number;
    IsAvailable: boolean;
    IsDeleted: boolean;
    DevelopmentPlan?: number;
}
