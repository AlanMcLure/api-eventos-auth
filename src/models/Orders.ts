import { ObjectId } from "mongodb";

import { Evento } from "./Evento.js";
import { User } from "./User.js";

export interface OrderItem {
    evento: Evento,
    qty: number
}

export interface Order {
    date: Date,
    user: User,
    items: OrderItem[]
}

// 'items.evento._id' 
//{
//     date: "2024-02-07 14:00",
//     user: {
//         _id: 'adsasdf'
//         name: 'Pepe',
//         mail: 'asdfasdf',
//         ...
//     }
//     items: [
//         {evento: {
//             _id: 'dasfsd',
//             nombreEvento: 'Libro',
//             precio: 34
//             ...

//         }
//         qty: 1}
//         ,
//         {
//             _id: 'dasfsd',
//             nombreEvento: 'Libro',
//             precio: 34
//             ...

//         }
//     ]
// }

