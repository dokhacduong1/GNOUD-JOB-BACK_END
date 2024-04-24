
export interface Find {
    _id?:string,
    email?: string,
    fullName?: string,
    password?: string,
    companyName?: RegExp,
    numberOfWorkers?: number,
    level?: string,
    contactPersonName?: string,
    phoneNumber?: string,
    address?: string,
    image?: string,
    status? : string,
    gender?: string,
    linkedin?: string,
    token?: string,
    listApprovedUsers?: any,
    deleted? :boolean
    code?: string,
    slug?: string,
    countJobs?:number
}

