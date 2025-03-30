document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateBtn");
    const requiredFields = ["project-name", "python-version", "authors"]; // Add more if needed
  
    function validateAuthors(raw) {
      const errorEl = document.getElementById("authors-error");
      const entries = raw.split(",").map(s => s.trim()).filter(Boolean);
    
      const valid = entries.every(entry => /^.+\s<.+@.+>$/.test(entry));
    
      if (!valid) {
        errorEl.classList.remove("hidden");
        return false;
      } else {
        errorEl.classList.add("hidden");
        return true;
      }
    }
    
    const checkRequiredFields = () => {
      const authorsValid = validateAuthors(document.getElementById("authors").value.trim());
      const allFilled = requiredFields.every(id => {
        const el = document.getElementById(id);
        return el && el.value.trim() !== "";
      }) && authorsValid;
  
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

        const rawAuthors = document.getElementById("authors").value.trim();
        const poetryVersion = document.getElementById("poetry-version").value;

        const authors = rawAuthors
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);

        let formattedAuthors;

        if (poetryVersion === "v2") {
          // Convert to array of objects
          const objects = authors.map(entry => {
            const match = entry.match(/^(.+)\s+<(.+)>$/);
            if (!match) return null;
            return `{name = "${match[1].trim()}", email = "${match[2].trim()}"}`;
          }).filter(Boolean);
          formattedAuthors = `[${objects.join(", ")}]`;
        } else {
          // Default to v1
          formattedAuthors = `[${authors.map(a => `"${a}"`).join(", ")}]`;
        }

        const formData = {
          "project-name": document.getElementById("project-name").value.trim(),
          "authors": formattedAuthors,
          "license": document.getElementById("license").value.trim(),
          "project-description": document.getElementById("project-description").value.trim(),
          "python-version": document.getElementById("python-version").value.trim(),
          "include-vscode": document.getElementById("include-vscode").checked
        };        
    
        const poetryFolder = poetryVersion === "v2" ? "poetry_v2" : "poetry_v1";
        const foldersToLoad = [
          { path: "templates/project", zipPath: "" },
          { path: `templates/${poetryFolder}`, zipPath: "" },
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