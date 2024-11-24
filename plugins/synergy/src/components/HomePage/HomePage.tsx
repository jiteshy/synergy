import React from 'react';
import { CardTab, TabbedCard } from '@backstage/core-components';
import ListAltIcon from '@material-ui/icons/ListAlt';
import BugReportIcon from '@material-ui/icons/BugReport';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CategoryIcon from '@material-ui/icons/Category';
import { Projects } from '../Projects';
import { Issues } from '../Issues';
import { UserIssues } from '../UserIssues';
import { Contributions } from '../Contributions';

export const HomePage = () => {
  const tabStyles = { fontSize: '16px', padding: '1rem 1.5rem' };

  return (
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
        icon={<CategoryIcon fontSize="medium" />}
        style={tabStyles}
      >
        <UserIssues />
      </CardTab>
      <CardTab
        label="Stats & Leaderboard"
        icon={<EqualizerIcon fontSize="medium" />}
        style={tabStyles}
      >
        <Contributions />
      </CardTab>
    </TabbedCard>
  );
};
