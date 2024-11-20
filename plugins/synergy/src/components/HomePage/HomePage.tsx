import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { CardTab, TabbedCard } from '@backstage/core-components';
import ListAltIcon from '@material-ui/icons/ListAlt';
import BugReportIcon from '@material-ui/icons/BugReport';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PublishIcon from '@material-ui/icons/Publish';
import { Projects } from '../Projects';
import { Issues } from '../Issues';
import { UserIssues } from '../UserIssues';

const useStyles = makeStyles<Theme>(() => ({
  container: {
    position: 'relative',
  },
}));

export const HomePage = () => {
  const classes = useStyles();
  const tabStyles = { fontSize: '16px', width: '100%', marginTop: '16px' };

  return (
    <div className={classes.container}>
      <TabbedCard>
        <CardTab
          label="Projects"
          icon={<ListAltIcon fontSize="medium" />}
          style={tabStyles}
        >
          <Projects />
        </CardTab>
        <CardTab
          label="Issues"
          icon={<BugReportIcon fontSize="medium" />}
          style={tabStyles}
        >
          <Issues />
        </CardTab>
        <CardTab
          label="My Contributions"
          icon={<PublishIcon fontSize="medium" />}
          style={tabStyles}
        >
          <UserIssues />
        </CardTab>
        <CardTab
          label="Leaderboard"
          icon={<EqualizerIcon fontSize="medium" />}
          style={tabStyles}
        >
          <div>Some content 2</div>
        </CardTab>
      </TabbedCard>
    </div>
  );
};
