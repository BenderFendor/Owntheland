import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import "./layout.css"
import ReactMarkdown from "react-markdown"

// So This is the part of the code does the header and the background part of the markdown files also the universal css

const Layout = ({ children, frontmatter }) => {
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
  
  // Add console logging for background detection
  // console.log('Frontmatter detected:', frontmatter);
  // if (frontmatter?.background) {
  //   console.log('Background image URL:', frontmatter.background);
  // }

  const backgroundStyle = frontmatter?.background ? {
    backgroundImage: `url(${frontmatter.background})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh', // Ensure height is a string
  } : {};

  console.log("Background style:", backgroundStyle);

  return (
    <div style={backgroundStyle}>
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