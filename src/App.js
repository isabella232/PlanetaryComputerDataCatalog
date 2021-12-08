import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { initializeIcons } from "@uifabric/icons";

import NotFound from "./pages/NotFound";
import { usePrefetchContent } from "./utils/requests";
import { initializeFeatures } from "./utils/featureFlags";
import Layout from "./components/Layout";

const Explore = React.lazy(() => import("./pages/Explore"));

function App() {
  initializeIcons(undefined, { disableWarnings: true });
  initializeFeatures();
  usePrefetchContent();

  const pageFallback = (
    <Layout onGrid={false} isShort={true} allowAnnouncement={false}></Layout>
  );

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Switch>
          <Route path="/">
            <Suspense fallback={pageFallback}>
              <Explore />
            </Suspense>
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
