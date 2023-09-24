interface IconProps {
  iconID: string;
}

const Icon = (props: IconProps) => {
  return <i class={"fas fa-fw fa-" + props.iconID} />;
};

export default Icon;
