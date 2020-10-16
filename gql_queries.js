
const { gql } = require('graphql-request')

const community = gql`
  query getCommunityContent(
      $id: String!
      $page: Int = 0
      $size: Int = 100
  ) {
      getCommunity(id: $id) {
        id
        dateCreated
        dateUpdated
        creatorId
        creator {
            id
            username
            name
        }
        name
        description
        status
        website
        avatar
        social
        tags
      }
      getCommunityContent(
          id: $id
          page: $page
          size: $size
      ) {
          content {
              id
              type
              resource {
                  ... on ArticleDTO {
                    contributors {
                        id
                        name
                        username
                        avatar
                        title
                        social
                    }
                    id
                    version
                    title
                    content
                    description
                    authorId
                    dateCreated
                    datePublished
                    status
                    attributes
                    contentHash
                    checkpoint
                    tags
                  }
              }
          }
          totalPages
          totalElements
          isLast
      }
  }
`

const collection = gql`
query getCollection($id: String!) {
    getCollection(id: $id) {
      id
      name
      description
      dateCreated
      tags
      background
      dateUpdated
      owner {
        ... on PublicUserDTO {
          id
          publicUserName: name
          username
          avatar
          resourceIdentifier {
              id
              type
          }
        }
      }
      sections {
          id
          name
          description
          resourcesId {
              id
              type
          }
          resources {
              ... on ArticleDTO {
                contributors {
                    id
                    name
                    username
                    avatar
                    title
                    social
                }
                id
                version
                title
                content
                description
                authorId
                dateCreated
                datePublished
                status
                attributes
                contentHash
                checkpoint
                tags
              }
          }
      }
      resourceIdentifier {
          type
          id
      }
      isBookmarked
    }
}
`

exports.community = community
exports.collection = collection
