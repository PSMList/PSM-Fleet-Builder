interface IconProps {
  id: string;
  color?: string;
}

export function Icon(props: IconProps) {
  return (
    <i class={`fas fa-fw fa-${props.id}`} style={{ color: props.color }} />
  );
}
