# automatically creates a package.json file with default settings, -y flag skips the interactive setup 
npm init -y

# The package-lock.json file is automatically generated when you run npm install in a Node.js project. It contains an exact snapshot of the entire dependency tree, including specific versions of each package and their dependencies.
# istalls npm according to package.json
npm i

# installs TypeScript locally so you can use it for type-checking and compiling .ts files, -D (or --save-dev) means TypeScript is only used during development (not required in production).
npm i -D typescript

# installs TypeScript type definitions for Node.js as a dev dependency. @types/node provides type definitions for Node’s built-in modules. Required if your TypeScript project uses Node.js features, like: 
# fs (File System)
# http (HTTP server)
# path (Path utilities)
# process (Environment variables)
# __dirname, __filename
# Helps auto-completion and prevents TypeScript errors.
npm i -D @types/node

# tsx is a faster alternative to ts-node for running TypeScript files. It allows running TypeScript files directly without needing to compile (tsc step is skipped). It supports ESM (ECMAScript Modules) and CommonJS. Great for development and hot-reloading.
npm i -D tsx 

# generates a basic tsconfig.json
npx tsc --init

# Recommended tsconfig.json for a Node.js + Express Project:
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}

_"target": "ESNext"	Uses modern JavaScript features._
_"module": "NodeNext"	Enables ESM (import instead of require)._
_"moduleResolution": "NodeNext"	Ensures correct module loading._
_"outDir": "dist"	Compiles output files to dist/._
_"rootDir": "src"	TypeScript source files are in src/._
_"strict": true	Enables strict type checking._
_"esModuleInterop": true	Allows default imports from CommonJS modules._
_"skipLibCheck": true	Speeds up compilation by skipping type checking for libraries._

# installs TypeScript types for Express as a dev dependency.
npm i -D @types/express

# installs the necessary dependencies for your Express.js server
# express -	Web framework for handling routes, middleware, and APIs.
# cors - Enables Cross-Origin Resource Sharing (CORS) for API access from different domains.
# body-parser - Parses incoming JSON or URL-encoded request bodies. (Not needed for Express 4.16+ since express.json() and express.urlencoded() are built-in.)
# fs - Node.js file system module (already built-in, so no need to install separately).
npm install express cors body-parser fs

# scripts part in package.json:
# tsx → Runs your TypeScript file without compiling (npx tsx src/index.ts).
# --no-check → Disables type checking for faster execution (useful for development).
# --watch → Automatically restarts the server when files change (hot-reloading).
# src/index.ts → Entry file of your app. MUST EXIST!!!

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "tsx --no-check --watch src/index.ts"
  },

# activated with :
npm run dev