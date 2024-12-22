const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src'); // Adjust the path to your markdown files directory

const frontmatter = `---
slug: "/your-slug"
title: "Your Title"
date: "2024-01-01"
level: "your-level"
---
`;

function addFrontmatterToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.startsWith('---')) {
    const newContent = frontmatter + '\n' + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
}

function processDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (path.extname(fullPath) === '.md') {
      addFrontmatterToFile(fullPath);
    }
  });
}

processDirectory(directoryPath);