# Open Api Test frontend

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## Project start

#### Terminal

First you have to add .env.local file ( ask one of devs )
You can start the project using the following command in the terminal.

```bash
npm install
```

```bash
npm run dev
```

### Project Structure

The project follows a basic structure that is typical of an React project:

```html
.
├── README.md
├── public
├── src
│   ├── theme
│   │   ├── [...theme specific hooks, utils, constants and components]
│   │   └── index.ts
│   ├── feature
│   │   ├── [...feature specific hooks, utils, constants and components]
│   │   └── index.ts
│   ├── assets
│   ├── favicon.ico
│   ├── router.tsx
│   ├── main.tsx
│   └── styles.css
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
└── vite.config.js

```

### Technologies Used

The following technologies are used in this project:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)
- [Zustand state-management](https://zustand-demo.pmnd.rs/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

# License

Proprietary software license: This type of license restricts the use, modification, and distribution of the software to the software vendor only. 
The end user is granted a limited right to use the software subject to certain terms and conditions.
