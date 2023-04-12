import { Head } from "$fresh/runtime.ts";
import { FunctionComponent } from "preact";
import { Footer } from "./Footer.tsx";

export interface LayoutProps {
  title: string;
  description?: string;
  tags?: string[];
}

const Layout: FunctionComponent<LayoutProps> = (
  { title, description, tags, children },
) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="stylesheet" href="/mvp.css" />
        <link rel="stylesheet" href="/extra.css" />
      </Head>
      <header>
        <nav>
          <strong>&#x3c;&#x2f;&#x3e; d13z.dev</strong>
          <ul>
            <li>
              <a href="/posts">Posts</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </nav>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {tags && tags?.length > 0 && tags.map((tag) => <sup>{tag}</sup>)}
      </header>
      {children}
      <Footer />
    </>
  );
};

export { Layout };
