
export interface Find {
    _id?:string,
    email?: string,
    password?: string,
    companyName?: RegExp,
    numberOfWorkers?: number,
    contactPersonName?: string,
    phoneNumber?: string,
    address?: string,
    image?: string,
    status? : string,
    token?: string,
    listApprovedUsers?: any,
    deleted? :boolean
}

