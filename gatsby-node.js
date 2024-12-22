const path = require('path');

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const markdownTemplate = path.resolve(`src/templates/markdown-page.js`);

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: markdownTemplate,
      context: {
        id: node.id,
      },
    });
  });

  // Create the homepage from the markdown file
  const homeNode = result.data.allMarkdownRemark.edges.find(edge => edge.node.frontmatter.slug === "/");
  if (homeNode) {
    createPage({
      path: "/",
      component: markdownTemplate,
      context: {
        id: homeNode.node.id,
      },
    });
  }
};