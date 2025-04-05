import Image, { type ImageProps } from 'next/image';
import { ConfigProvider } from 'antd';
import theme from './theme/defaultThemeConfig';
import MainPage from '../components/MainPage';
import { Dynamic } from '../components/Utils/Dynamic';

type Props = Omit<ImageProps, 'src'> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home(): JSX.Element {
  return (
    <ConfigProvider theme={theme}>
      <Dynamic>
        <MainPage />
      </Dynamic>
    </ConfigProvider>
  );
}
