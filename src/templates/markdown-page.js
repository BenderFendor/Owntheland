import * as React from "react";
import { graphql } from "gatsby";
// import Layout from "../components/layout";

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

        // Attach expandImage to the global window object
        window.expandImage = expandImage;
        return () => {
            delete window.expandImage;
        };
    }, [frontmatter.level]);

    let replacedHtml = html;

    // Base transformations for all pages
    replacedHtml = replacedHtml
        // Handle basic section syntax
        .replace(/\[Section\[(.*?)\]\]/g, (_, p1) => `<div class="${p1.toLowerCase()}">`)
        .replace(/\[End\[(.*?)\]\]/g, "</div>")
        // Basic image handling
        .replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, src) => {
            const filename = src.split('/').pop();
            const newSrc = `/images/${filename}`;
            return `<img src="${newSrc}" alt="${alt || filename}" />`;
        });

    // Level-specific transformations
    if (frontmatter.level === "level3") {
        replacedHtml = replacedHtml
            // Handle image descriptions for level3
            .replace(/\[\[ImageDesc\](.*?)\]/g, (_, p1) =>
                `<span class="image-desc" data-description="${p1}"></span>`)
            // Enhanced image handling with descriptions
            .replace(/<img[^>]+>/g, (match) => {
                const srcMatch = match.match(/src="([^"]+)"/);
                const altMatch = match.match(/alt="([^"]+)"/);
                const src = srcMatch ? srcMatch[1] : '';
                const alt = altMatch ? altMatch[1] : '';
                const descMatch = html.match(new RegExp(`!\\[.*?\\]\\(.*?${src.split('/').pop()}\\)\\s*\\[\\[ImageDesc\\](.*?)\\]`));
                const desc = descMatch ? descMatch[1] : alt;
                return `<img src="${src}" alt="${desc}" class="thumbnail" data-description="${desc}" onclick="expandImage('${src}', '${desc}')" />`;
            })
            // Handle MainImage section
            .replace(/(<div class="mainimage">[\s\S]*?<\/div>)/g, (match) => {
                const imgMatch = match.match(/<img[^>]+>/);
                const descMatch = match.match(/data-description="([^"]+)"/);
                if (imgMatch && descMatch) {
                    return match.replace('</div>', `<p class="mainimage-description">${descMatch[1]}</p></div>`);
                }
                return match;
            })
            // Special handling for Property and Neighborhood sections (pairs)
            .replace(/<p>(<div class="property">[\s\S]*?<\/div>)<\/p>\s*<p>(<div class="neighborhood">[\s\S]*?<\/div>)<\/p>|<p>(<div class="neighborhood">[\s\S]*?<\/div>)<\/p>\s*<p>(<div class="property">[\s\S]*?<\/div>)<\/p>/g,
                (_, propertyFirst, neighborhoodSecond, neighborhoodFirst, propertySecond) => {
                    let propertyContent = propertyFirst || propertySecond;
                    let neighborhoodContent = neighborhoodSecond || neighborhoodFirst;

                    const processSection = (content, className) => {
                        if (!content) return '';
                        const heading = content.match(/<h1>.*?<\/h1>/)?.[0] || '';
                        const images = (content.match(/<img[^>]+>/g) || []).join('\n');
                        return `<div class="${className}">
                            ${heading}
                            <div class="image-grid">${images}</div>
                        </div>`;
                    };

                    const propertySection = processSection(propertyContent, 'property');
                    const neighborhoodSection = processSection(neighborhoodContent, 'neighborhood');

                    return `<div class="right-section">
                        ${propertySection}
                        ${neighborhoodSection}
                    </div>`;
                })
            // Handle lone Property and Neighborhood sections
            .replace(/<p>(<div class="property">[\s\S]*?<\/div>)<\/p>|<p>(<div class="neighborhood">[\s\S]*?<\/div>)<\/p>/g, (match, propertyDiv, neighborhoodDiv) => {
                const processSection = (content, className) => {
                    if (!content) return '';
                    const heading = content.match(/<h1>.*?<\/h1>/)?.[0] || '';
                    const images = (content.match(/<img[^>]+>/g) || []).join('\n');
                    return `<div class="${className}">
                        ${heading}
                        <div class="image-grid">${images}</div>
                    </div>`;
                };

                if (propertyDiv) {
                    return `<div class="right-section">${processSection(propertyDiv, 'property')}</div>`;
                } else if (neighborhoodDiv) {
                    return `<div class="right-section">${processSection(neighborhoodDiv, 'neighborhood')}</div>`;
                }
                return match; // Should not happen
            });
    }

    function expandImage(src, desc) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">×</span>
                <img src="${src}" alt="${desc}">
                <p class="modal-desc">${desc}</p>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Close modal when pressing Escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                // Remove the event listener when modal is closed
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }

    return (
        // <Layout> {/* You commented out Layout, ensure this is intentional */}
            <div className={frontmatter.level ? frontmatter.level.toLowerCase() : ''}
                 dangerouslySetInnerHTML={{ __html: replacedHtml }} />
        // </Layout>
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