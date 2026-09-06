"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToResults() {
  const [hasResultsHistory, setHasResultsHistory] = useState(false);
  useEffect(() => {
    try {
      const referrer = new URL(document.referrer);
      setHasResultsHistory(referrer.origin === window.location.origin && (/^\/actividades/.test(referrer.pathname) || /^\/seccion\//.test(referrer.pathname)));
    } catch { setHasResultsHistory(false); }
  }, []);
  if (hasResultsHistory) {
    return <button className="back-link button-link" onClick={() => history.back()}><ArrowLeft aria-hidden="true" /> Volver a resultados</button>;
  }
  return <Link href="/actividades" className="back-link"><ArrowLeft aria-hidden="true" /> Volver a las actividades</Link>;
}
