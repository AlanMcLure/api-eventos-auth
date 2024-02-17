import { ObjectId } from "mongodb"

import { collections } from "../services/databaseService.js";
import { Order } from "./Orders.js";

interface address {
    calle: string,
    telf: string,
    CP: string
}

export interface CartItem {
    pid: ObjectId,
    qty: number
}

export class User {
    public _id?: ObjectId
    public cart: CartItem[] = [];
    public role: 'user' | 'admin';

    constructor(
        public username: string,
        public password: string,
        public DNI: string,
        public name: string,
        public mail: string,
        public contacto: address,
        cart?: CartItem[],
        id?: string,
        role?: 'user' | 'admin'
    ) {
        if (id) this._id = new ObjectId(id);
        cart ? this.cart = cart : this.cart = [];
        this.role = role ? role : 'user';
    }
    async save() {
        const result1 = await collections.users?.findOne({ DNI: this.DNI });
        if (result1) {
            this._id = result1._id;
            console.log("Usuario ya disponible");
            return this;
        }

        const result = await collections.users?.insertOne(this);
        console.log(result);
        result
            ? console.log(`Successfully created a new user with id ${result.insertedId}`)
            : console.log("Failed to create a new user.");
        return //this;
    }
    static async fetchById(id: string) {
        return await collections.users?.findOne({ _id: new ObjectId(id) });
    }
    static async fetchUserByUsernameAndPassword(username: string, password: string): Promise<User | null> {
        try {
            const user = await collections.users?.findOne({ username: username, password: password });
            return user ? new User(user.username, user.password, user.DNI, user.name, user.mail, user.contacto, user.cart, user._id?.toString(), user.role) : null;
        } catch (error) {
            console.error("Error al buscar usuario por nombre de usuario y contraseña:", error);
            return null;
        }
    }
    async addToCart(id: string) {
        //Ver si el evento está en el carro
        const index = this.cart.findIndex(c => c.pid.toHexString() === id);
        if (index >= 0) {
            this.cart[index].qty += 1;
        } else {
            const prodId = new ObjectId(id);
            this.cart.push({ pid: prodId, qty: 1 });
        }
        return await collections.users?.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
    }
    async getCart() {
        const eventoIds = this.cart.map(ci => ci.pid);
        const eventos = await collections.eventos?.find({ _id: { $in: eventoIds } }).toArray();
        return eventos?.map(e => {
            const qty = this.cart.find(ci => e._id.toHexString() === ci.pid.toHexString())?.qty;
            return {
                _id: e._id,
                nombreEvento: e.nombreEvento,
                precio: e.precio,
                qty: qty
            }
        })
    }
    async deleteCartItem(id: string) {
        const index = this.cart.findIndex(c => {
            return c.pid.toHexString() === id
        });
        if (index >= 0) {
            this.cart.splice(index, 1);
            return await collections.users?.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
        }
    }
    async decreaseCartItem(id: string) {
        const index = this.cart.findIndex(c => {
            return c.pid.toHexString() === id
        });
        if (index >= 0) {
            const qty = this.cart[index].qty;
            if (qty === 1) {
                await this.deleteCartItem(id);
            }
            else {
                this.cart[index].qty -= 1;
            }
            return await collections.users?.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
        } else {
            return
        }
    };
    async addOrder() {
        if (this.cart.length > 0 && this._id) {
            const eventoIds = this.cart.map(ci => ci.pid); //Listado de todos los ids de los eventos que tengo en el cart
            const eventos = await collections.eventos?.find({ _id: { $in: eventoIds } }).toArray();
            if (!eventos) {
                console.error('Error: No se encontraron eventos.');
                return null;
            }
            const items = eventos.map(e => {
                return {
                    evento: e,
                    qty: this.cart.find(ci => ci.pid.toHexString() === e._id.toHexString())!.qty
                }
            })

            const time = new Date();
            this.cart = [];
            const result = await collections.users!.updateOne({ _id: this._id }, { $set: { cart: [] } });
            if (!result) {
                console.error('Error: No se pudo vaciar el carrito.');
                return null;
            }
            const newOrder: Order = { user: this, date: time, items: items };
            const orderInsertion = await collections.orders?.insertOne(newOrder);
            if (!orderInsertion) {
                console.error('Error: No se pudo insertar la nueva orden.');
                return null;
            }
            return orderInsertion;
        } else {
            return null
        }
    };
    async getOrders() {
        return await collections.orders?.find({ 'user._id': this._id }).toArray();
    };
}