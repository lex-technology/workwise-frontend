// exportUtils.js
import { saveAs } from 'file-saver';

export async function exportToWord(resumeData, filename = 'resume.doc') {
  try {
    // Get the resume container element
    const resumeContainer = document.querySelector('.resume-export');
    if (!resumeContainer) {
      throw new Error('Resume content not found');
    }

// Clone the container to avoid modifying the displayed content
const clonedContainer = resumeContainer.cloneNode(true);

// Only remove UI-specific elements but keep content
const elementsToRemove = clonedContainer.querySelectorAll(
  'button, .group-hover\\:opacity-100'
);
elementsToRemove.forEach(el => el.remove());

// Convert skills and courses to horizontal format with bullet points
const skillLists = clonedContainer.querySelectorAll('.flex.flex-wrap.items-start.gap-x-4.gap-y-1');
skillLists.forEach(list => {
  const items = Array.from(list.querySelectorAll('.flex.items-center.whitespace-nowrap'))
    .map(item => {
      // Remove existing bullet spans
      const bulletSpan = item.querySelector('.mr-2');
      if (bulletSpan) bulletSpan.remove();
      return `• ${item.textContent.trim()}`;
    });
  
  // Replace the entire list with inline text
  list.innerHTML = items.join('  ');  // Reduced spacing between items
});

// Clean up classes that we don't want in the export
const elementsToClean = clonedContainer.querySelectorAll('*');
elementsToClean.forEach(el => {
  // Remove interactive classes but keep content and structure
  el.classList.remove('cursor-pointer', 'hover:bg-blue-50', 'hover:bg-green-50');
  // Remove any empty class attributes
  if (!el.classList.length) {
    el.removeAttribute('class');
  }
});
   // Process header contact info
    const contactInfoDivs = clonedContainer.querySelectorAll('.flex.justify-between.items-center');
    contactInfoDivs.forEach(div => {
      if (div.children.length > 0 && !div.closest('[data-section="projects"]')) {  // Contact info section
        const items = Array.from(div.children).map(span => span.textContent.trim());
        // Convert to table for better Word spacing
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.border = 'none';
        table.style.borderCollapse = 'collapse';
        table.style.margin = '0';  // Remove any margin
        table.style.padding = '0'; // Remove any padding
        
        const row = table.insertRow();
        items.forEach(item => {
          const cell = row.insertCell();
          cell.textContent = item;
          cell.style.width = `${100 / items.length}%`;
          cell.style.textAlign = 'center';
          cell.style.padding = '0';
          cell.style.border = 'none';
        });
        
        div.replaceWith(table);
      }
    });

    // Process date alignments for experience section only
    const experienceDateContainers = clonedContainer.querySelectorAll('[data-section="experience"] .flex.items-center.gap-2');
    experienceDateContainers.forEach(container => {
      const orgName = container.querySelector('.italic')?.textContent || '';
      const date = container.querySelector('.text-right')?.textContent || '';
      
      // Convert to table for proper alignment
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.border = 'none';
      table.style.borderCollapse = 'collapse';
      table.style.margin = '0';
      table.style.padding = '0';
      
      const row = table.insertRow();
      const orgCell = row.insertCell();
      const dateCell = row.insertCell();
      
      orgCell.textContent = orgName;
      dateCell.textContent = date;
      orgCell.style.border = 'none';
      dateCell.style.border = 'none';
      dateCell.style.textAlign = 'left';
      dateCell.style.textAlign = 'right';
      dateCell.style.width = '30%';  // Fix the width of the date cell
      
      container.replaceWith(table);
    });
// Process education dates specifically
const educationContainers = clonedContainer.querySelectorAll('[data-section="education"] .flex.justify-between.items-start.mb-2');
educationContainers.forEach(container => {
  const institutionName = container.querySelector('h3').textContent;
  const degree = container.querySelector('p').textContent;
  const dateSpan = container.querySelector('span.text-gray-600:last-child');
  
  if (dateSpan) {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.border = 'none';
    table.style.borderCollapse = 'collapse';
    
    // First row for institution and date
    const row = table.insertRow();
    const institutionCell = row.insertCell();
    const dateCell = row.insertCell();
    
    institutionCell.innerHTML = `<strong style="font-size: 12pt">${institutionName}</strong>`;
    dateCell.textContent = dateSpan.textContent;
    
    institutionCell.style.border = 'none';
    institutionCell.style.padding = '0';
    institutionCell.style.textAlign = 'left';
    
    dateCell.style.border = 'none';
    dateCell.style.padding = '0';
    dateCell.style.textAlign = 'right';
    
    // Second row for degree
    const degreeRow = table.insertRow();
    const degreeCell = degreeRow.insertCell();
    degreeCell.colSpan = 2;
    degreeCell.textContent = degree;
    degreeCell.style.border = 'none';
    degreeCell.style.padding = '0';
    
    container.replaceWith(table);
  }
});

// Fix Relevant Courses spacing
const relevantCoursesText = clonedContainer.querySelector('.font-medium.text-sm.text-gray-700.mb-1');
if (relevantCoursesText) {
  relevantCoursesText.style.marginBottom = '0';
}
    const wordStyles = `
      /* Base styles */
      body {
        font-family: Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.4;
      }

      /* Section Headers with separator */
      h2 {
        font-size: 12pt;
        font-weight: bold;
        text-transform: uppercase;
        border-bottom: 1pt solid black;
      }

      /* Tables */
      table {
        width: 100%;
        border-collapse: collapse;
      }

      td {
        border: none;
        padding: 0;
      }

      /* Name */
      .text-2xl {
        font-size: 16pt;
        font-weight: bold;
      }

      /* Lists */
      ul {
        padding-left: 15pt;
      }

      /* Text styles */
      .text-justify {
        text-align: justify;
      }
      .italic {
        font-style: italic;
      }
    `;
    // Create the Word document HTML
    const docContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            ${wordStyles}
          </style>
        </head>
        <body>
          ${clonedContainer.innerHTML}
        </body>
      </html>
    `;

    // Create and save the file
    const blob = new Blob([docContent], { type: 'application/msword' });
    saveAs(blob, filename);

  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

// Update the handleExport function in ResumeTab.js
export async function handleExport(format, resumeData) {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    const name = resumeData?.contact_information?.name || 'resume';
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    if (format === 'word') {
      await exportToWord(resumeData, `${safeName}_${currentDate}.doc`);
    } else if (format === 'pdf') {
      await exportToPDF(resumeData, `${safeName}_${currentDate}.pdf`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}