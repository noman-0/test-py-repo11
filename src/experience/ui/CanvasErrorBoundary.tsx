"use client";

import React from "react";

/** Any error inside the 3D layer degrades to the classic site instead of breaking the page. */
export class CanvasErrorBoundary extends React.Component<
  { onError: (msg: string) => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn("[excelsa-3d] disabled after error:", error);
    this.props.onError(error instanceof Error ? error.message : String(error));
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
