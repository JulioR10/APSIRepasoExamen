import { Db, ObjectId } from "mongodb";
import { PubSub } from "graphql-subscriptions";

export const Mutation = {
    setMatchData: async (parent: any, args: {id: string, resultado: number[], min: number, fin: boolean},{clientDB, pubsub}:{clientDB:Db, pubsub: PubSub} ) => {
        const partidoSinActu = await clientDB.collection("Matches").findOne({_id: new ObjectId(args.id)});
        if(!partidoSinActu){
            throw new Error("404");
        }
        if(partidoSinActu.fin == true){
            throw new Error("402");
        }
        if(args.min < partidoSinActu.min){
            throw new Error("402");
        }
        if(args.resultado.at(0) < partidoSinActu.resultado.at(0)){
            throw new Error("402");
        }
        if(args.resultado.at(1) < partidoSinActu.resultado.at(1)){
            throw new Error("402");
        }

        await clientDB.collection("Matches").updateOne(
            {_id: new ObjectId(args.id)},
            { $set: {
                resultado: args.resultado,
                min: args.min,
                fin: args.fin
            }}
        );
        pubsub.publish(
            `MATCH_UPDATE ${partidoSinActu._id}`,
            {subscribeMatch: {
                nombre1: partidoSinActu.nombre1, 
                nombre2: partidoSinActu.nombre2, 
                resultado: partidoSinActu.resultado, 
                min: partidoSinActu.min, 
                fin: partidoSinActu.fin
            }}
        );
        console.log(partidoSinActu);
        return "Updateado";
    },

    startMatch: async (parent: any, args: {team1: string, team2: string},{clientDB}:{clientDB:Db} ) => {
        const exist1 = await clientDB.collection("Matches").findOne({nombre1: args.team1, nombre2: args.team2, fin: false});
        const exist2 = await clientDB.collection("Matches").findOne({nombre1: args.team2, nombre2: args.team1, fin: false});
        if(!exist1 && !exist2){
            await clientDB.collection("Matches").insertOne({
                nombre1: args.team1,
                nombre2: args.team2,
                resultado: [0,0],
                min: 0,
                fin: false
            });
        }
        throw new Error("442");
    }
}