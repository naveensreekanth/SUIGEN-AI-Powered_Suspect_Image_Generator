# SUIGEN 🕵️‍♂️
**Suspect Image Generator**

🏆 *3rd Prize Winner at AROHAN 2.0 Student Project Exhibition*

## 📖 Overview
SUIGEN is an advanced, multimodal Generative AI pipeline designed to synthesize and reconstruct photorealistic facial images from structured linguistic inputs and witness descriptions. By leveraging diffusion-based text-to-image models, this tool bridges the gap between raw witness accounts and highly accurate visual representations.

## ✨ Core Features & Architecture
* **Multimodal Facial Reconstruction:** Reconstructs photorealistic facial images from structured witness descriptions using state-of-the-art generative models.
* **Dynamic Prompt Engineering:** Utilizes advanced prompt templates and facial attribute mapping logic to translate raw text into optimized generative inputs.
* **Iterative Refinement Workflow:** Integrates Stable Diffusion APIs and the Diffusers library for continuous image refinement, significantly improving facial synthesis accuracy.
* **Modular Pipeline Design:** Built with a scalable architecture featuring dedicated layers for NLP descriptor preprocessing, core image generation, and automated output enhancement.

## 🛠️ Tech Stack
* **Language:** Python
* **Generative AI:** Stable Diffusion, Diffusers
* **Concepts:** Prompt Engineering, Multimodal AI, Natural Language Processing (NLP)

## 📁 Repository Structure
```text
suigen/
├── data/                       # Structured witness descriptions and prompt templates
├── modules/
│   ├── preprocessing.py        # NLP descriptor preprocessing and attribute mapping
│   ├── generation.py           # Core Stable Diffusion / Diffusers pipeline
│   └── enhancement.py          # Output post-processing and refinement
├── suigen.py                   # Main executable script
├── requirements.txt            # Python dependencies
└── README.md                   # Project documentation
