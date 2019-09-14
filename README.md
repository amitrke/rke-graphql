# rke-graphql
Roorkee.org GraphQL API

### Local

- clone
- yarn install
- yarn run start
- http://localhost:3000/graphql

### Hosted
- https://zm41lvl4th.execute-api.us-east-1.amazonaws.com/dev/graphql

#### Sample request

{code}
{
    getPost(id: "5cf9918be863421a13deecc3"){
        title,
        images,
        description
    }
}
{code}