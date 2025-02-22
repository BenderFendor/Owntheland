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
        .replace(/\[Section\[(.*?)\]\]/g, (match, p1) => `<div class="${p1.toLowerCase()}">`)
        .replace(/\[End\[(.*?)\]\]/g, "</div>")
        // Basic image handling
        .replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
            // Extract the filename from the src
            let filename = src.split('/').pop();

            // Replace multiple spaces with a single space
            filename = filename.replace(/\s+/g, ' ');

            const newSrc = `/images/${filename}`;
            return `<img src="${newSrc}" alt="${alt || filename}" />`;
        })
        // Handle video syntax
        .replace(
            /<p>\s*<a href="(https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))">\s*Video\s*<\/a>\s*<\/p>/g,
            (match, fullUrl, videoId) => {
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                return `<iframe width="560" height="315" src="${embedUrl}" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>`;
            }
        );

    // Level-specific transformations
    if (frontmatter.level === "level3") {
        replacedHtml = replacedHtml
            // Merge consecutive property/neighborhood/video blocks into one right-section
            .replace(
                /(?:<p>(<div class="(?:property|neighborhood|video)">[\s\S]*?<\/div>)<\/p>\s*)+/g,
                (fullMatch) => {
                    const blocks = fullMatch.match(/<div class="(?:property|neighborhood|video)">[\s\S]*?<\/div>/g) || [];
                    const processed = blocks.map((div) => {
                        const heading = div.match(/<h1>.*?<\/h1>/)?.[0] || '';
                        const images = (div.match(/<img[^>]+>/g) || []).join('\n');
                        const className = div.match(/<div class="([^"]+)">/)?.[1] || '';
                        return `<div class="${className}">
                            ${heading}
                            <div class="image-grid">${images}</div>
                        </div>`;
                    }).join('');
                    return `<div class="right-section">${processed}</div>`;
                }
            )
            // Handle image descriptions for level3
            .replace(/\[\[ImageDesc\](.*?)\]/g, (_, p1) =>
                `<span class="image-desc" data-description="${p1}"></span>`)

            // Enhanced image handling with descriptions
            .replace(/<img[^>]+>/g, (match) => {
                const srcMatch = match.match(/src="([^"]+)"/);
                const altMatch = match.match(/alt="([^"]+)"/);
                const src = srcMatch ? srcMatch[1] : '';
                const alt = altMatch ? altMatch[1] : '';

                // Keep original path structure
                let normalizedSrc = src.startsWith('src/images/')
                    ? src.replace('src/images/', '/images/')
                    : src;

                // Debug print to show where the image is being loaded from
                console.log(`Loading image from: ${normalizedSrc}`);

                let desc = alt; // Default to alt text

                try {
                    // Extract the filename from the src
                    const filename = src.split('/').pop();
                    // Escape special regex characters in the filename (handles periods, etc.)
                    const safeFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                    // Build the regex pattern to look for the optional [[ImageDesc]] tag that follows the markdown image
                    // Allows any whitespace characters (including newlines) between the image closing parenthesis and the [[ImageDesc]] tag.
                    const imgDescPattern = new RegExp(
                        `!\\[.*?\\]\\([^)]*?${safeFilename}[^)]*?\\)[\\s\\n]*\\[\\[ImageDesc\\]([^\\]]+)\\]`,
                        'i'
                    );

                    const descMatch = html.match(imgDescPattern);
                    if (descMatch && descMatch[1]) {
                        // Use the provided image description (trimmed) if found
                        desc = descMatch[1].trim();
                    }
                } catch (error) {
                    console.warn(`Error finding description for ${src}:`, error);
                }

                // Split the description by "|" and join with <br> for multi-line support
                const formattedDesc = desc.split('|').join('<br>');

                // Escape quotes in src and description for safe HTML attribute usage
                const escapedSrc = normalizedSrc.replace(/"/g, '&quot;');
                const escapedDesc = formattedDesc.replace(/"/g, '&quot;');

                // Return the final <img> tag with event handling to allow image expansion
                return `<img src="${escapedSrc}" alt="${escapedDesc}" class="thumbnail" data-description="${escapedDesc}" onclick="expandImage('${escapedSrc}', '${escapedDesc}')" />`;
            })

            .replace(/(<div class="mainimage">[\s\S]*?<\/div>)/g, (match) => {
                const imgMatch = match.match(/<img[^>]+>/);
                const descMatch = match.match(/data-description="([^"]+)"/);
                if (imgMatch && descMatch) {
                    // Split the description by "|" and join with <br> for multi-line support
                    const formattedDesc = descMatch[1].split('|').join('<br>');
                    return match.replace('</div>', `<p class="mainimage-description">${formattedDesc}</p></div>`);
                }
                return match;
            })
            // Special handling for Property, Neighborhood, and Video sections (pairs and triplets)
            .replace(
                /<p>(<div class="property">[\s\S]*?<\/div>)<\/p>\s*<p>(<div class="video">[\s\S]*?<\/div>)<\/p>|<p>(<div class="video">[\s\S]*?<\/div>)<\/p>\s*<p>(<div class="property">[\s\S]*?<\/div>)<\/p>/g,
                (_, property1, video1, video2, property2) => {
                    const propertyContent = property1 || property2 || '';
                    const videoContent = video1 || video2 || '';

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
                    const videoSection = processSection(videoContent, 'video');

                    return `<div class="right-section">
                        ${propertySection}
                        ${videoSection}
                    </div>`;
                }
            )
            .replace(
                /<p>(<div class="property">[\s\S]*?<\/div>)<\/p>\s*<p>(<div class="neighborhood">[\s\S]*?<\/div>)<\/p>\s*<p>(<div class="video">[\s\S]*?<\/div>)<\/p>|<p>(<div class="video">[\s\S]*?<\/div>)<\/p>\s*<p>(<div class="neighborhood">[\s\S]*?<\/div>)<\/p>\s*<p>(<div class="property">[\s\S]*?<\/div>)<\/p>/g,
                (...matches) => {
                    const propertyContent = matches[1] || matches[9] || '';
                    const neighborhoodContent = matches[2] || matches[8] || '';
                    const videoContent = matches[3] || matches[7] || '';

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
                    const videoSection = processSection(videoContent, 'video');

                    return `<div class="right-section">
                        ${propertySection}
                        ${neighborhoodSection}
                        ${videoSection}
                    </div>`;
                }
            )
            // Handle lone Property, Neighborhood, and Video sections
            .replace(/<p>(<div class="property">[\s\S]*?<\/div>)<\/p>|<p>(<div class="neighborhood">[\s\S]*?<\/div>)<\/p>|<p>(<div class="video">[\s\S]*?<\/div>)<\/p>/g, (match, propertyDiv, neighborhoodDiv, videoDiv) => {
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
                } else if (videoDiv) {
                    return `<div class="right-section">${processSection(videoDiv, 'video')}</div>`;
                }
                return match;
            });

    } else if (frontmatter.level === "level2") {
        replacedHtml = `<h1>${frontmatter.title}</h1>` +
            replacedHtml
                .split(/---/)
                .map(section => section.trim())
                .filter(section => section.length > 0)
                .map(section => section.replace(/<p>\s*<\/p>/g, ''))
                .map(section => `<div class="countylots">${section}</div>`)
                .join("");

    } else if (frontmatter.level === "lots") {
        replacedHtml = `<h1>${frontmatter.title}</h1>` +
            replacedHtml
                .split(/---/)
                .map(section => section.trim())
                .filter(section => section.length > 0)
                .map(section => `<div class="states">${section}</div>`)
                .join("");
    }
    console.log(replacedHtml);

    return (
        <Layout frontmatter={frontmatter}>
            <div className={frontmatter.level ? frontmatter.level.toLowerCase() : ''}
                dangerouslySetInnerHTML={{ __html: replacedHtml }} />
        </Layout>
    );
}

function expandImage(src, desc) {
    // Split the description by "|" and join with <br> for multi-line support
    const formattedDesc = desc.split('|').join('<br>');

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">×</span>
            <img src="${src}" alt="${desc}">
            <p class="modal-desc">${formattedDesc}</p>
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

export const pageQuery = graphql`
query ($id: String!) {
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
`;