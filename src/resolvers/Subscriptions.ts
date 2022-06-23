import { subscribe } from "graphql";
import { Db, ObjectId } from "mongodb";
import { PubSub } from 'graphql-subscriptions';

export const Subscription = {
    subscribeMatch: {
        subscribe: async (parent: any, args: {id: string}, {clientDB, pubsub}:{clientDB:Db, pubsub: any}) => {
            const newid = new ObjectId(args.id);
            return pubsub.asyncIterator(`MATCH_UPDATE ${newid}`);
        }
    }
}