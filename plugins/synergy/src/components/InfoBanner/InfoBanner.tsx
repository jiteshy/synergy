import React from 'react';
import { Box, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme>(theme => ({
  wrapper: {
    // backgroundColor: theme.palette.infoBackground,
    color: theme.palette.infoText,
    // padding: '0.5rem 0rem 0.15rem'
  },
}));

export const InfoBanner = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Box sx={{ marginTop: '-10px' }}>
        <h4>{title}</h4>
      </Box>
      <Box sx={{ fontSize: '.875rem', marginTop: '-10px' }}>
        <p>{subtitle}</p>
      </Box>
    </div>
  );
};
