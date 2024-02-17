import { ObjectId } from "mongodb";
import { collections } from "../services/databaseService.js";

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

export class Order {

    static async fetchAll() {
        return await collections.orders?.find().toArray();
    }
}