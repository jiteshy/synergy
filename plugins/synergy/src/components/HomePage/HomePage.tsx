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
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { TabContent } from '../../utils';

export const HomePage = () => {
  const tabStyles = { fontSize: '16px', padding: '1rem 1.5rem' };
  const config = useApi(configApiRef);
  const hideIssues = config.getOptionalBoolean(
    'synergy.provider.github.hideIssues',
  );

  const issuesDependentTabs: TabContent[] = [
    {
      label: 'Issues',
      style: tabStyles,
      icon: <BugReportIcon fontSize="medium" />,
      children: <Issues />,
    },
    {
      label: 'My Contributions',
      style: tabStyles,
      icon: <CategoryIcon fontSize="medium" />,
      children: <UserIssues />,
    },
    {
      label: 'Stats & Leaderboard',
      style: tabStyles,
      icon: <EqualizerIcon fontSize="medium" />,
      children: <Contributions />,
    },
  ];

  const projectTab: TabContent = {
    label: 'Projects',
    style: tabStyles,
    icon: <ListAltIcon fontSize="medium" />,
    children: <Projects />,
  };

  const allTabs = [projectTab].concat(hideIssues ? [] : issuesDependentTabs);

  return (
    <TabbedCard>
      {allTabs.map(tab => (
        <CardTab label={tab.label} style={tab.style} icon={tab.icon}>
          {tab.children}
        </CardTab>
      ))}
    </TabbedCard>
  );
};
