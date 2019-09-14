# rke-graphql
Roorkee.org GraphQL API

[![Actions Status](https://github.com/amitrke/rke-graphql/workflows/Node%20CI/badge.svg)](https://github.com/amitrke/rke-graphql/actions)
[![devDependencies Status](https://david-dm.org/amitrke/rke-graphql/dev-status.svg)](https://david-dm.org/amitrke/rke-graphql?type=dev)
[![Dependencies Status](https://david-dm.org/amitrke/rke-graphql/status.svg)](https://david-dm.org/amitrke/rke-graphql)

### Local

- clone
- yarn install
- yarn run start
- http://localhost:3000/graphql

### Hosted
- https://zm41lvl4th.execute-api.us-east-1.amazonaws.com/dev/graphql

#### Sample request

```
{
    getPost(id: "5cf9918be863421a13deecc3"){
        title,
        images,
        description
    }
}
```