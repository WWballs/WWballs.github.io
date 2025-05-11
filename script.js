// Initialize the pipeline when page loads
let pipeline;

async function initializeModel() {
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  loading.textContent = 'Downloading AI model (≈100MB)... This only happens once!';
  
  try {
    pipeline = await transformers.pipeline(
      'text-generation', 
      'Xenova/distilgpt2', // Small, fast model that runs in browser
      { progress_callback: (progress) => {
          loading.textContent = `Downloading: ${Math.round(progress * 100)}%`;
        }
      }
    );
    loading.style.display = 'none';
  } catch (error) {
    document.getElementById('output').innerHTML = 
      `<span class="error">Failed to load model: ${error.message}</span>`;
  }
}

// Initialize model when page loads
initializeModel();

// Generate text when button clicked
document.getElementById('generate').addEventListener('click', async function() {
  const input = document.getElementById('input').value.trim();
  const output = document.getElementById('output');
  const loading = document.getElementById('loading');
  
  if (!input) {
    output.innerHTML = '<span class="error">Please enter some text first!</span>';
    return;
  }

  if (!pipeline) {
    output.innerHTML = '<span class="error">Model still loading. Please wait...</span>';
    return;
  }

  output.textContent = '';
  loading.style.display = 'block';
  loading.textContent = 'Generating response...';
  
  try {
    const result = await pipeline(input, {
      max_new_tokens: 100,
      temperature: 0.7
    });
    
    output.innerHTML = `<span class="success">${result[0].generated_text}</span>`;
  } catch (error) {
    output.innerHTML = `<span class="error">Generation failed: ${error.message}</span>`;
  } finally {
    loading.style.display = 'none';
  }
});
