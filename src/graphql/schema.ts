export class Schema {
    public static schema: string = `
        type Query {
            course(id: Int!): Course
            courses(topic: String): [Course]
        },
        type Course {
            id: Int
            title: String
            author: String
            description: String
            topic: String
            url: String
        }`;
}