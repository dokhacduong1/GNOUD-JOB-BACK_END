
export interface Find {
    _id?:string,
    title?: RegExp,
    status?:string,
    deleted? :boolean,
    featured?:boolean,
    salary?: {$gt : number} | {$lt : number},
    level?: string,
    job_categorie_id?:string
}
