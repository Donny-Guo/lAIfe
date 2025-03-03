# lAIfe - The AI Life Simulator

What if you could see how different choices would shape your life? Stop wondering about missed opportunities and start exploring the multiverse of your own potential with our AI Life Simulator lAIfe.

## Intro

### **Inspiration** 

The idea for lAIfe came from our team's conversations about life's "what ifs" and roads not taken. We realized that everyone wonders about alternate versions of their lives – whether it's a different career path, education choice, or relationship decision. With recent advancements in language models, we saw an opportunity to create a tool that could simulate these alternate realities in a meaningful way.

### **What it does** 

lAIfe is an AI life simulator that allows users to explore alternative life paths based on different decisions they could have made. Users input key life details and decision points they're curious about, and our application generates detailed simulations of how their lives might have unfolded differently. The system can explore various scenarios such as: Career changes and professional development paths, educational choices and their long-term impacts, major life decisions like relocations or relationship choices, and financial decisions and their potential outcomes. Each simulation provides a narrative that follows logical cause-and-effect relationships while accounting for realistic life circumstances, giving users insight into possible alternative realities.

### **Night City Version** 

Our latest iteration, "l-AI-fe: Night City Version," takes this concept into a cyberpunk setting where choices have even more dramatic consequences. In this dystopian future where "power is everything," users navigate a world of corporate intrigue, street survival, and moral ambiguity. Players choose from three distinct life paths (Nomad, Street Kid, or Corporate), and face challenging scenarios that test their ethics and survival instincts in a total of 10 rounds. With stats tracking Health, Intelligence, and Wealth, every decision shapes not just your character's story but their very chance of survival in a city where neon lights flicker, streets buzz with danger, and choices can lead to fortune or downfall. More info can be found [here](https://drive.google.com/file/d/1tfXmPgdHdn1aJMWIc5UdAXXRDH2VSnZ4/view).

### **Built With**

- **Backend**: Python with Flask for server-side logic and API integration
- **API Integration**: Groq for AI language model processing
- **Frontend**: React.js for responsive user interface and interactive elements
- **Data Handling**: JSON structures for preserving simulation context, tracking user choices across sessions, and maintaining character state progression

### **Use Cases**

- **Gamers Seeking Immersive Simulation Experiences**:

  Players seeking narrative-driven experiences beyond traditional gaming will find L-AI-fe's decision-consequence framework compelling. The Night City version particularly appeals to cyberpunk fans who want to explore moral complexities in a dystopian setting where each choice reshapes their character's journey, stats, and ultimate fate.

- **Educators and Students** 
  Schools and universities can implement L-AI-fe as an interactive teaching tool for ethics, sociology, and decision theory courses. The simulator creates a dynamic laboratory where students can safely explore the long-term implications of various life choices, fostering critical thinking about causality and personal values in a structured learning environment.

- **Creative Writers and Storytellers** 
  Screenwriters, novelists, and game designers can use L-AI-fe as a narrative prototyping tool to test character arcs and plot developments. By simulating how different personalities might respond to various scenarios, creators can identify compelling storylines, discover unexpected narrative branches, and develop more authentic character progressions for their creative projects.

- **Behavioral Researchers and Social Scientists** 
  Researchers can utilize lAIfe alongside real-world demographic and behavioral data to create models that help understand human decision-making patterns. The simulator provides a controlled environment for testing hypotheses about how various factors influence life outcomes, allowing researchers to compare simulation results against actual population data to refine theories of human behavior and social dynamics.

### **What's Next for lAIfe**

As we continue to develop lAIfe, we're working on a significant expansion that will allow users to start their simulation from the birth of a character and progress through 12 major age stages (childhood, adolescence, young adulthood, etc.). This "full life cycle" approach will enable deeper, more comprehensive life simulations where early decisions cascade into later opportunities and challenges. Additionally, we're exploring integrations with other platforms, enhanced personalization features, and potential applications beyond individual use cases. Our vision is to transform lAIfe from a hackathon project into a tool that helps people gain perspective on past decisions and approach future choices with greater clarity.


## How to Build?

Setup:

1. Git clone the repo
2. `python -m venv env`
3. `source env/bin/activate`
4. `pip install -r requirements.txt`
5. `cd frontend` and `npm install` 
6. Please visit [groq](https://console.groq.com/keys) to create an API Key and Configure your API key as an environment variable by `export GROQ_API_KEY=<your-api-key-here>` in your terminal



Start:

Run the Flask backend:

```
cd backend
python server.py
```

Run the React development server:

```
cd frontend
npm run dev
```



## Project Structure

```
master/
├─ .gitignore
├─ LICENSE
├─ README.md
├─ backend/
│  └─ server.py
├─ frontend/
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public/
│  │  └─ vite.svg
│  ├─ src/
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ Endpage/
│  │  │  └─ index.tsx
│  │  ├─ Gamepage/
│  │  │  └─ index.tsx
│  │  ├─ Initpage/
│  │  │  └─ index.tsx
│  │  ├─ Startpage/
│  │  │  └─ index.tsx
│  │  ├─ assets/
│  │  │  └─ react.svg
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  └─ vite-env.d.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ package-lock.json
├─ package.json
└─ requirements.txt

```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

