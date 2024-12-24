import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";

export default function MarkdownPage({ data }) {
    const { markdownRemark } = data;
    const { frontmatter, html } = markdownRemark;

    React.useEffect(() => {
        if (frontmatter.level) {
            import(`../components/${frontmatter.level.toLowerCase()}.css`)
                .then(() => {
                console.log(`${frontmatter.level} specific CSS loaded`);
                })
                .catch((err) => {
                console.error(`Failed to load ${frontmatter.level} CSS`, err);
                });
        } else {
            console.log("No level specified");
        }
    }, [frontmatter.level]);


    let replacedHtml = html
    .replace(/\[Section\[(.*?)\]\]/g, (match, p1) => `<div class="${p1.toLowerCase()}">`)
    .replace(/\[End\[(.*?)\]\]/g, "</div>");

    if (frontmatter.level === "level2") {
        replacedHtml = `<h1>${frontmatter.title}</h1>` + replacedHtml
            .split(/---/)
            .map((section) => section.trim())
            .filter((section) => section.length > 0)
            .map((section) => `<div class="countylots">${section}</div>`)
            .join("");
    }
    return (
        <Layout>
        <div >
        <div
        className={frontmatter.level ? frontmatter.level.toLowerCase() : ""}
        dangerouslySetInnerHTML={{ __html: replacedHtml }}
        style={{ position: "relative", zIndex: 1 }}
            />
        </div>
        </Layout>
    );
}
export const pageQuery = graphql`
query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
        html
        frontmatter {
        title
        date
        level
        }
    }
}
`;