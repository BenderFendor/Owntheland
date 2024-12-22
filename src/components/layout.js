// filepath: /c:/Users/jorda/Documents/Owntheland/gatsby-project/src/components/layout.js
import * as React from "react"
import { Link } from "gatsby"
import "./layout.css"
import { useStaticQuery, graphql } from "gatsby"
import ReactMarkdown from "react-markdown" // Add this import

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "header.md" }) {
        childMarkdownRemark {
          rawMarkdownBody
        }
      }
    }
  `)

  const headerContent = data.file.childMarkdownRemark.rawMarkdownBody

  return (
    <div>
      <header>
        <nav>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => <Link {...props} />,
              ul: ({ node, ...props }) => <ul {...props} style={{ listStyle: 'none', display: 'flex', gap: '1rem', padding: 0, margin: 0 }} />,
              li: ({ node, ...props }) => <li {...props} style={{ margin: 0 }} />,
            }}
          >
            {headerContent}
          </ReactMarkdown>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout