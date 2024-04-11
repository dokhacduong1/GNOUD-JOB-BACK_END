export interface POPULATE {
    path: string,
    select?: string,
    model: any
    populate?: POPULATE[]

} 