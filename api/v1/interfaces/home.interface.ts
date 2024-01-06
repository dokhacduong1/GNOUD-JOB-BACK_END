
export interface Find {
    _id?:any,
    deleted?: boolean,
    status?: string,
    slug? :string,
    $or?: any,
    $and?: any
}

