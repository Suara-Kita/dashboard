"use client";

import { LAYERS } from "@/lib/data";
import LayerItem from "./LayerItem";

export default function ColumnLayers() {
  return (
    <div className="w-72 p-sm glass-panel border border-outline-variant rounded-lg flex flex-col overflow-hidden border-glow">
      <div className="p-md border-b border-outline-variant bg-surface-container-lowest">
        <h2 className="font-section-header text-section-header text-primary-fixed-dim uppercase flex items-center justify-between p-2">
          Intelligence Layers
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-sm space-y-xs">
        {LAYERS.map((layer, i) => (
          <LayerItem key={i} layer={layer} />
        ))}
      </div>
    </div>
  );
}
