const testAPI = async () => {
  console.log("Testing /api/generate-plan endpoint...");
  
  try {
    const response = await fetch("http://localhost:4000/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hobby: "origami", level: "beginner" }),
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error("Error:", error);
      return;
    }

    const data = await response.json();
    console.log("\n=== Generated Plan ===");
    console.log("Number of techniques:", data.techniques?.length);
    
    data.techniques?.forEach((technique, i) => {
      console.log(`\n--- Technique ${i + 1}: ${technique.title} ---`);
      console.log("Description:", technique.description);
      console.log("Resources:");
      technique.resources?.forEach((r, j) => {
        console.log(`  ${j + 1}. [${r.type}] ${r.title}`);
        console.log(`     URL: ${r.url}`);
      });
    });
    
    console.log("\nAPI test completed successfully!");
  } catch (error) {
    console.error("test failed:", error);
  }
};

testAPI();
