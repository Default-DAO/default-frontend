import React from 'react';
import clsx from 'clsx';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import keys from '../config/keys'
import { useStoreApi } from '../store/provider'

//success / error snackbar with message
const Toast = props => {
  const {showToast, setShowToast} = useStoreApi()
  const { classes } = props;
  const Icon = iconType[showToast.reason]

  return (
    <div className={classes.root}>
      <Snackbar
        open={showToast.show}
        onExiting={() => setShowToast({show: false})}
        onClose={(event, reason) => {
          //prevents toast from disappearing when new toast is triggered. Neither will show if clickaway is enabled
          if (reason && reason == 'clickaway') return
          setShowToast({show: false})
        }}
        autoHideDuration={2000}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={() => setShowToast({show:false})}>
            <CloseIcon className={classes.icon} />
          </IconButton>
        ]}
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            <p className={classes.text} id="message-id">{showToast.text}</p>
          </span>
        }
      >
        <SnackbarContent style={{
            backgroundColor: keys.GRAY,
          }}
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              <p className={classes.text} id="message-id">{showToast.text}</p>
            </span>
          }
        />
      </Snackbar>
    </div>
  );
}

const iconType = {
  success: CheckCircleIcon,
  error: ErrorIcon
};

const useStyles = theme => ({
  root: {
    // backgroundColor: keys.GRAY,
    // color: 'white',
    zIndex: 999999999999
  },
  icon: {
    color: 'white',
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    color: keys.WHITE,
    fontSize: '13px',
    lineHeight: '13px',
    marginBottom: '0px',
    marginTop: '0px'
  }
});

export default withStyles(useStyles)(Toast);