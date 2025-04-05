import Image, { type ImageProps } from 'next/image';
import { ConfigProvider } from 'antd';
import theme from './theme/defaultThemeConfig';
import MainPage from '../components/MainPage';
import '@ant-design/v5-patch-for-react-19';

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
      <MainPage />
    </ConfigProvider>
  );
}
