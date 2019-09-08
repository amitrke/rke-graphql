import { MongoMicrosrv } from "./lambda/MongoMicrosrv";

let mongoMicrosrv = new MongoMicrosrv();
export const recipegql = mongoMicrosrv.onEvent;