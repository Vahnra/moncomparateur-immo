export interface Project {
    id: number,
    type: string,
    city: string,
    adress: string,
    status: string,
    phone_numbers: number,
    email: string,
    name: string,
    complement_adress: string,
    created_at: string,
    updated_at: string,
    comments: [
        text: any,
        created_at: string,
        id: number
    ]
}