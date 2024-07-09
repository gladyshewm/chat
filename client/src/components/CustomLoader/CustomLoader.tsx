import { Loader } from '@react-three/drei';
import { container, inner, bar, data } from './CustomLoaderStyles';

const CustomLoader = () => {
  return (
    <Loader
      containerStyles={container}
      innerStyles={inner}
      barStyles={bar}
      dataStyles={data}
      dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
      initialState={(active) => active}
    />
  );
};

export default CustomLoader;
