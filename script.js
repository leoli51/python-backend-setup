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

    // Get comment prefix to add comments to empty files to prevent 404
    function getCommentPrefix(fileName) {
      const ext = fileName.split(".").pop().toLowerCase();
    
      switch (ext) {
        case "py":
        case "sh":
        case "toml":
        case "ini":
        case "yml":
        case "yaml":
          return "#";
        case "json":
        case "js":
        case "ts":
          return "//";
        case "md":
          return "<!--";
        default:
          return "#";
      }
    }

    const easterEggQuotes = [
      "Beautiful is better than ugly.",
      "Explicit is better than implicit.",
      "Simple is better than complex.",
      "Complex is better than complicated.",
      "Flat is better than nested.",
      "Sparse is better than dense.",
      "Readability counts.",
      "Special cases aren't special enough to break the rules.",
      "Although practicality beats purity.",
      "Errors should never pass silently.",
      "Unless explicitly silenced.",
      "In the face of ambiguity, refuse the temptation to guess.",
      "There should be one-- and preferably only one --obvious way to do it.",
      "Although that way may not be obvious at first unless you're Dutch.",
      "Now is better than never.",
      "Although never is often better than *right* now.",
      "If the implementation is hard to explain, it's a bad idea.",
      "If the implementation is easy to explain, it may be a good idea.",
      "Namespaces are one honking great idea -- let's do more of those!"
    ]
    
  
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

              let finalContent = rendered;

              // If the file is empty, add generator comment + random quote
              if (rendered === "") {
                const prefix = getCommentPrefix(fileName);
                const quote = easterEggQuotes[Math.floor(Math.random() * easterEggQuotes.length)];
              
                if (prefix === "<!--") {
                  finalContent = `${prefix} ${quote} -->`;
                } else {
                  finalContent = `${prefix} ${quote}`;
                }
              }
                
              zip.file(outputPath, finalContent);
            }
          }
    
          const blob = await zip.generateAsync({ type: "blob" });
          saveAs(blob, `${formData["project-name"] || "project"}.zip`);
        } catch (err) {
          console.error("Error generating project:", err);
        }
      });
    });