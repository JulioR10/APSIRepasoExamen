import { Db, ObjectId } from "mongodb";

export const Query = {
    listMatches: async (parent: any, args: any, {clientDB}: {clientDB: Db}) => {
        const arrayTodasMatch = await clientDB.collection("Matches").find({fin: false}).toArray();
        return arrayTodasMatch;
    },

    getMatch: async (parent: any, args: {id: string}, {clientDB}: {clientDB: Db}) => {
        const Match = await clientDB.collection("Matches").findOne({_id: new ObjectId(args.id)});
        if(!Match){
            throw new Error("404");
        }

        return {
            nombre1: Match.nombre1,
            nombre2: Match.nombre2,
            resultado: Match.resultado,
            min: Match.min,
            fin: Match.fin,
        };
    }
}