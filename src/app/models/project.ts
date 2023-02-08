export interface Project {
    id: number,
    type: string,
    city: string,
    adress: string,
    complementAdress: string,
    createdAt: string,
    comments: [
        text: any,
        created_at: string,
        id: number
    ]
}