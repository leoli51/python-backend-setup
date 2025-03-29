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
          "authors": document.getElementById("authors").value.trim(),
          "license": document.getElementById("license").value.trim(),
          "project-description": document.getElementById("project-description").value.trim(),
          "python-version": document.getElementById("python-version").value.trim(),
          "include-vscode": document.getElementById("include-vscode").checked
        };
        
    
        const foldersToLoad = [
          { path: "templates/project", zipPath: "" },
          { path: "templates/poetry", zipPath: "" },
        ];
    
        if (formData["include-vscode"]) {
          foldersToLoad.push({ path: "templates/vscode", zipPath: ".vscode" });
        }
    
        const zip = new JSZip();
    
        try {
          for (const folder of foldersToLoad) {
            const fileList = await fetch(`${folder.path}/files.json`).then(res => res.json());
    
            for (const fileName of fileList) {
              const filePath = `${folder.path}/${fileName}`;
              const templateText = await fetch(filePath).then(res => res.text());
              const rendered = Mustache.render(templateText, formData);
              const renderedName = Mustache.render(fileName, formData); // handles folders + files

              const outputPath = folder.zipPath
                ? `${folder.zipPath}/${renderedName}`
                : `${renderedName}`;
    
              zip.file(outputPath, rendered);
            }
          }
    
          const blob = await zip.generateAsync({ type: "blob" });
          saveAs(blob, `${formData["project-name"] || "project"}.zip`);
        } catch (err) {
          console.error("Error generating project:", err);
        }
      });
    });