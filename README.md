### amplify-labs-ecm


### Pros

- Very very very quick development if you follow happy path, which covers a lot of edge cases
- Very easy to modify existing API
- If you want to cover some very complex and outside of the happy path cases, it's possible to just handle those
  outside of Amplify, by simply adding external stacks, that are just deployed after Amplify
- Modular architecture - Amplify categories, also there is possibility to use community/your own categories
- GraphQL transformer (GQL model to DynamoDB+VTL) is just great and also has possiblity to use plugins
- Very easy to set up complex authorisation patterns, like groups, owners, public access etc.
- Possibility to play around with functions configuration, so you can use your own tools like TypeScript, ESBuild etc.
- Quite cool and easy to manage concept of environments
- Possibility to locally mock services for testing
- Very nice integration with OpenSearch for elastic queries, so you don't have to use 10s of indexes on your DDB
- Cool additional features like
  - Recommendations using Amazon Personalize
  - Storage using S3, that also works with Auth rules
  - Managing deployment and hosting of your frontend app
  - Simple CI/CD that you can use
  - Optional CMS panel for application administrators, that covers a lot of common use cases
  - Geo location and maps support
- You can still edit automatically generated CloudFormation resources or add your custom resources

### Cons

- If it doesn't support your case, you might end up with a problem
- DDB global tables are not supported, the only solution to this problem is to simply quit the whole Amplify framework
- REST APIs are supported but they are just bad
- If you wish to use DDB single table design then it's impossible (however I'm not the biggest fan of it in AppSync apps)
- Integration with some external identity providers using OpenID might be a drama or impossible to do
- It's slower than normal deployment, because it's using nested stack approach
- Editing/adding your own resources requires to use CloudFormation which is not really cool thing to work with
- In general deployments are quite slow, it's typical framework overhead
- If your team is not familiar with AWS in general, then they will have a great time until something breaks or you need  
  to exit happy path, because it then requires a lot of understanding of the services used under the hood
- It's easy to create monolith app
- Since it's very complex, sometimes it not really well maintained, bugs might wait months for a fix, same for new features
- It's a little bit tricky to manually crate per feature branch envs, but quite easy with their CI/CD, however 
  their CI/CD won't handle more complex cases, where you deploy things additionally after Amplify deploys