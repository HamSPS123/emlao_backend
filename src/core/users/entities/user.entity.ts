/* eslint-disable prettier/prettier */
export interface User {
    _id: string;
    account: Account;
    images: Images;
    name: string;
    bio: string;
    contact: Contact;
    openingHours: string;
    docModel: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface Account {
    _id: string;
    accountNo: string;
    pin: string;
    username: string;
    role: Role;
}

export interface Role {
    code: string;
    name: string;
}

export interface Contact {
    address: string;
    email: string;
    tel: string;
    line: string;
    whatApp: string;
    website: string;
}

export interface Images {
    profilePhoto: string;
    coverPhoto: string;
}
