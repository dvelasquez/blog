import { Head } from "$fresh/runtime.ts";
import { FunctionComponent } from "preact";
const Layout: FunctionComponent<{title: string}> =  ({ title, children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css" />
      </Head>
      {children}
    </div>
  )
}

export { Layout };