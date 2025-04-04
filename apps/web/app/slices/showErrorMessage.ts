import { message } from 'antd';

export const showErrorMessage = (state: any) => {
  //console.log(state);
  //console.log('state.error', state.error);
  //console.log(typeof state.error);
  if (state.error) {
    let errorTitle = state.error.title;
    let errorErrors = state.error.errors;
    let errorMsg = '';
    if (errorTitle !== undefined) {
      errorMsg = errorTitle + '\n';
    }
    if (errorErrors !== undefined) {
      let errorDetails = '';
      for (let key in errorErrors) {
        let msg = key + ': [\n';
        for (let i = 0; i < errorErrors[key].length; i++) {
          msg += errorErrors[key][i] + '\n';
        }
        msg += ']\n';
        errorDetails += msg;
      }
      if ('' !== errorDetails) {
        errorMsg += errorDetails;
      }
    }
    if ('' !== errorMsg) {
      console.log(errorMsg);
      message.error(errorMsg);
    }
  }
};
