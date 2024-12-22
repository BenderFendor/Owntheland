// filepath: /c:/Users/jorda/Documents/Owntheland/src/templates/markdown-page.js
import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default function MarkdownPage({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  React.useEffect(() => {
    if (frontmatter.level) {
      import(`../components/${frontmatter.level.toLowerCase()}.css`)
        .then(() => {
          console.log(`${frontmatter.level} specific CSS loaded`)
        })
        .catch(err => {
          console.error(`Failed to load ${frontmatter.level} CSS`, err)
        })
    } else {
      console.log('No level specified')
    }

    if (frontmatter.background) {
      document.body.style.cssText = `background-image: url(${frontmatter.background.publicURL}); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center;`
    } else {
      document.body.style.backgroundImage = ''
    }
  }, [frontmatter.level, frontmatter.background])

  const replacedHtml = html
    .replace(/\[Section\[(.*?)\]\]/g, (match, p1) => `<div class="${p1.toLowerCase()}">`)
    .replace(/\[End\[(.*?)\]\]/g, "</div>")

  return (
    <Layout>
      <div className={frontmatter.level ? frontmatter.level.toLowerCase() : ''} dangerouslySetInnerHTML={{ __html: replacedHtml }} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        date
        level
        background
      }
    }
  }
`