export interface User {
    id?: number | null;
    name: string;
    username: string;
    password: string;
    position?: string;
    department?: string;
    contact?: string;
    email?: string;
    image?: string | File;  
    role: 'admin' | 'employee'; 
}

// export interface Employee {
//     [x: string]: any;
//     id: number;
//     name: string;
//     position: string;
//     department: string;
//     contact: string;
//     email: string;
//     username: string; 
//     password: string; 

//   }