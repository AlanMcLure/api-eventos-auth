import { ObjectId } from "mongodb";
import { collections } from "../services/databaseService.js";

export class Evento {
    public _id?: ObjectId;

    constructor(
        public nombreEvento: string,
        public fechaEvento: Date,
        public lugar: string,
        public descripcion: string,
        public precio: number
    ){
    }

    async save(){
        if(this._id){
            const result = await collections.eventos?.updateOne({_id: this._id}, {$set: this});
            result
                ? console.log(`Evento con id ${this._id} actualizado correctamente.`)
                : console.log("Error al actualizar el evento.");
            return;
        } else {
            const result = await collections.eventos?.insertOne(this);
            result
                ? console.log(`Evento con id ${result.insertedId} creado correctamente.`)
                : console.log("Error al crear el evento.");
        }
    };

    static async fetchAll(){
        return await collections.eventos?.find().toArray();
    };

    static async findById(eventId: string){
        return await collections.eventos?.findOne({_id: new ObjectId(eventId)});
    }

    static async deleteById(eventId: string){
        const result = await collections.eventos?.deleteOne({_id: new ObjectId(eventId)});
        result
            ? console.log(`Evento con id ${eventId} borrado correctamente.`)
            : console.log("Error al borrar el evento.");
    }

    static async updateById(eventId: string, updatedEventData: Partial<Evento>) {
        try {
            const result = await collections.eventos?.updateOne(
                { _id: new ObjectId(eventId) },
                { $set: updatedEventData }
            );
            if (result && result.modifiedCount === 1) {
                console.log(`Evento con id ${eventId} actualizado correctamente.`);
                return true;
            }
            console.log(`No se encontró ningún evento con el id ${eventId}.`);
            return false;
        } catch (error) {
            console.error("Error al actualizar el evento:", error);
            return false;
        }
    }
    

}
