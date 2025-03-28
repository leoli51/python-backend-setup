document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateBtn");
    const requiredFields = ["project-name", "python-version"]; // Add more if needed
  
    const checkRequiredFields = () => {
      const allFilled = requiredFields.every(id => {
        const el = document.getElementById(id);
        return el && el.value.trim() !== "";
      });
  
      generateBtn.disabled = !allFilled;
      generateBtn.classList.toggle("bg-indigo-600", allFilled);
      generateBtn.classList.toggle("hover:bg-indigo-700", allFilled);
      generateBtn.classList.toggle("cursor-pointer", allFilled);
      generateBtn.classList.toggle("bg-indigo-400", !allFilled);
      generateBtn.classList.toggle("cursor-not-allowed", !allFilled);
    };
  
    // Attach input listeners to required fields
    requiredFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", checkRequiredFields);
    });
  
    generateBtn.addEventListener("click", async (e) => {
        e.preventDefault();
    
        const formData = {
          "project-name": document.getElementById("project-name").value.trim(),
          "project-description": document.getElementById("project-description").value.trim(),
          "authors": document.getElementById("authors").value.trim(),
          "license": document.getElementById("license").value.trim(),
          "python-version": document.getElementById("python-version").value.trim()
        };
    
        try {
          const res = await fetch("templates/pyproject.toml");
          let template = await res.text();
    
          // Replace placeholders in template
          for (const [key, value] of Object.entries(formData)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
            template = template.replace(regex, value);
          }
    
          // Create and download ZIP
          const zip = new JSZip();
          zip.file("pyproject.toml", template);
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, `${formData["project-name"] || "project"}.zip`);
        } catch (err) {
          console.error("Error generating project:", err);
        }
      });
    });
    