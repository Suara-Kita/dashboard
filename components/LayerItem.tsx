import type { Layer } from '@/lib/types';

interface LayerItemProps {
  layer: Layer;
}

export default function LayerItem({ layer }: LayerItemProps) {
  const activeClass = layer.active ? 'text-primary-container' : 'text-on-surface-variant opacity-60';
  const checkIcon = layer.active ? 'check_box' : 'check_box_outline_blank';

  return (
    <div className="flex items-center justify-between p-2 hover:bg-surface-container-high transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30 rounded">
      <div className="flex items-center gap-sm">
        <span className={`material-symbols-outlined text-[18px] ${activeClass}`}>{layer.icon}</span>
        <span className={`text-telemetry-data ${layer.active ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
          {layer.name}
        </span>
      </div>
      <span className={`material-symbols-outlined text-[16px] ${activeClass}`}>{checkIcon}</span>
    </div>
  );
}
