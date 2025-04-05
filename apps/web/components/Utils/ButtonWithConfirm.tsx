import { Button, ButtonProps, Modal } from 'antd';
import React from 'react';

const { confirm } = Modal;

interface ButtonWithConfirmProps extends ButtonProps {
  title: string;
  description?: string;

  handleOk: () => void;
  handleCancle?: () => void;
}

const ButtonWithConfirm: React.FC<ButtonWithConfirmProps> = ({
  handleOk,
  handleCancle,
  title,
  description,
  ...props
}) => {
  const showConfirm = () => {
    confirm({
      title: title,
      // Rendering the icon works now (after recent changes on where to load the material icon stuff),
      // but it looks ugly therefore still disabled
      //icon: <span className="material-icons iconSmall">warning</span>,
      content: description,
      okType: 'danger',
      onOk() {
        handleOk();
      },
      onCancel() {
        if (handleCancle) {
          handleCancle();
        }
      },
    });
  };

  return (
    <Button onClick={showConfirm} {...props}>
      {props.children}
    </Button>
  );
};

export default ButtonWithConfirm;
