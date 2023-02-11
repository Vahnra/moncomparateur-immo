export interface Project {
    id: number,
    type: string,
    city: string,
    adress: string,
    status: string,
    phoneNumbers: number,
    complementAdress: string,
    created_at: string,
    comments: [
        text: any,
        created_at: string,
        id: number
    ]
}