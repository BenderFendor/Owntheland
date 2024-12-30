const path = require('path');

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const markdownTemplate = path.resolve(`src/templates/markdown-page.js`);

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error while running GraphQL query.", result.errors);
    return;
  }
  
  const pages = result.data.allMarkdownRemark.edges;
  pages.forEach(({ node }) => {
    const slug = node.frontmatter.slug;
    if (!slug) {
      reporter.panicOnBuild(
        `No valid slug found in frontmatter for Markdown file at: ${node.fileAbsolutePath}` // So I know which file did it
      );
    }

    createPage({
      path: slug,
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

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemarkFrontmatter {
      title: String
      date: Date @dateformat
      slug: String
      level: String
      background: String
    }

    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }
  `
  createTypes(typeDefs)
};