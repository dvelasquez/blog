import { FunctionalComponent } from "preact";

const Footer: FunctionalComponent = () => (
  <footer>
    Site made by Danilo Velasquez with{" "}
    <a href="https://deno.land/" target="_blank" rel="noopener">Deno</a>,{" "}
    <a href="https://fresh.deno.dev/" target="_blank" rel="noopener">Fresh</a>
    {" "}
    and{" "}
    <a href="https://andybrewer.github.io/mvp/" target="_blank" rel="noopener">
      MVP.css
    </a>
  </footer>
);

export { Footer };
