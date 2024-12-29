# OwnTheLand.net

## Overview

**OwnTheLand.net** is a comprehensive platform dedicated to helping individuals purchase and manage land plots sustainably. The website offers detailed information about available lots, property descriptions, and neighborhood insights to assist users in making informed decisions about land ownership.

## Features

- **Interactive Property Listings:** Browse through various land plots with detailed descriptions and high-quality images.
- **Custom Markdown Syntax:** Utilize extended Markdown features for rich content formatting.
- **Admin File Management:** Easily update content through an integrated file editor with GitHub synchronization.
- **Responsive Design:** Optimized for all devices to provide a seamless user experience.
- **Secure Refresh Endpoints:** Ensure data integrity and security with authorized content refresh mechanisms.

## Technology Stack

- **Frontend:** [Gatsby](https://www.gatsbyjs.com/) powered by React
- **Styling:** CSS and custom stylesheets
- **Content Management:** Markdown files with custom syntax
- **Build Tools:** Parcel and ESLint for code quality
- **Deployment:** Netlify for continuous deployment and hosting

## Project Structure

The project follows a structured approach to organize content and code efficiently. Below is an overview of the file structure:

```
.
├── .cache/
├── .github/
├── .vscode/
├── src/
│   ├── templates/
│   │   └── markdown-page.js
│   ├── markdown/
│   │   ├── Subpages/
│   │   │   ├── about_us.md
│   │   │   └── lots_available.md
│   │   └── main_page.md
│   ├── images/
│   └── styles/
├── static/
├── projectrules.md
├── package.json
└── README.md
```

For detailed guidelines on the project structure, refer to the [Project Rules](projectrules.md).

## Custom Markdown Syntax

OwnTheLand.net extends standard Markdown to support additional features tailored for the website's needs. Key extensions include:

- **Sections:** Define content sections using `[Section[X]]` and `[End[X]]`.
- **Image Descriptions:** Add hidden descriptions for images using `[[ImageDesc]Description]`.
- **Backgrounds:** Specify section backgrounds within frontmatter.

Refer to the [Project Rules](projectrules.md) for comprehensive syntax guidelines.

## Getting Started

### Prerequisites

- **Node.js:** Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **Gatsby CLI:** Install Gatsby CLI globally.

```sh
npm install -g gatsby-cli
```

### Installation

1. **Clone the Repository:**

    ```sh
    git clone https://github.com/yourusername/owntheland.net.git
    cd owntheland.net
    ```

2. **Install Dependencies:**

    ```sh
    npm install
    ```

3. **Start the Development Server:**

    ```sh
    gatsby develop
    ```

    Open your browser and navigate to `http://localhost:8000` to view the site.

### Building for Production

To build the project for production, run:

```sh
gatsby build
```

The optimized and minified files will be available in the `public/` directory.

### Deploying to Netlify

Deploy the site with one click on [Netlify](https://www.netlify.com):

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/owntheland.net)

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**

    ```sh
    git checkout -b feature/YourFeature
    ```

3. **Commit Your Changes**

    ```sh
    git commit -m "Add your message"
    ```

4. **Push to the Branch**

    ```sh
    git push origin feature/YourFeature
    ```

5. **Open a Pull Request**

Please ensure your code follows the [Project Rules](projectrules.md) and includes detailed comments.

## License

This project is proprietary and cannot be used, modified, or distributed without explicit permission from the owner.
