type IconProps = {
  iconID: string;
};

const Icon = (props: IconProps) => {
  return <i class={"fas fa-" + props.iconID} />;
};

export default Icon;
