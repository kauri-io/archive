(async () => {
    console.log('##########################################################################')
    console.log('## KAURI EXTRACT                                                       ##')
    console.log('##########################################################################')


    // ####### IMPORT
    const { community, collection } = require('./gql_queries')
    const utils = require('./utils')
    const { GraphQLClient } = require('graphql-request')
    const slugify = require('slugify')


    //#######  CONSTANT
    const conf = "mkdocs.yml";
    const baseDir = "./docs"
    const endpoint = "https://api.kauri.io/graphql"
    const graphQLClient = new GraphQLClient(endpoint, { credentials: 'include', mode: 'cors' } )

    const articles = []
    const communities = ["5df11c69001baf0001d03b95", "5d9b16fc890d310001b66e1b", "5d8e43807a79620001afd6b5", "5d5545b7dd87360001f8ac16", "5d2f30daaba2920001c82409"]
    const collections = ["5e40dd7b26af2700016d5668", "5e1c3fdc1add0d0001dff534", "5e1d8e33bc4f230001166708", "5dfa1ea941ac3d0001ce1d90", "5db1eb443e06600001834c8e", "5d9e0939890d310001b66fa1", "5d9edf2a890d310001b67005", "5d6d437fb93cd40001f1cbe3", "5d791f9fd3979f00014502e0", "5d68cd3db93cd40001f1cb36", "5d11f9f8a6afcc0001f621de", "5d09ff9e15039e0001c5715a", "5cf673aea6afcc0001f61dc5", "5cb55c871325f2000141df73", "5cb71d136b976600014a78ad", "5cab3a8c4e04590001eccfa2", "5cecf15ea6afcc0001f61c2f", "5ced3a3ea6afcc0001f61c3e", "5ced26c7a6afcc0001f61c3b", "5cd2c25ffc95970001c89920", "5ce41ea1fc95970001c89ba0", "5cb71c026b976600014a78ac", "5cb2b1ea3951aa00014a1341", "5c69c8c39c73740001dab899", "5beef0ff6b97660001fe6391", "5b8e401ee727370001c942e3", "5cbe94f27dbe6c000102ad56", "5c1265524f34080001c81c1b", "5ca220e83951aa00014a1336", "5ca207e63951aa00014a1333", "5c90f5104e04590001eccb90", "5c7bf8d9e904e30001cf136a", "5c7e87d36c0b6400017869f5", "5c06ca634f34080001c81be9", "5c781400e904e30001cf1366", "5c81069c43c801000164ea2f", "5c4b1b5b92371c00018db874", "5bb65f0f4f34080001731dc2", "5bd7158026f0a50001f2a277", "5c5c6e193773fe000144d3e5", "5bef33b16b97660001fe6392", "5be1a3f93917ab0001ea9baa", "5bd3262b26f0a50001f2a276", "5bb60f034f34080001731dbe", "5b8fe388e727370001c942e4", "5b8d373fe727370001c942de"]

    // ###### FUNCTIONS
    const parseArticle = article => {
      const title = (article.title) ? article.title.replace(":"," ") : ""
      const desc = (article.description) ? article.description.replace(":"," ") : ""
      const redirect = slugify(article.title, {lower: true}) + "/" + article.id + "/a"

      const file = slugify(article.title, {lower: true}).replace("'","") + ".md"
      const text = "---\n" +
                   "title: " + title+ "\n" +
                   "summary: "  + desc  + "\n" +
                   "authors:\n" +
                   "  - " + article.contributors[0].name +" (@"+article.contributors[0].username+")" + "\n" +
                   "date: " + article.datePublished.split("T")[0] + "\n" +
                   "some_url: \n" +
                   "---\n\n" +
                   JSON.parse(article.content).markdown;

          return {file, text, title: article.title, redirect }
    }

    // ######## INIT
    utils.deleteFolder(baseDir)
    utils.createDirectory(baseDir)

    utils.deleteFile(conf)
    utils.createFile(baseDir + "/CNAME", "archive.kauri.io")
    utils.createFile(baseDir + "/index.md", "#hello")
    utils.createFile(conf, "site_name: Kauri\n" +
                            "theme: readthedocs\n" +
                            "nav:\n" +
                            "    - Home: 'index.md'\n" +
                            "    - Communities & Collections:\n")

    // ####### EXTRACT
    console.log("== EXTRACT COMMUNITIES")
    for(id of communities) {
      const data = await graphQLClient.request(community, {id})
      const folder = baseDir + "/" + data.getCommunity.name
      utils.appendFile("mkdocs.yml", "      - " + data.getCommunity.name + ":")
      utils.createDirectory(folder)

      for(article of data.getCommunityContent.content) {
        if(article.type != "ARTICLE") continue

        content = parseArticle(article.resource)
        var path = data.getCommunity.name + "/" + content.file
        var title = content.title.replace(/[\:\#]/g,'-');
        utils.appendFile("mkdocs.yml", "        - " + title + ": '" + path + "'")
        utils.createFile(folder + "/" + content.file, content.text)

        articles.push({id: article.id, redirect: content.redirect, path})
      }
    }

    console.log("== EXTRACT COLLECTIONS")
    for(id of collections) {
      const data = await graphQLClient.request(collection, {id})
      const folder = baseDir + "/" + data.getCollection.name
      utils.appendFile("mkdocs.yml", "      - " + data.getCollection.name + ":")
      utils.createDirectory(folder)

      for(section of data.getCollection.sections) {
        for(article of section.resources) {
          if(!article.title) continue

          content = parseArticle(article)
          var path = data.getCollection.name + "/" + content.file
          var title = content.title.replace(/[\:\#]/g,'-');
          utils.appendFile("mkdocs.yml", "        - " + title + ": '" + path + "'")
          utils.createFile(folder + "/" + content.file, content.text)

          articles.push({id: article.id, redirect: content.redirect, path})
        }
      }
    }


    console.log("== REDIRECT")
    utils.appendFile("mkdocs.yml", "plugins:\n" +
                                   "    - redirects:\n" +
                                   "        redirect_maps:")
    for(article of articles) {
      utils.appendFile("mkdocs.yml", "            " + article.redirect + ": " + article.path)
    }

    // END...
    console.log('END!')
    process.exit()
  })();
