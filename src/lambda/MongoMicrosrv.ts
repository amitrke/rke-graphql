import { MongoService } from "../service/MongoService";
import { graphql, buildSchema } from "graphql";
import { Schema } from "../graphql/schema";

export class MongoMicrosrv {

    private mongoService: MongoService;

    constructor(){
        this.mongoService = new MongoService();
    }

    public onEvent = async(event, context) => {
        context.callbackWaitsForEmptyEventLoop = false;
        await this.mongoService.connect();

        var schema = buildSchema(Schema.schema);

        var coursesData = [
            {
                id: 1,
                title: 'The Complete Node.js Developer Course',
                author: 'Andrew Mead, Rob Percival',
                description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
                topic: 'Node.js',
                url: 'https://codingthesmartway.com/courses/nodejs/'
            },
            {
                id: 2,
                title: 'Node.js, Express & MongoDB Dev to Deployment',
                author: 'Brad Traversy',
                description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
                topic: 'Node.js',
                url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
            },
            {
                id: 3,
                title: 'JavaScript: Understanding The Weird Parts',
                author: 'Anthony Alicea',
                description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
                topic: 'JavaScript',
                url: 'https://codingthesmartway.com/courses/understand-javascript/'
            }
        ]

        var getCourse = function(args) { 
            var id = args.id;
            return coursesData.filter(course => {
                return course.id == id;
            })[0];
        }

        var getCourses = function(args) {
            if (args.topic) {
                var topic = args.topic;
                return coursesData.filter(course => course.topic === topic);
            } else {
                return coursesData;
            }
        }


        // The root provides a resolver function for each API endpoint
        var root = {
            course: getCourse,
            courses: getCourses
        };

        const requestBody = JSON.parse(event.body);
        return graphql(schema, requestBody.query, root, null, requestBody.variables, requestBody.operationName).then((response) => {
            return {
            statusCode: 200,
            body: JSON.stringify(response.data),
            };
        },
        err => {
            return {
            statusCode: 500,
            body: JSON.stringify(err),
            };
        });
    }   
}