# Rich Text Editor


## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Required Dependencies

- react
- react-dom
- react-router-dom
- @tanstack/react-query
- react-hook-form
- zod
- dompurify
- clsx
- class-variance-authority
- date-fns
- lucide-react
- mammoth
- tailwindcss
- tailwindcss-animate
- tailwind-merge
- autoprefixer
- postcss
- @types/react
- @types/react-dom
- @types/node
- typescript
- vite
- @vitejs/plugin-react-swc
- @tailwindcss/typography
- eslint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- typescript-eslint
- globals

## Usage as a Reusable Component

### 1. Wrap your app with the EditorContentProvider

In your main entry point (e.g., `src/main.tsx` or `pages/_app.tsx`):

```tsx
import { EditorContentProvider } from './context/EditorContentContext';

function App({ Component, pageProps }) {
  return (
    <EditorContentProvider>
      <Component {...pageProps} />
    </EditorContentProvider>
  );
}
```

### 2. Use the RichTextEditor component

```tsx
import RichTextEditor from './components/RichTextEditor';

function ProductDescriptionForm() {
  return (
    <div>
      <h2>Edit Product Description</h2>
      <RichTextEditor />
    </div>
  );
}
```

### 3. Access and Save Editor Content

Use the context hook to get the HTML content:

```tsx
import { useEditorContent } from './context/EditorContentContext';

function SaveButton() {
  const { content } = useEditorContent();

  const handleSave = () => {
    // Save `content` to your backend or product database
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### 4. Display the Content

```tsx
function ProductDescription({ html }) {
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

> **Always sanitize HTML on the backend before storing or serving!**

## Features
- WYSIWYG editing
- Code preview
- Table, template, and link insertion
- Customizable toolbar
- Undo/redo, font, color, and alignment tools
- Built with React Context for easy integration

---

For more details, see the source code and comments in the components.


